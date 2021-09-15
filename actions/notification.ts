import {IHydrateAction} from 'actions/core';

export const NOTIFY_FETCH_REQUEST = 'notify/FETCH_REQUEST'
export const NOTIFY_FETCH_SUCCESS = 'notify/FETCH_SUCCESS'
export const NOTIFY_TOGGLE_CHECKED = 'notify/TOGGLE_CHECKED'

interface IFetchNotifyRequest {
  type: typeof NOTIFY_FETCH_REQUEST
  payload: {
    checked: boolean, type: string, customerId: string
  }
}

interface IFetchNotifySuccess {
  type: typeof NOTIFY_FETCH_SUCCESS
  payload: any
}

interface ISetNotifyChecked {
  type: typeof NOTIFY_TOGGLE_CHECKED
  payload: boolean
}

export const loadCustomerNotification = (checked: boolean, type: string, customerId: string): NotificationAction => ({
  type: NOTIFY_FETCH_REQUEST,
  payload: { checked, type, customerId }
})

export const loadCustomerNotificationSuccess = (payload): NotificationAction => ({
  type: NOTIFY_FETCH_SUCCESS,
  payload
})

export const setNotificationChecked = (checked: boolean): NotificationAction => ({
  type: NOTIFY_TOGGLE_CHECKED,
  payload: checked
})

export type NotificationAction = IHydrateAction
  | IFetchNotifyRequest
  | IFetchNotifySuccess
  | ISetNotifyChecked