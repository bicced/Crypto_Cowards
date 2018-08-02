import {
  SAVE_NOTIFICATIONS,
} from '../action_types'

// change the language of the app

export const saveNotifications = (notifications) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_NOTIFICATIONS,
      payload: notifications,
    })
  }
}
