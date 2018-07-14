import { ACCOUNTS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'
const axios = require('axios')
// import { authHeaders } from './authHeaders'



export const saveBot = (params) => {
  console.log('hit api call')
  const p = new Promise((res, rej) => {
    axios.post(
      `${ACCOUNTS_MICROSERVICE}/save_bot`,
      params,
      authHeaders()
    ).then((data) => {
      console.log(data)
      res(data.data.user_id)
    }).catch((err) => {
      console.log(err.response.data)
      rej(err)
    })

  })
  return p
}

export const getBot = (user_id) => {
  console.log('hit api call')
  const p = new Promise((res, rej) => {
    axios.post(
      `${ACCOUNTS_MICROSERVICE}/get_bot`,
      {user_id},
      authHeaders()
    ).then((data) => {
      console.log(data)
      res(data.data.bot)
    }).catch((err) => {
      console.log(err.response.data)
      rej(err)
    })

  })
  return p
}

export const activateBot = (user_info) => {
  console.log('hit api call')
  const p = new Promise((res, rej) => {
    axios.post(
      `${ACCOUNTS_MICROSERVICE}/activate_bot`,
      user_info,
      authHeaders()
    ).then((data) => {
      console.log(data)
      res(data.data.bot)
    }).catch((err) => {
      console.log(err.response.data)
      rej(err)
    })

  })
  return p
}
