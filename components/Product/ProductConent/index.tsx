import { Collapse, Tooltip, IconButton } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { scroller } from "react-scroll";
import Image from "next/image";
import React, { useState, FC } from "react";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";

/* ######### components ######## */
import AddToCartBox from "./AddToCartBoxcu";
import Stock from "../Notice/Stock";
import Reviews from "../Reviews/index";
import ProductDetailTab from "./ProductDetailTab";
import ProductGalleryBox from "./ProductGalleryBox";
/* #########  ######## */
import { imageLoader } from "utils";
import { Product } from "store/interfaces";
import { CartActions } from "store/reducers/cart";

interface Props {
  product: Product;
}

const ProductContent: FC<Props> = ({ product }) => {
  const dispatch = useDispatch();

  const [shareUrl, setShareUrl] = useState("");
  const [prevAccordion, setPrevAccordion] = useState({
    summary: true,
    shipping: false,
  });

  const renderShareUrl = (e: any) => {
    e.preventDefault();
    setShareUrl(window.location.href);
  };

  const handleSummary = () => {
    setPrevAccordion({
      ...prevAccordion,
      summary: !prevAccordion.summary,
      shipping: false,
    });
  };

  const handleShipping = () => {
    setPrevAccordion({
      ...prevAccordion,
      shipping: !prevAccordion.shipping,
      summary: false
    })
  }
  const scrollTo = (element: any, offset = 0) => {
    scroller.scrollTo(element, {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset,
    });
  };

  const handleAddToCart = (qty: number) => {
    dispatch(
      CartActions.UPDATE_CART_REQUEST({
        req: {
          product_id: product._id,
          qty,
          action_type: "add_to_cart",
        },
      })
    );
  };

  return (
    <div className="product-container container">
      <div className="main-box">
        <div></div>
        <div className='row product-detail'>
          <div className='product-detail-left'>
            <ProductGalleryBox images={product.images} />
          </div>
          <div className='product-detail-right'>
            <h1 className='product-title'>{product.name}</h1>
            <div className='product-media'>
              <div className='product-content-rating'>
                <a href='#' onClick={() => scrollTo('product-reviews', -350)}>
                  Write a Review
                </a>
              </div>
              <div className="social-group">
                <Tooltip arrow title="Share on Facebook" placement="top">
                  <IconButton aria-label="Share on Facebook">
                    <FaFacebookF />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow title="Share on Twitter" placement="top">
                  <IconButton aria-label="Share on Twitter">
                    <FaTwitter />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div className="price-box">
              <span>${product.price}</span>
            </div>
            <AddToCartBox onAddToCart={handleAddToCart} product={product} />
            <Stock />
            <div className="accordion-div">
              <button onClick={handleSummary} className="accordion-button">
                <span className="button-text">SUMMARY</span>
                <span className="icon">
                  {prevAccordion.summary ? <RemoveIcon /> : <AddIcon />}
                </span>
              </button>
              <Collapse in={prevAccordion.summary} timeout='auto' unmountOnExit>
                <div className='product-summary'>
                  <p>{product.short_description}</p>
                </div>
              </Collapse>
              <button onClick={handleShipping} className="accordion-button">
                <span className="button-text">SHIPPING & RETURN</span>
                <span className="icon">
                  {prevAccordion.shipping ? <RemoveIcon /> : <AddIcon />}
                </span>
              </button>
              <Collapse
                in={prevAccordion.shipping}
                timeout="auto"
                unmountOnExit
              >
                <div className="promo-text-box row">
                  <div className="item-content">
                    <h4 className="base-xs-small-buffer">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        fill="#000"
                        stroke="unset"
                        width="40px"
                        viewBox="0 0 512 512"
                      >
                        <g>
                          <path d="M 511.839844 226.78125 L 511.839844 226.777344 C 511.003906 218.800781 506.871094 211.449219 500.503906 206.578125 L 471.363281 183.890625 L 482.316406 147.75 C 484.652344 140.039062 483.683594 131.613281 479.65625 124.628906 C 475.625 117.648438 468.8125 112.597656 460.964844 110.761719 L 424.304688 102.203125 L 419.625 64.851562 C 418.621094 56.851562 414.308594 49.546875 407.792969 44.820312 C 401.269531 40.074219 392.984375 38.226562 385.074219 39.75 L 348.101562 46.839844 L 328.628906 14.617188 C 320.878906 1.792969 304.605469 -3.050781 290.785156 3.339844 C 289.8125 3.789062 288.875 4.328125 288.058594 4.90625 L 255.96875 27.257812 L 225.074219 5.738281 C 218.460938 1.136719 210.152344 -0.539062 202.269531 1.132812 C 194.386719 2.804688 187.472656 7.726562 183.304688 14.625 L 163.839844 46.84375 L 126.863281 39.75 C 118.945312 38.234375 110.667969 40.082031 104.15625 44.816406 C 97.632812 49.554688 93.320312 56.859375 92.320312 64.851562 L 87.640625 102.207031 L 48.867188 111.257812 L 47.046875 111.851562 L 46.375 112.144531 C 32.289062 118.304688 25.242188 133.28125 29.625 147.75 L 40.574219 183.890625 L 10.183594 207.53125 L 8.421875 209.0625 L 7.925781 209.605469 C -2.273438 220.746094 -2.671875 237.597656 6.976562 248.863281 L 30.769531 277.316406 L 11.484375 312.3125 L 10.714844 314.0625 L 10.492188 314.714844 C 5.683594 329.085938 12.234375 344.703125 25.726562 351.035156 L 59.804688 367.027344 L 56.613281 404.535156 C 55.929688 412.570312 58.632812 420.613281 64.023438 426.597656 C 69.414062 432.585938 77.128906 436.113281 85.191406 436.277344 L 122.828125 437.027344 L 135.171875 472.585938 C 137.8125 480.203125 143.550781 486.453125 150.910156 489.726562 C 158.269531 493.003906 166.75 493.089844 174.1875 489.960938 L 208.878906 475.339844 L 236.109375 504.398438 L 237.535156 505.667969 L 238.085938 506.078125 C 243.464844 510.050781 249.75 511.996094 255.976562 511.996094 C 263.855469 511.996094 271.636719 508.878906 277.328125 502.804688 L 303.070312 475.339844 L 337.765625 489.964844 C 345.1875 493.089844 353.664062 493.003906 361.023438 489.730469 C 368.390625 486.453125 374.128906 480.203125 376.769531 472.589844 L 389.117188 437.027344 L 428.929688 436.234375 L 430.820312 436.027344 L 431.5 435.890625 C 446.34375 432.863281 456.589844 419.382812 455.328125 404.539062 L 452.140625 367.027344 L 486.222656 351.035156 C 493.515625 347.613281 499.128906 341.253906 501.621094 333.585938 C 504.109375 325.921875 503.308594 317.476562 499.417969 310.417969 L 481.175781 277.316406 L 504.972656 248.863281 C 510.171875 242.789062 512.675781 234.75 511.839844 226.78125 Z M 452.796875 264.449219 C 448.082031 270.015625 447.277344 278.019531 450.804688 284.414062 L 472.730469 324.203125 L 431.601562 343.503906 C 424.933594 346.636719 420.875 353.671875 421.496094 361.011719 L 425.34375 406.277344 L 379.921875 407.183594 C 372.558594 407.332031 365.984375 412.105469 363.570312 419.066406 L 348.671875 461.984375 L 306.8125 444.339844 C 300.023438 441.480469 292.078125 443.164062 287.035156 448.542969 L 255.96875 481.691406 L 224.902344 448.539062 C 221.5 444.90625 216.769531 442.960938 211.964844 442.960938 C 209.65625 442.960938 207.332031 443.410156 205.132812 444.339844 L 163.265625 461.984375 L 148.371094 419.078125 C 145.960938 412.113281 139.386719 407.332031 132.015625 407.183594 L 86.589844 406.277344 L 90.4375 361.011719 C 91.0625 353.671875 87 346.636719 80.332031 343.503906 L 39.207031 324.203125 L 61.132812 284.417969 C 64.664062 278.015625 63.855469 270.015625 59.136719 264.445312 L 30.277344 229.933594 L 65.636719 202.425781 C 71.425781 197.960938 73.886719 190.289062 71.761719 183.296875 L 58.589844 139.820312 L 102.835938 129.484375 C 110.003906 127.808594 115.4375 121.777344 116.359375 114.464844 L 122.007812 69.386719 L 166.632812 77.945312 C 173.867188 79.328125 181.28125 76.023438 185.09375 69.722656 L 208.585938 30.839844 L 245.863281 56.800781 C 251.910156 61.011719 260.035156 61.015625 266.078125 56.800781 L 303.355469 30.835938 L 326.851562 69.710938 C 330.65625 76.019531 338.085938 79.328125 345.320312 77.941406 L 389.9375 69.382812 L 395.585938 114.457031 C 396.5 121.765625 401.933594 127.804688 409.113281 129.484375 L 453.355469 139.816406 L 440.179688 183.292969 C 438.058594 190.300781 440.523438 197.96875 446.3125 202.429688 L 481.65625 229.949219 Z M 452.796875 264.449219 "></path>
                          <path d="M 257.5625 128.78125 C 187.261719 128.78125 130.066406 185.972656 130.066406 256.277344 C 130.066406 326.578125 187.261719 383.773438 257.5625 383.773438 C 327.867188 383.773438 385.0625 326.578125 385.0625 256.277344 C 385.0625 185.972656 327.863281 128.78125 257.5625 128.78125 Z M 257.5625 353.75 C 203.816406 353.75 160.085938 310.023438 160.085938 256.277344 C 160.085938 202.527344 203.816406 158.800781 257.5625 158.800781 C 311.3125 158.800781 355.039062 202.527344 355.039062 256.277344 C 355.039062 310.023438 311.3125 353.75 257.5625 353.75 Z M 257.5625 353.75 "></path>
                          <path d="M 294.210938 216.691406 L 234.988281 275.910156 L 218.917969 259.835938 C 213.054688 253.976562 203.550781 253.976562 197.691406 259.835938 C 191.828125 265.699219 191.828125 275.203125 197.691406 281.066406 L 224.375 307.75 C 227.304688 310.683594 231.148438 312.148438 234.988281 312.148438 C 238.828125 312.148438 242.671875 310.683594 245.601562 307.75 L 315.4375 237.917969 C 321.296875 232.054688 321.296875 222.550781 315.4375 216.691406 C 309.574219 210.828125 300.070312 210.828125 294.210938 216.691406 Z M 294.210938 216.691406 "></path>
                        </g>
                      </svg>
                      100% Genuine
                    </h4>
                    <p className="txt-xs txt-light-dark">
                      Vendor sourced & brand new
                    </p>
                  </div>
                  <div className="item-content">
                    <h4 className="base-xs-small-buffer">
                      <Image
                        loader={imageLoader}
                        src="/images/ico-return.svg"
                        width={25}
                        height={25}
                        className="ico-return"
                        objectFit="contain"
                      />
                      <span style={{ marginLeft: '15px' }}>
                        Returns within 30 days of delivery
                      </span>
                    </h4>
                    <p className="txt-xs txt-light-dark">
                      You have 30 calendar days to returns an item from the date
                      you received it
                    </p>
                  </div>
                </div>
              </Collapse>
            </div>

            {/* <Reviews /> */}
          </div>
        </div>
      </div>
      <ProductDetailTab product={product} />
      <Reviews />
    </div>
  );
};

export default ProductContent;