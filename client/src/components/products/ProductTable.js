import React, { useState, useEffect } from 'react';
import { ProductTableRow } from './ProductTableRow';

export const ProductTable = ({ products, onRowClick, isAdmin, onEditClick }) => {
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 600 && window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsTablet(width >= 600 && width <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="table-container">
            <table className="products-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>

                        {!isTablet && (
                            <>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Stock</th>
                            </>
                        )}

                        <th>Details</th>
                        {isAdmin && <th>Admin</th>}
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <ProductTableRow
                            key={product._id}
                            product={product}
                            isTablet={isTablet}
                            onClick={() => onRowClick(product)}
                            isAdmin={isAdmin}
                            onEditClick={() => onEditClick(product)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};