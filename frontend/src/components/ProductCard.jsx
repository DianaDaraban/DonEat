import React from "react";
import '../styles/ProductCard.css'

function ProductCard({ product }) {

    return (
        <div className="p-8 m-15 rounded-md shadow-xl mb-4 product-card">
            <h2 className="product-name">{product.productName}</h2>
            <div className="product-price">Price: <span>${product.price}</span></div>
            <div className="product-vendor">Vendor:<span>{product.vendorName}</span></div>
            <div className="product-description">Description: <div>{product.productDescription}</div></div>
        </div>
    );
}

export default ProductCard;