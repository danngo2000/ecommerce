import axios from 'axios'
import { all, call, put, takeLatest, take } from 'redux-saga/effects'
import { 
    BookingState,
    fetchBooking as fetchBookingAction, 
    fetchBookingsSuccess } from 'actions/booking'

const fetchProduct = async (product: any) => {
  const { data } = await axios.get(`booking/getItemByProduct`)
  return data
}

function * getProductBooking (action: any) {
  const data: BookingState = yield call(fetchProduct, action.payload.product)
  yield put(fetchBookingsSuccess(data))
}

export default function * bookingSaga () {
  yield takeLatest(`${fetchBookingAction}`, getProductBooking)
}
