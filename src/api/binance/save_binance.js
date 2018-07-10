import { ACCOUNTS_MICROSERVICE } from '../API_URLS'
const axios = require('axios')
// import { authHeaders } from './authHeaders'
const authHeaders = {
  header: {
    'Authorization': 'Bearer <AUTH_TOKEN_ID>'
  }
}

export const saveBinance = (info) => { //get all post info for list
  console.log('verifyhit')
  console.log(info)
  const p = new Promise((res, rej) => {
    axios.post(
      `${ACCOUNTS_MICROSERVICE}/save_binance`,
      info,
      authHeaders
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
