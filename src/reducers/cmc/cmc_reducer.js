import {
  SAVE_TOP_RANKS,
} from '../../actions/action_types'

const INITIAL_STATE = {
  top_ranks: [],
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SAVE_TOP_RANKS:
      return {
        ...state,
        top_ranks: action.payload,
      }
		default:
			return {
				...state
			}
	}
}
