import React from "react";

const ShippingMethod = ({ shipping }) => {
  return (
    <div className="shipping-methods">
      <label>Shipping method:</label>
      {shipping &&
        shipping.map((item, index) => (
          <span key={`span-${index}`}>{item.name}</span>
        ))}
    </div>
  );
};

export default ShippingMethod;
