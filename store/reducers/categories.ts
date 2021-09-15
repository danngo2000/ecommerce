import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit"
import produce from "immer";
import { HYDRATE } from "next-redux-wrapper";


export type CategoriesState = Array<Record<string, any>>

const initialState: CategoriesState = []

export const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
      fetchCategoriesSuccess: (state, action) => {
        return action.payload
      }
    },
    extraReducers: (builder) => {
      builder.addCase(HYDRATE,(state, action: any) => {
        return produce(state, draft => Object.assign(draft, action.payload.categories))
      })
    }
})

export const fetchCategories = createAction("categories/FETCH_REQUESTED")
export const { fetchCategoriesSuccess } = categoriesSlice.actions
export const categoriesReducer = categoriesSlice.reducer