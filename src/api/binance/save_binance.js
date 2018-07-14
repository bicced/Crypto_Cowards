import { ACCOUNTS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'
const axios = require('axios')
// import { authHeaders } from './authHeaders'


export const saveBinance = (info) => { //get all post info for list
  console.log('verifyhit')
  console.log(info)
  const p = new Promise((res, rej) => {
    axios.post(
      `${ACCOUNTS_MICROSERVICE}/save_binance`,
      info,
      authHeaders()
    ).then((data) => {
      console.log(data)
      res(data)
    }).catch((err) => {
      console.log(err.response.data)
      rej(err)
    })

  })
  return p
}

export const getBalance = (user_id) => { //get all post info for list
  console.log('verifyhit')
  const p = new Promise((res, rej) => {
    axios.post(
      `${ACCOUNTS_MICROSERVICE}/get_balance`,
      {user_id},
      authHeaders()
    ).then((data) => {
      console.log(data)
      res(data.data)
    }).catch((err) => {
      console.log(err.response.data)
      rej(err)
    })

  })
  return p
}

export const getCandlesticks = (params) => { //get all post info for list
  console.log('verifyhit')
  const p = new Promise((res, rej) => {
    axios.post(
      `${ACCOUNTS_MICROSERVICE}/get_candlesticks`,
      params,
      authHeaders()
    ).then((data) => {
      console.log(data)
      res(data.data)
    }).catch((err) => {
      console.log(err.response.data)
      rej(err)
    })

  })
  return p
}
