import React from "react";
import { wrapper } from "store";
import { useDispatch } from "react-redux";
import { END } from "redux-saga";
import Layout from "components/Layout";
import CartContent from "components/Cart/CartContent";
// import CartEmptyContent from 'components/Cart/CartEmptyContent'

import { CartActions } from "../store/reducers/cart";
const Cart = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(CartActions.CART_REQUEST());
  }, []);
  return (
    <Layout page="cart-page">
      <CartContent />
    </Layout>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps(
//   async ({ store }: any) => {
//     store.dispatch(CartActions.CART_REQUEST());
//     console.log('vo')
//     store.dispatch(END);
//     await store.sagaTask.toPromise();
//     return {};
//   }
// );

export default Cart;
