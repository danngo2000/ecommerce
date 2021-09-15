import React, { FC } from "react";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { Tooltip } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAppSelector } from "utils/redux";
import CartItem from "./CartItem";
import Image from "next/image";
import { imageLoader } from "utils";

import { ProductItem } from "store/interfaces";

const CartContent: FC = () => {
  const { cartData } = useAppSelector((state) => state.cart);
  const router = useRouter();

  return (
    <div className="cart-container">
      <div className="wrap">
        <div className="container cart-page-box">
          <div className="cart-header">
            <h1>Cart ({cartData?.items_count || 0} item)</h1>
          </div>
        </div>
        <div className="cart-content container grid-3 grid-sm-1">
          <div className="grid-col-1-2 grid-col-sm-1 main-box">
            <h4 className="standard-delivery">
              Standard Delivery &nbsp;
              <span>
                <Tooltip
                  arrow
                  title="Estimated delivery time from your postcode"
                  placement="top"
                >
                  <InfoOutlinedIcon />
                </Tooltip>
              </span>
            </h4>
            {cartData?.items &&
              cartData.items.map((item: ProductItem, indexProduct: number) => (
                <CartItem
                  key={item._id}
                  productItem={item}
                  index={indexProduct}
                />
              ))}
          </div>
          <div className="main-box checkout-area">
            <div className="cart-totals">
              <div className="shipping-container">
                <p className="shipping-text">$33.66 to FREE shipping!</p>
                <div className="shipping-progressbar-container">
                  <div className="bp3-progress-bar bp3-no-stripes custom-progress-bar">
                    <div
                      className="bp3-progress-meter"
                      style={{ width: "33.33%" }}
                    ></div>
                  </div>
                  <div className="freeshipping-truck">
                    <div className="truck-icon">
                      <Image
                        loader={imageLoader}
                        src="/ico-truck.png"
                        width={18}
                        height={18}
                        objectFit="contain"
                        alt=""
                      />
                    </div>
                    <div className="tooltip">Free!</div>
                  </div>
                </div>
              </div>
              <div className="row-total">
                <div className="checkout-title">
                  <span className="checkout-text">Subtotal</span> (
                  {cartData?.items_count} item)
                </div>
                <div className="price">
                  <span>${cartData?.subtotal}</span>
                </div>
              </div>
              <div className="row-total">
                <div className="checkout-title">
                  <span className="checkout-text">Discount</span>
                </div>
                <div className="price">
                  <span>-${cartData?.discount || 0}</span>
                </div>
              </div>
              <div className="row-total">
                <div className="checkout-title">
                  <span className="checkout-text">Tax</span>
                </div>
                <div className="price">
                  <span>$0.00</span>
                </div>
              </div>
              <div className="row-total">
                <div className="checkout-title">
                  <span className="checkout-text">Estimated shipping</span>
                </div>
                <div className="price">
                  <span>$0.00</span>
                </div>
              </div>

              <div className="coupon-area">
                <div className="coupon-field-input">
                  <div className="input-group">
                    <input
                      type="text"
                      className="input"
                      placeholder="Coupon (Optional)"
                    />
                  </div>
                </div>
                <div className="coupon-field-button">
                  <button
                    type="button"
                    disabled={true}
                    className="btn btn-apply"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <p className="coupon-text">
                Limited to use of 1 coupon per Checkout
              </p>
              <div className="total-area">
                <div className="checkout-total">
                  <span>TOTAL</span>
                </div>
                <div className="checkout-price">
                  <span>${cartData?.grand_total}</span>
                </div>
              </div>
              <p className="term-text">
                By placing this order you agree to Imex's Terms
              </p>
              <button
                onClick={() => router.push("/checkout")}
                type="button"
                className="btn btn-checkout"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="checkout-sticky">
        <div className="cart-total">
          <span>Total:&nbsp;</span>
          <span>$15.00</span>
        </div>
        <div className="actions">
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className="btn btnCheckout"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
