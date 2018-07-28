import axios from 'axios'
import { ACCOUNTS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const checkRebalancing = () => {
  const p = new Promise((res, rej) => {
    axios.get(`${ACCOUNTS_MICROSERVICE}/check_rebalancing`, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        console.log(data.data)
        res(data.data.passed)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}
