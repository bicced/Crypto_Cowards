import axios from 'axios'
import { ACCOUNTS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const addAlgo = (algoData) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/add_algo`, algoData, authHeaders())
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

export const getUserAlgos = (user_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/get_user_algos`, {user_id}, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        console.log(data.data)
        res(data.data.user_algos)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const getAllAlgos = () => {
  const p = new Promise((res, rej) => {
    axios.get(`${ACCOUNTS_MICROSERVICE}/get_all_algos`, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        console.log(data.data)
        res(data.data.all_algos)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const addFollows = (followData) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/add_follows`, followData, authHeaders())
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

export const deleteFollows = (unfollowData) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/delete_follows`, unfollowData, authHeaders())
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

export const getUserFollows = (user_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ACCOUNTS_MICROSERVICE}/get_user_follows`, {user_id}, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        console.log(data.data)
        res(data.data.user_follows)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}
