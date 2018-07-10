import {
  SAVE_USER_ALGOS,
  SAVE_ALL_ALGOS,
  SAVE_USER_FOLLOWS,
} from '../action_types'

// change the language of the app

export const saveUserAlgos = (algoList) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_USER_ALGOS,
      payload: algoList,
    })
  }
}

export const saveAllAlgos = (algoList) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_ALL_ALGOS,
      payload: algoList,
    })
  }
}

export const saveUserFollows = (userFollows) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_USER_FOLLOWS,
      payload: userFollows
    })
  }
}
