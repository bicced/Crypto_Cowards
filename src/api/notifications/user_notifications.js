import { ACCOUNTS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'
const axios = require('axios')
// import { authHeaders } from './authHeaders'

export const getUserNotifications = (user_id) => {
  console.log('hit api call')
  const p = new Promise((res, rej) => {
    axios.post(
      `${ACCOUNTS_MICROSERVICE}/all_user_notifications`,
      {user_id},
      authHeaders()
    ).then((data) => {
      console.log(data)
      res(data.data.notifications.reverse())
    }).catch((err) => {
      console.log(err.response.data)
      rej(err)
    })

  })
  return p
}

export const markUserNotifications = (user_id) => {
  console.log('hit api call')
  const p = new Promise((res, rej) => {
    axios.post(
      `${ACCOUNTS_MICROSERVICE}/mark_user_notifications`,
      {user_id},
      authHeaders()
    ).then((data) => {
      console.log(data)
      res(data.data.notifications)
    }).catch((err) => {
      console.log(err.response.data)
      rej(err)
    })

  })
  return p
}
