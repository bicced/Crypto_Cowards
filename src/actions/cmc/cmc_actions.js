import {
  SAVE_TOP_RANKS,
} from '../action_types'

// change the language of the app

export const saveTopRanks = (topRanks) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_TOP_RANKS,
      payload: topRanks,
    })
  }
}
