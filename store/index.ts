import { Store } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware, { Task } from "redux-saga";
import { createWrapper, Context } from "next-redux-wrapper";
import { createLogger } from "redux-logger";
// import basketReducer from '../slices/basketSlice'

import rootReducer from "./reducers";
import rootSaga from "./sagas";

export type RootState = ReturnType<typeof rootReducer>;
export interface SagaStore extends Store {
  sagaTask?: Task;
}

export const makeStore = (context: Context) => {
  const sagaMiddleware = createSagaMiddleware();
  // const reduxLogger = createLogger({
  //   collapsed: true,
  // });
  // const logger =
  //   process.env.NODE_ENV !== "production"
  //     ? [sagaMiddleware, reduxLogger]
  //     : [sagaMiddleware];
  
  // const logger = [];
  const middleware = [sagaMiddleware];

  const store: SagaStore = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware,
  });

  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export const wrapper = createWrapper(makeStore, { debug: false });
