import axios from 'axios'
import { all, call, delay, put, take, takeLatest } from "redux-saga/effects"
import {
    CategoriesState,
    fetchCategories as fetchCategoriesAction,
    fetchCategoriesSuccess } from "actions/categories";

const fetch = async () => axios.get(`categories/search?max_level=3`)
    .then(res => res.data)

function* fetchCategoriesSaga() {
  try {
    const data: CategoriesState = yield call(fetch)
    yield put(fetchCategoriesSuccess(data))
  } catch (err) {
    console.log(err.message)
    // yield put(fetchCategoriesFailure(err))
  }
}

export default function* categoriesSaga() {
  yield takeLatest(`${fetchCategoriesAction}`, fetchCategoriesSaga)
}