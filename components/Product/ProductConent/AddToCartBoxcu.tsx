import React, { useState, FC } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import WishlistButton from "./WishlistButton";
import { useDispatch } from "react-redux";

interface Props {
  onAddToCart: (qty:number) => void;
  product: any
}

const AddToCartBox: FC<Props> = ({ onAddToCart, product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [number] = useState({
    maxQty: 6,
  });

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQty = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="add-to-cart-box">
      <div className="qty-wraper">
        <div className="update-qty-group">
          <span className="quantity-title">QTY</span>
          <div className="quantity-buttons">
            <span
              className={`btn-decrease-qty ${quantity === 1 ? "disabled" : ""}`}
              onClick={handleDecreaseQty}
            >
              <FaMinus />
            </span>
            <span className="qty-number">{quantity}</span>
            <span
              className={`btn-increase-qty ${
                quantity === number.maxQty ? 'disabled' : ''
              }`}
              onClick={handleIncreaseQty}
            >
              <FaPlus />
            </span>
          </div>
        </div>
      </div>
      <div className="cart-area">
        <button onClick={() => onAddToCart(quantity)} className="btn btn-add-to-cart">
          <span className="text">Add To Cart</span>
        </button>
        <WishlistButton product={product} />
      </div>
    </div>
  );
};

export default AddToCartBox;
