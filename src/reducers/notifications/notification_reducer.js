import {
  SAVE_NOTIFICATIONS,
} from '../../actions/action_types'

const INITIAL_STATE = {
  user_notifications: [],
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SAVE_NOTIFICATIONS:
      return {
        ...state,
        user_notifications: action.payload,
      }
		default:
			return {
				...state
			}
	}
}
