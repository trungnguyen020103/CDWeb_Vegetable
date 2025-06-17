import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useToast } from '../../../Toast/ToastContext';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        description: '',
        price: '',
        stock: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [error, setError] = useState('');
    const token = localStorage.getItem('accessToken');
    const { showToast } = useToast();
    const tableRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (window.$ && products.length > 0) {
            if (!tableRef.current) {
                tableRef.current = window.$('#productTable').DataTable({
                    destroy: true,
                    data: products,
                    columns: [
                        { data: 'id' },
                        { data: 'name' },
                        { data: 'category.name', defaultContent: '-' },
                        {
                            data: 'price',
                            render: (data) => data.toLocaleString('vi-VN'),
                        },
                        { data: 'stock' },
                        {
                            data: 'imageUrl',
                            render: (data, type, row) =>
                                `<img src="${data}" alt="${row.name}" style="width: 50px; height: 50px; object-fit: cover;" />`,
                        },
                        {
                            data: null,
                            render: (data) => `
                <button class="btn btn-sm btn-warning me-2 edit-product" data-id="${data.id}">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-product" data-id="${data.id}">
                  <i class="fas fa-trash-alt"></i>
                </button>
              `,
                        },
                    ],
                });
                window.$('#productTable').on('click', '.edit-product', function () {
                    const productId = window.$(this).data('id');
                    const product = products.find((p) => p.id === productId);
                    handleEdit(product);
                });

                window.$('#productTable').on('click', '.delete-product', function () {
                    const productId = window.$(this).data('id');
                    handleDelete(productId);
                });
            } else {
                tableRef.current.clear();
                tableRef.current.rows.add(products).draw();
            }
        }

        // Cleanup
        return () => {
            if (tableRef.current) {
                tableRef.current.destroy();
                tableRef.current = null;
                window.$('#productTable').off('click'); // Remove event listeners
            }
        };
    }, [products]);

    const fetchProducts = async () => {
        try {
            if (!token) throw new Error('No access token found');
            const response = await axios.get('http://localhost:8080/admin/product/getall', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            showToast('Tải danh sách không thành công', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setError('Vui lòng chọn file ảnh định dạng JPG, PNG hoặc GIF.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('Kích thước file ảnh không được vượt quá 5MB.');
                return;
            }
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, image: null });
            setImagePreview(null);
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Validate
        if (!isEditMode && !formData.image) {
            setError('Vui lòng chọn hình ảnh cho sản phẩm.');
            return;
        }
        if (!formData.name.trim()) {
            setError('Tên sản phẩm không được để trống.');
            return;
        }
        if (!formData.categoryId || isNaN(parseInt(formData.categoryId)) || parseInt(formData.categoryId) < 1) {
            setError('ID danh mục phải là số dương.');
            return;
        }
        if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
            setError('Giá phải là số không âm.');
            return;
        }
        if (!formData.stock || isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
            setError('Số lượng tồn kho phải là số không âm.');
            return;
        }

        const productDto = {
            name: formData.name.trim(),
            description: formData.description?.trim() || '',
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            categoryId: parseInt(formData.categoryId),
        };

        const formDataToSend = new FormData();
        formDataToSend.append('product', new Blob([JSON.stringify(productDto)], { type: 'application/json' }));
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            if (!token) throw new Error('No access token found');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            if (isEditMode) {
                const response = await axios.put(`http://localhost:8080/admin/product/${editProductId}`, formDataToSend, config);
                if (response.status === 200) {
                    // Update product
                    setProducts((prevProducts) =>
                        prevProducts.map((product) =>
                            product.id === editProductId
                                ? { ...product, ...productDto, imageUrl: response.data.imageUrl || product.imageUrl }
                                : product
                        )
                    );
                    handleCloseModal();
                    showToast('Cập nhật thành công', 'success');
                }
            } else {
                const response = await axios.post('http://localhost:8080/admin/product/add', formDataToSend, config);
                if (response.status === 201) {
                    // Add the new product
                    setProducts((prevProducts) => [...prevProducts, response.data]);
                    handleCloseModal();
                    showToast('Thêm sản phẩm thành công!!', 'success');
                }
            }
        } catch (error) {
            console.error('Error processing product:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
            });
            let errorMessage = 'Có lỗi xảy ra khi xử lý. Vui lòng thử lại.';
            if (error.response) {
                if (error.response.status === 400) {
                    errorMessage = error.response.data.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
                } else if (error.response.status === 401) {
                    errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
                } else if (error.response.status === 500) {
                    errorMessage = error.response.data.message || 'Lỗi server. Vui lòng thử lại sau.';
                }
            }
            setError(errorMessage);
            showToast(errorMessage, 'error');
        }
    };

    const handleEdit = (product) => {
        setIsEditMode(true);
        setEditProductId(product.id);
        setFormData({
            name: product.name,
            categoryId: product.category?.id || '',
            description: product.description || '',
            price: product.price || '',
            stock: product.stock || '',
            image: null,
        });
        setImagePreview(product.imageUrl || null);
        setShowModal(true);
        setError('');
    };

    const handleDelete = (productId) => {
        setDeleteProductId(productId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            if (!token) throw new Error('No access token found');
            const response = await axios.delete(`http://localhost:8080/admin/product/delete/${deleteProductId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 204) {
                // delete product
                setProducts((prevProducts) => prevProducts.filter((product) => product.id !== deleteProductId));
                setShowDeleteModal(false);
                setDeleteProductId(null);
                showToast('Xóa thành công', 'success');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditProductId(null);
        setFormData({
            name: '',
            categoryId: '',
            description: '',
            price: '',
            stock: '',
            image: null,
        });
        setImagePreview(null);
        setError('');
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteProductId(null);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Product Management</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus me-1"></i> Thêm sản phẩm
                </button>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table id="productTable" className="table table-bordered table-hover">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price (VND)</th>
                                <th>Stock</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody></tbody> {/* Let DataTable populate the tbody */}
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit Product */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditMode ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                {error && <div className="alert alert-danger">{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Tên sản phẩm</label>
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
                                        <label htmlFor="categoryId" className="form-label">ID danh mục</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="categoryId"
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            step="1"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Mô tả</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="price" className="form-label">Giá (VND)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="stock" className="form-label">Số lượng tồn</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="stock"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            step="1"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">Hình ảnh</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            name="image"
                                            accept="image/jpeg,image/png,image/gif"
                                            onChange={handleFileChange}
                                            required={!isEditMode}
                                        />
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
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
                                <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
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

export default ProductManagement;