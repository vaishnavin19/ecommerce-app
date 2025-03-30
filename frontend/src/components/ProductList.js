import React from "react";
import "../ProductList.css";
import ProductImage from "./ProductImage";

const ProductList = ({ products, onAddToCart }) => {
  const validProducts = products.filter((product) => {
    return (
      product["Variant SKU"] &&
      product["Variant Price"] !== undefined &&
      product["Variant Price"] !== null &&
      product["Variant Price"] !== "" &&
      product.Title
    );
  });

  return (
    <div className="product-list">
      {validProducts.map((product) => (
        <div key={product._id} className="product-card">
          <div className="product-image-container">
            <ProductImage
              src={product["Image Src"]}
              alt={product.Title}
              width={225}
              height={200}
            />
          </div>
          <div className="product-info">
            <h3 className="product-title">{product.Title}</h3>
            <div className="product-details">
              <p className="product-sku">SKU: {product["Variant SKU"]}</p>
              <p className="product-price">
                ${Number(product["Variant Price"])?.toFixed(2)}
              </p>
            </div>
            <button 
              className="add-to-cart-btn"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;