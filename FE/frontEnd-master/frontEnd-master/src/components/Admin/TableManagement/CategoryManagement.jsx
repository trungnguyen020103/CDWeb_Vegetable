import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from "../../../Toast/ToastContext";

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('accessToken');
    const { showToast } = useToast();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0 && window.$) {
            const table = window.$('#categoryTable').DataTable({
                destroy: true,
                data: categories,
                columns: [
                    { data: 'id' },
                    { data: 'name' },
                    {
                        data: 'description',
                        render: (data) => data || '-'
                    },
                    {
                        data: null,
                        render: (data) => `
                            <button class="btn btn-sm btn-warning me-2 edit-category" data-id="${data.id}" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-category" data-id="${data.id}" title="Delete">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        `,
                    },
                ],
                pageLength: 5,
                language: {
                    search: "Search by name or description:",
                    searchPlaceholder: "Enter term..."
                }
            });


            window.$('#categoryTable').on('click', '.edit-category', function () {
                const categoryId = window.$(this).data('id');
                const category = categories.find((c) => c.id === categoryId);
                handleEdit(category);
            });

            window.$('#categoryTable').on('click', '.delete-category', function () {
                const categoryId = window.$(this).data('id');
                handleDelete(categoryId);
            });

            return () => {
                table.destroy();
            };
        }
    }, [categories]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError(error.response?.data?.message || 'Failed to fetch categories. Please check your authentication or try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                const response = await axios.put(`http://localhost:8080/admin/category/update/${editCategoryId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setCategories((prevCategories) =>
                        prevCategories.map((category) =>
                            category.id === editCategoryId ? { ...category, ...formData } : category
                        )
                    );
                    showToast('Cập nhật thành công', 'success');
                    handleCloseModal();
                }
            } else {
                const response = await axios.post('http://localhost:8080/admin/category/add', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 201) {
                    setCategories((prevCategories) => [...prevCategories, response.data]);
                    showToast('Thêm danh mục thành công', 'success');
                    handleCloseModal();
                }
            }
            setError(null);
        } catch (error) {
            console.error('Error processing category:', error);
            setError(error.response?.data?.message || 'An error occurred while processing the category. Please try again.');
            showToast('Lỗi khi xử lý danh mục', 'error');
        }
    };

    const handleEdit = (category) => {
        setIsEditMode(true);
        setEditCategoryId(category.id);
        setFormData({
            name: category.name,
            description: category.description || ''
        });
        setShowModal(true);
        setError(null);
    };

    const handleDelete = (categoryId) => {
        setDeleteCategoryId(categoryId);
        setShowDeleteModal(true);
        setError(null);
    };

    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/admin/category/delete/${deleteCategoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setCategories((prevCategories) =>
                    prevCategories.filter((category) => category.id !== deleteCategoryId)
                );
                showToast('Xóa thành công', 'success');
                setShowDeleteModal(false);
                setDeleteCategoryId(null);
                setError(null);
            }
        } catch (error) {
            showToast('Lỗi khi xóa', 'error');
            console.error('Error deleting category:', error);
            setError(error.response?.data?.message || 'An error occurred while deleting the category. Please try again.');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditCategoryId(null);
        setFormData({
            name: '',
            description: ''
        });
        setError(null);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteCategoryId(null);
        setError(null);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Category Management</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus me-1"></i> Add Category
                </button>
            </div>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="categoryTable" className="table table-bordered table-hover">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit Category */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditMode ? 'Edit Category' : 'Add Category'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                            Close
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {isEditMode ? 'Update' : 'Add'}
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
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this category?</p>
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;