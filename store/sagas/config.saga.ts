import { all, call, delay, put, take, takeLatest } from "redux-saga/effects"
import axios from "axios"
import {
  ConfigState,
  fetchConfig as fetchConfigAction,
  fetchConfigSuccess } from "actions/config";

const isServer = typeof window !== "object"

const needJsonParse = [
  "site/theme/settings",
  "site/footer/extras",
  "web/static_menus",
  "products/recipes-categories"
]

const fetchConfig = () => axios
  .get("config-data/storefront")
  .then(res => res.data.data)

function* fetchConfigSaga() {
  try {
    const data: any[] = yield call(fetchConfig)
    const configData: ConfigState = {}
    for (const config of data) {
      if (needJsonParse.includes(config.path)) {
        try {
          configData[config.path] = JSON.parse(config.value)
        } catch (e) {
          configData[config.path] = null
        }
      } else configData[config.path] = config.value
    }
    yield put(fetchConfigSuccess(configData))
  } catch (err) {
    console.log(err)
    // yield put(fetchConfigFailure(err))
  }
}

export default function* configSaga () {
  yield all([
    takeLatest(`${fetchConfigAction}`, fetchConfigSaga),
  ])
}
