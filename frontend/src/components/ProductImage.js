import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../ProductImage.css';

const ProductImage = ({ src, alt, width = 300, height = 300 }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  return (
    <div className="image-container">
      {!imageError ? (
        <img
          src={src}
          alt={alt || 'Product image'}
          loading="lazy"
          className={`product-image ${imageLoaded ? 'loaded' : 'loading'}`}
          onError={handleError}
          onLoad={() => setImageLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            backgroundColor: imageLoaded ? 'transparent' : '#f5f5f5'
          }}
        />
      ) : (
        <div className="image-fallback">
          <span>No Image Available</span>
        </div>
      )}
      {!imageLoaded && !imageError && (
        <div className="image-skeleton" />
      )}
    </div>
  );
};

ProductImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default ProductImage;