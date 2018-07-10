import axios from 'axios'
import { ACCOUNTS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const addCoward = (user_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/add_coward`, { user_id }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        console.log(data.data)
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const addPro = (user_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/add_pro`, { user_id }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        console.log(data.data)
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}
