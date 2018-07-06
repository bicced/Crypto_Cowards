import {
  AUTHENTICATED_USER,
  AUTHENTICATION_LOADED,
  UNAUTHENTICATED_USER,
  SAVE_USER_PROFILE,
  LOCATION_FORWARDING,
  REMOVE_USER_PROFILE,
} from '../action_types'

// authenticate the user member's account
export const authenticateUser = (userProfile) => {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATED_USER,
      payload: userProfile,
    })
  }
}

// authentication loaded, this will be called when the user profile has been loaded either successfully or unsuccessfully
export const authenticationLoaded = () => {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATION_LOADED,
      payload: true,
    })
  }
}

// unauthenticate the user members' account
export const unauthenticateUser = () => {
  return (dispatch) => {
    dispatch({
      type: UNAUTHENTICATED_USER
    })
  }
}


// save user profile to redux
export const saveUserProfileToRedux = (userProfile) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_USER_PROFILE,
      payload: userProfile,
    })
  }
}


export const forwardUrlLocation = (url) => {
  return (dispatch) => {
    dispatch({
      type: LOCATION_FORWARDING,
      payload: url,
    })
  }
}

// remove the user members' profile
export const removeUserProfile = () => {
	return (dispatch) => {
    localStorage.removeItem('cognito_user_token')
		dispatch({
			type: REMOVE_USER_PROFILE,
		})
	}
}
