import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit"
import produce from "immer";
import { HYDRATE } from "next-redux-wrapper";

export type ConfigState = Record<string, any>

const initialState: ConfigState = {
  "site/url": null
}

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    fetchConfigSuccess: (state, action) => {
      return action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE,(state, action: any) => {
      return produce(state, draft => Object.assign(draft, action.payload.config))
    })
  }
})

export const fetchConfig = createAction("config/FETCH_REQUESTED")
export const { fetchConfigSuccess } = configSlice.actions
export const configReducer = configSlice.reducer