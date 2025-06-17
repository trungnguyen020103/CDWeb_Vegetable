import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useToast } from '../../../Toast/ToastContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullname: '',
        address: '',
        phonenumber: '',
    });
    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
        fullname: '',
        phonenumber: '',
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const token = localStorage.getItem('accessToken');
    const { showToast } = useToast();
    const tableRef = useRef(null);

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) ? '' : 'Email không hợp lệ';
    };

    const validatePassword = (password) => {
        if (!password) return isEditMode ? '' : 'Mật khẩu là bắt buộc';
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%])[A-Za-z\d@#$%]{8,}$/;
        return passwordRegex.test(password)
            ? ''
            : 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@#$%)';
    };

    const validatePhoneNumber = (phonenumber) => {
        if (!phonenumber) return '';
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        return phoneRegex.test(phonenumber) ? '' : 'Số điện thoại không hợp lệ (VD: 0987654321 hoặc +84987654321)';
    };

    const validateFullname = (fullname) => {
        return fullname.trim() ? '' : 'Họ tên là bắt buộc';
    };

    // Validate form
    const validateForm = () => {
        const errors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            fullname: validateFullname(formData.fullname),
            phonenumber: validatePhoneNumber(formData.phonenumber),
        };
        setFormErrors(errors);
        return Object.values(errors).every((error) => error === '');
    };

    // Fetch users initially
    useEffect(() => {
        fetchUsers();
    }, []);

    // Initialize or update DataTable
    useEffect(() => {
        if (window.$ && users.length > 0) {
            if (!tableRef.current) {
                tableRef.current = window.$('#userTable').DataTable({
                    destroy: true,
                    data: users,
                    columns: [
                        { data: 'id' },
                        { data: 'fullname' },
                        { data: 'email' },
                        { data: 'address', defaultContent: '-' },
                        { data: 'phonenumber', defaultContent: '-' },
                        {
                            data: null,
                            render: (data) => `
                <button class="btn btn-sm btn-warning me-2 toggle-role" data-id="${data.id}">
                  Chuyển ${data.role === 0 ? 'User' : 'Admin'}
                </button>
              `,
                        },
                        {
                            data: null,
                            render: (data) => `
                <button class="btn btn-sm btn-danger delete-user" data-id="${data.id}">
                  <i class="fas fa-trash-alt"></i>
                </button>
              `,
                        },
                    ],
                });

                window.$('#userTable').on('click', '.toggle-role', function () {
                    const userId = window.$(this).data('id');
                    handleToggleRole(userId);
                });

                window.$('#userTable').on('click', '.edit-user', function () {
                    const userId = window.$(this).data('id');
                    const user = users.find((u) => u.id === userId);
                    handleEdit(user);
                });

                window.$('#userTable').on('click', '.delete-user', function () {
                    const userId = window.$(this).data('id');
                    handleDelete(userId);
                });
            } else {
                tableRef.current.clear();
                tableRef.current.rows.add(users).draw();
            }
        }

        return () => {
            if (tableRef.current) {
                tableRef.current.destroy();
                tableRef.current = null;
                window.$('#userTable').off('click');
            }
        };
    }, [users]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/user/getAll', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            showToast('Lỗi khi tải danh sách người dùng', 'error');
            console.error('Lỗi khi tải danh sách người dùng:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validate

        if (name === 'email') setFormErrors({ ...formErrors, email: validateEmail(value) });
        else if (name === 'password') setFormErrors({ ...formErrors, password: validatePassword(value) });
        else if (name === 'fullname') setFormErrors({ ...formErrors, fullname: validateFullname(value) });
        else if (name === 'phonenumber') setFormErrors({ ...formErrors, phonenumber: validatePhoneNumber(value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast('Vui lòng sửa các lỗi trong biểu mẫu', 'error');
            return;
        }

        try {
            if (isEditMode) {
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;

                const response = await axios.put(`http://localhost:8080/admin/user/update/${editUserId}`, updateData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 200) {
                    setUsers((prevUsers) =>
                        prevUsers.map((user) => (user.id === editUserId ? { ...user, ...updateData } : user))
                    );
                    handleCloseModal();
                    showToast('Cập nhật thành công', 'success');
                }
            } else {
                const response = await axios.post('http://localhost:8080/admin/user/add', formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 201) {
                    setUsers((prevUsers) => [...prevUsers, response.data]);
                    handleCloseModal();
                    showToast('Thêm người dùng thành công', 'success');
                }
            }
        } catch (error) {
            console.error('Lỗi khi xử lý người dùng:', error);
            showToast('Lỗi khi xử lý người dùng', 'error');
        }
    };

    const handleToggleRole = async (userId) => {
        try {
            const response = await axios.put(`http://localhost:8080/admin/user/changerole/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const updatedUser = response.data;
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
            );
            showToast('Đổi quyền thành công', 'success');
        } catch (error) {
            console.error('Lỗi đổi role:', error);
            showToast('Lỗi khi đổi quyền người dùng', 'error');
        }
    };

    const handleEdit = (user) => {
        setIsEditMode(true);
        setEditUserId(user.id);
        setFormData({
            email: user.email,
            password: '',
            fullname: user.fullname,
            address: user.address || '',
            phonenumber: user.phonenumber || '',
        });
        setFormErrors({
            email: '',
            password: '',
            fullname: '',
            phonenumber: '',
        });
        setShowModal(true);
    };

    const handleDelete = (userId) => {
        setDeleteUserId(userId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/admin/user/delete/${deleteUserId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteUserId));
                setShowDeleteModal(false);
                setDeleteUserId(null);
                showToast('Xóa người dùng thành công', 'success');
            }
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
            showToast('Lỗi khi xóa', 'error');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditUserId(null);
        setFormData({
            email: '',
            password: '',
            fullname: '',
            address: '',
            phonenumber: '',
        });
        setFormErrors({
            email: '',
            password: '',
            fullname: '',
            phonenumber: '',
        });
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteUserId(null);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">User Management</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus me-1"></i> Thêm user
                </button>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="userTable" className="table table-bordered table-hover">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Phone Number</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit User */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditMode ? 'Sửa User' : 'Thêm User'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                                    </div>
                                    {!isEditMode && (
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input
                                                type="password"
                                                className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                                        </div>
                                    )}
                                    {isEditMode && (
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password (để trống nếu không đổi)</label>
                                            <input
                                                type="password"
                                                className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                            {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label htmlFor="fullname" className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formErrors.fullname ? 'is-invalid' : ''}`}
                                            id="fullname"
                                            name="fullname"
                                            value={formData.fullname}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {formErrors.fullname && <div className="invalid-feedback">{formErrors.fullname}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phonenumber" className="form-label">Phone Number</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formErrors.phonenumber ? 'is-invalid' : ''}`}
                                            id="phonenumber"
                                            name="phonenumber"
                                            value={formData.phonenumber}
                                            onChange={handleInputChange}
                                        />
                                        {formErrors.phonenumber && <div className="invalid-feedback">{formErrors.phonenumber}</div>}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                            Đóng
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {isEditMode ? 'Cập nhật' : 'Thêm'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Delete Confirmation */}
            {showDeleteModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận xóa</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                                    Hủy
                                </button>
                                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;