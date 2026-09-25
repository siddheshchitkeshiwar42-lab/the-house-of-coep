import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { formatCurrency } from '../utils/formatCurrency';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;

  return (
    <div className="cart-item-row">
      {/* Product Info Cell */}
      <div className="cart-item-product">
        <Link to={`/product/${product.id}`} className="cart-item-thumb-link">
          <div className="cart-item-thumb">
            <ProductImage
              src={product.image}
              alt={product.name}
              productId={product.id}
              category={product.category}
            />
          </div>
        </Link>
        <div className="cart-item-details">
          <Link to={`/product/${product.id}`} className="cart-item-title">
            {product.name}
          </Link>
          <span className="cart-item-tag">{product.category}</span>
          <span className="cart-item-mobile-price">
            {formatCurrency(product.price)} each
          </span>
        </div>
      </div>

      {/* Unit Price Cell (Desktop) */}
      <div className="cart-item-price-unit">
        {formatCurrency(product.price)}
      </div>

      {/* Quantity Stepper Cell */}
      <div className="cart-item-quantity">
        <div className="cart-qty-stepper">
          <button
            type="button"
            className="cart-qty-btn"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="cart-qty-num">{quantity}</span>
          <button
            type="button"
            className="cart-qty-btn"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            disabled={quantity >= (product.stock || 50)}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Line Total Cell */}
      <div className="cart-item-total">
        {formatCurrency(product.price * quantity)}
      </div>

      {/* Remove Action Cell */}
      <div className="cart-item-actions">
        <button
          type="button"
          className="cart-remove-btn"
          onClick={() => onRemove(product.id)}
          title="Remove item"
          aria-label="Remove item from cart"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
