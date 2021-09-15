import { Tooltip, Checkbox, IconButton } from "@material-ui/core";
import { HeartIcon, TrashIcon } from "components/Icons";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useState, useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { ProductItem } from "store/interfaces";
import { imageLoader } from "utils";

import { CartActions } from "store/reducers/cart";

interface Props {
  productItem: ProductItem;
  index: number;
}

const CartItem: FC<Props> = ({ productItem, index }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    setCount(productItem.qty);
    return () => {
      setCount(0);
    };
  }, [productItem]);

  const dispatch = useDispatch();

  const removeItemFromBasket = () => {
    dispatch(
      CartActions.UPDATE_CART_REQUEST({
        req: {
          action_type: "remove_item",
          product_id: productItem.product._id,
        },
      })
    );
  };

  const handleToggleCheckProduct = (e) => {
    const { checked } = e.target;
    dispatch(
      CartActions.UPDATE_CART_REQUEST({
        req: {
          action_type: "toggle",
          index: index.toString(),
          isSelected: checked,
          value: checked,
        },
      })
    );
  };

  const handlePlusProduct = () => {
    dispatch(
      CartActions.UPDATE_CART_REQUEST({
        req: {
          action_type: "updateQty",
          product_id: productItem.product._id,
          qty: count + 1,
        },
      })
    );
    setCount((prev) => prev + 1);
  };

  const handleMinusProduct = () => {
    dispatch(
      CartActions.UPDATE_CART_REQUEST({
        req: {
          action_type: "updateQty",
          product_id: productItem.product._id,
          qty: count - 1,
        },
      })
    );
    setCount((prev) => prev - 1);
  };

  return (
    <div className="grid-container-fluid grid-5 grid-sm-3 cart-item">
      <div className="checkbox-container-start">
        <Checkbox
          className="checkbox-custom"
          checked={productItem?.is_selected || false}
          onChange={handleToggleCheckProduct}
          inputProps={{ "aria-label": "primary checkbox" }}
        />
        <Image
          loader={imageLoader}
          src={
            productItem?.thumbnail
              ? productItem.thumbnail
              : "/images/media/default.png"
          }
          width={100}
          height={100}
          objectFit="contain"
          alt="image product"
        />
      </div>
      <div className="grid-col-2-4 grid-col-sm-2-4">
        <Link href={productItem?.product ? productItem.product.slug : "/"}>
          <a className="item-title">{productItem.name}</a>
        </Link>

        <div className="price-wrap">
          <div className="sale-of-div">
            <span className="original-price">
              ${productItem?.product?.original_price || 0}
            </span>
          </div>
          {productItem?.price && (
            <>
              <span className="sale-of-percent">Sale off</span>
              <div className="price hasSaleOf">
                <span>${productItem?.price || 0}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="grid-col-sm-1-3 actions-group">
        <div className="update-qty-group cart-btn-qty">
          <IconButton
            disabled={
              count == 0 ||
              productItem.product.stock_availability !== "in-stock"
            }
            onClick={handleMinusProduct}
            className={`btn-decrease-qty ${count == 0 ? "disabled" : ""}`}
          >
            <FaMinus />
          </IconButton>
          <span className="qty-number">{count}</span>
          <IconButton
            disabled={productItem.product.stock_availability !== "in-stock"}
            onClick={handlePlusProduct}
            className={`btn-increase-qty ${
              productItem.product.stock_availability !== "in-stock"
                ? "disabled"
                : ""
            }`}
          >
            <FaPlus />
          </IconButton>
        </div>
        <div className="actions-wrapper">
          <div className="heart">
            <Tooltip arrow title="Add to Wishlist" placement="top">
              <HeartIcon />
            </Tooltip>
          </div>
          <div onClick={removeItemFromBasket} className="delete">
            <Tooltip arrow title="Remove" placement="top">
              <TrashIcon />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
