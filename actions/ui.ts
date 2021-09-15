import { ILoginSuccessAction } from './auth';
import { ISetOrderAction } from './checkout';

export const UI_CART_DRAWER_TOGGLE = 'ui/CART_DRAWER_TOGGLE'
export const UI_LOGIN_DIALOG_TOGGLE = 'ui/LOGIN_DIALOG_TOGGLE'
export const UI_BACKGROUND_FILTER_TOGGLE = 'ui/BACKGROUND_FILTER_TOGGLE'
export const UI_CART_LOADING_TOGGLE = 'ui/CART_LOADING_TOGGLE'
export const UI_CART_NOTIFIER_SHOW = 'ui/CART_NOTIFIER_SHOW'
export const UI_CART_NOTIFIER_HIDE = 'ui/CART_NOTIFIER_HIDE'
export const UI_PLACING_ORDER_TOGGLE = 'ui/PLACING_ORDER_TOGGLE'

interface ICartLoadingToggleAction {
  type: typeof UI_CART_LOADING_TOGGLE
  payload?: boolean
}

interface IPlacingOrderToggleAction {
  type: typeof UI_PLACING_ORDER_TOGGLE
  payload?: boolean
}

interface ILoginDialogToggleAction {
  type: typeof UI_LOGIN_DIALOG_TOGGLE
  payload?: boolean
}

interface ICartDrawerToggleAction {
  type: typeof UI_CART_DRAWER_TOGGLE
  payload?: boolean
}

interface IBackgroundFilterToggleAction {
  type: typeof UI_BACKGROUND_FILTER_TOGGLE
  payload?: boolean
}

interface ICartNotifierShowAction {
  type: typeof UI_CART_NOTIFIER_SHOW
  payload: {
    errorMessage?: string,
    quantity: number
  }
}

interface ICartNotifierHideAction {
  type: typeof UI_CART_NOTIFIER_HIDE
}

export const toggleLoginDialog = (bool?: boolean): UIAction => ({
  type: UI_LOGIN_DIALOG_TOGGLE,
  payload: bool
})

export const toggleCartDrawer = (bool?: boolean): UIAction => ({
  type: UI_CART_DRAWER_TOGGLE,
  payload: bool
})

export const toggleBackgroundFilter = (bool?: boolean): UIAction => ({
  type: UI_BACKGROUND_FILTER_TOGGLE,
  payload: bool
})

export const togglePlacingOrder = (bool?: boolean): UIAction => ({
  type: UI_PLACING_ORDER_TOGGLE,
  payload: bool
})

export const toggleCartLoading = (bool?: boolean): UIAction => ({
  type: UI_CART_LOADING_TOGGLE,
  payload: bool
})

export const showCartNotifier = (quantity: number, errorMessage?: string): UIAction => ({
  type: UI_CART_NOTIFIER_SHOW,
  payload: {
    quantity,
    errorMessage
  }
})

export const hideCartNotifier = (): UIAction => ({
  type: UI_CART_NOTIFIER_HIDE
})

export type UIAction =
    ILoginDialogToggleAction
    | ICartDrawerToggleAction
    | IBackgroundFilterToggleAction
    | ICartNotifierShowAction
    | ICartNotifierHideAction
    | ICartLoadingToggleAction
    | ISetOrderAction
    | IPlacingOrderToggleAction
    | ILoginSuccessAction