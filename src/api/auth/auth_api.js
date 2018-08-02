import axios from 'axios'
import { ACCOUNTS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const saveGoogleCredentialsInServer = (code, identityId, googleId) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/initial_google_auth`, { code, identityId, googleId }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const getUserProfile = (user_id, profile) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/retrieve_user_profile`, { user_id, profile }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const userApiExists = (user_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/user_api_exists`, { user_id }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data.api_exists)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const removeUserApi = (user_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/remove_user_api`, { user_id }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data.message)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}
