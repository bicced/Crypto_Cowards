import {
  AUTHENTICATED_USER,
  AUTHENTICATION_LOADED,
  UNAUTHENTICATED_USER,
  SAVE_USER_PROFILE,
  LOCATION_FORWARDING,
  REMOVE_USER_PROFILE,
} from '../../actions/action_types'

const INITIAL_STATE = {
  corporation_profile: {
		// corporation_id: '99cc0669-f407-4470-bb26-5e43742e3758',
		// corp_name: 'Jake Malliaros',
    // email: 'info@studenthousing.ca',
    // thumbnail: 'https://imgur.com/348djld',
	},
	user_profile: {
    // corporation_id: null,
    // created_at: '2017-07-11T02:54:03.142Z',
    // email: 'kangze.web.lance@gmail.com',
    // name: 'Khan Huang',
    // phone: '24859357437',
    // user_id: '5d7b0bd0-4ce1-4c9b-b860-02cf79667952',
    // thumbnail: 'https://imgur.com/348djld',
	},
  authenticated: false,
  authentication_loaded: false,
  location_forwarding: '',    // forwarding location after sign in
  // browser_fingerprint: '',    // unique identifier for web browser
  // s3_corporation: '',
  // users: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTHENTICATED_USER:
      return {
        ...state,
        authenticated: action.payload ? true : false,
      }
    case AUTHENTICATION_LOADED:
      return {
        ...state,
        authentication_loaded: true,
      }
    case UNAUTHENTICATED_USER:
      return {
        ...state,
        user_profile: {},
        authenticated: false,
      }
    case SAVE_USER_PROFILE:
      localStorage.setItem('user_id', action.payload.user_id)
      return {
        ...state,
        user_profile: action.payload,
      }
    case LOCATION_FORWARDING:
      return {
        ...state,
        location_forwarding: action.payload,
      }
    case REMOVE_USER_PROFILE:
      localStorage.removeItem('user_id')
      return {
        ...state,
        user_profile: {},
        corporation_profile: {},
      }
    default:
      return {
        ...state,
      }
  }
}
