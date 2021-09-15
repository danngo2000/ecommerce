import { takeLatest, takeEvery, all, fork } from "redux-saga/effects";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
/* ######### interface ######## */
import { Saga } from "../store/interfaces";


const createSagaTakeLatest = (sagas: Saga[]) => {
  return sagas.flat().map((saga: Saga) => takeLatest(saga.on, saga.worker));
};

const createSagaFork = (sagas: any[]) => {
  return sagas.flat().map((saga: any) => fork(saga));
};

const createFuncRootSaga = (sagas: Saga[]) => {
  return function* root() {
    yield all(createSagaTakeLatest(sagas));
    // while (!Common.IS_SERVER){
    //   yield all(createSagaTakeLatest(sagas));
    // }
  };
};

const createForkSagas = (sagas: any[]) => {
  return function* root() {
    yield all(createSagaFork(sagas));
  };
};

const createSaga = (sagas: Saga[]) => {
  return sagas.flat().map(
    (saga: Saga) =>
      function* take() {
        yield takeLatest(saga.on, saga.worker);
      }
  );
};

const createMultipleSaga = (sagas: Saga[]) => {
  return sagas.flat().map(
    (saga: Saga) =>
      function* take() {
        yield takeEvery(saga.on, saga.worker);
      }
  );
};
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export {
  createFuncRootSaga,
  createForkSagas,
  createSaga,
  createMultipleSaga,
  createSagaTakeLatest,
  useAppSelector
};
