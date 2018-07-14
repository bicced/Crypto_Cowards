import { ACCOUNTS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'
const axios = require('axios')
// import { authHeaders } from './authHeaders'



export const getPortfolio = (params) => {
  console.log('hit api call')
  const p = new Promise((res, rej) => {
    axios.post(
      `${ACCOUNTS_MICROSERVICE}/get_portfolio`,
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
