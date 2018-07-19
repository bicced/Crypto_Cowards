import {
  SAVE_USER_ALGOS,
  SAVE_ALL_ALGOS,
  SAVE_USER_FOLLOWS,
  SAVE_USER_SELECTED,
} from '../../actions/action_types'

const INITIAL_STATE = {
  user_algos: [],
  all_algos: [],
  user_follows: [],
  user_selected: [],
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SAVE_USER_ALGOS:
      return {
        ...state,
        user_algos: action.payload,
      }
    case SAVE_ALL_ALGOS:
      return {
        ...state,
        all_algos: action.payload,
      }
    case SAVE_USER_FOLLOWS:
      return {
        ...state,
        user_follows: action.payload,
      }
    case SAVE_USER_SELECTED:
      return {
        ...state,
        user_selected: action.payload,
      }
		default:
			return {
				...state
			}
	}
}
