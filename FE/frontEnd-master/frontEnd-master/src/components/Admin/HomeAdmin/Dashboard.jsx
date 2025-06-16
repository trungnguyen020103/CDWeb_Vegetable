import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState([
        { title: 'Total Users', value: 0, icon: 'fa-users' },
        { title: 'Total Products', value: 0, icon: 'fa-box' },
        { title: 'Total Categories', value: 0, icon: 'fa-tags' },
        { title: 'Total Comments', value: 0, icon: 'fa-comments' },
    ]);
    const [error, setError] = useState(null); // Added error state
    const token = localStorage.getItem('accessToken');
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/dashboard/stats?year=2025', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response.data;

                // Update statistics
                setStats([
                    { title: 'Total Users', value: data.totalUsers, icon: 'fa-users' },
                    { title: 'Total Products', value: data.totalProducts, icon: 'fa-box' },
                    { title: 'Total Categories', value: data.totalCategories, icon: 'fa-tags' },
                    { title: 'Total Comments', value: data.totalComments, icon: 'fa-comments' },
                ]);

                // Prepare chart data
                const labels = data.monthlyRevenue.map(item => item.month);
                const revenues = data.monthlyRevenue.map(item => item.revenue);

                const chartData = {
                    labels: labels,
                    datasets: [{
                        label: 'Revenue (VND)',
                        data: revenues,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        barPercentage: 0.5,
                    }],
                };

                const chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Monthly Revenue 2025' },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const value = context.raw || 0;
                                    return `${context.dataset.label}: ${value.toLocaleString('vi-VN')} VND`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: { display: true, text: 'Month' },
                            ticks: { maxRotation: 0, minRotation: 0 },
                        },
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Revenue (VND)' },
                            ticks: {
                                callback: (value) => `${value.toLocaleString('vi-VN')} VND`,
                            },
                        },
                    },
                };

                // Destroy existing chart instance if it exists
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                // Create new chart instance
                chartInstance.current = new Chart(chartRef.current.getContext('2d'), {
                    type: 'bar',
                    data: chartData,
                    options: chartOptions,
                });

            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setError('Failed to load dashboard data. Please try again later.'); // Use setError here
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Dashboard</h2>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <div className="row">
                {stats.map((stat, index) => (
                    <div className="col-md-3 mb-4" key={index}>
                        <div className="card shadow-sm h-100">
                            <div className="card-body d-flex align-items-center">
                                <i className={`fa ${stat.icon} fa-2x me-3 text-primary`}></i>
                                <div>
                                    <h5 className="card-title mb-0">{stat.title}</h5>
                                    <p className="card-text text-muted">{stat.value.toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <canvas ref={chartRef} style={{ maxHeight: '400px' }}></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;