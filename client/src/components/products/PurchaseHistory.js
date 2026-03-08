import React from 'react';

export const PurchaseHistory = () => {
    const mockPurchases = [
        {
            id: 'ORD-2024-001',
            date: '2024-03-01',
            items: [
                { name: 'Smartphone X', quantity: 1, price: 799.99 },
                { name: 'Protective Case', quantity: 1, price: 29.99 }
            ],
            total: 829.98,
            status: 'Delivered'
        },
        {
            id: 'ORD-2024-002',
            date: '2024-03-05',
            items: [
                { name: 'Wireless Headphones', quantity: 1, price: 199.99 }
            ],
            total: 199.99,
            status: 'Processing'
        }
    ];

    return (
        <div className="products-container">
            <h1 className="page-title">Purchase History</h1>
            {mockPurchases.length > 0 ? (
                <div className="table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPurchases.map((purchase) => (
                                <tr key={purchase.id}>
                                    <td><span className="order-id">{purchase.id}</span></td>
                                    <td>{new Date(purchase.date).toLocaleDateString()}</td>
                                    <td>
                                        <ul className="purchase-items-list">
                                            {purchase.items.map((item, index) => (
                                                <li key={index}>
                                                    {item.name} (x{item.quantity})
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td><span className="product-price">€{purchase.total.toFixed(2)}</span></td>
                                    <td>
                                        <span className={`status-badge ${purchase.status.toLowerCase()}`}>
                                            {purchase.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-cart">
                    <p>You haven't made any purchases yet.</p>
                    <a href="/products" className="nav-link" style={{ background: '#3498db', display: 'inline-block', marginTop: '20px' }}>
                        Start Shopping
                    </a>
                </div>
            )}
        </div>
    );
};

