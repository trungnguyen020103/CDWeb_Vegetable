import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchCategories();
    }, []);

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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
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
                    await fetchCategories();
                    handleCloseModal();
                }
            } else {
                const response = await axios.post('http://localhost:8080/admin/category/add', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 201) {
                    await fetchCategories();
                    handleCloseModal();
                }
            }
            setError(null);
        } catch (error) {
            console.error('Error processing category:', error);
            setError(error.response?.data?.message || 'An error occurred while processing the category. Please try again.');
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
                await fetchCategories();
                setShowDeleteModal(false);
                setDeleteCategoryId(null);
                setError(null);
            }
        } catch (error) {
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

    // Filter categories based on search term
    const filteredCategories = categories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Category Management</h2>
                <div className="d-flex align-items-center">
                    <input
                        type="text"
                        className="form-control me-2"
                        style={{ maxWidth: '200px' }}
                        placeholder="Search by name or description"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <i className="fas fa-plus me-1"></i> Add Category
                    </button>
                </div>
            </div>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>{category.description || '-'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            title="Edit"
                                            onClick={() => handleEdit(category)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            title="Delete"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-end mt-3">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
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