import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const Dashboard = () => {
    const stats = [
        { title: 'Total Users', value: 150, icon: 'fa-users' },
        { title: 'Total Products', value: 300, icon: 'fa-box' },
        { title: 'Total Categories', value: 10, icon: 'fa-tags' },
        { title: 'Total Comments', value: 500, icon: 'fa-comments' },
    ];

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const data = {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [{
                label: 'Revenue ($)',
                data: [3200, 2800, 3400, 4100, 3900],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }],
        };

        const options = {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Monthly Revenue' },
            },
            scales: {
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue ($)',
                    },
                },
            },
        };

        // Nếu có chart trước đó thì destroy để tránh bị trùng
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(chartRef.current.getContext('2d'), {
            type: 'bar',
            data: data,
            options: options,
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []); // Chạy 1 lần khi component mount

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Dashboard</h2>
            <div className="row">
                {stats.map((stat, index) => (
                    <div className="col-md-3 mb-4" key={index}>
                        <div className="card shadow-sm">
                            <div className="card-body d-flex align-items-center">
                                <i className={`fa ${stat.icon} fa-2x mr-3 text-primary`}></i>
                                <div>
                                    <h5 className="card-title mb-0">{stat.title}</h5>
                                    <p className="card-text text-muted">{stat.value}</p>
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
                        <div className="card-body">
                            <canvas ref={chartRef} style={{ maxHeight: '300px' }}></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
