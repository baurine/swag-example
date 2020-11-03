import axios from 'axios'

import { DefaultApi } from './api'

export * from './api'

//////////////////////////////

let basePath: string
let apiClientInstance: DefaultApi

function save(instanceBasePath: string, instance: DefaultApi) {
  basePath = instanceBasePath
  apiClientInstance = instance
}

function getInstance(): DefaultApi {
  return apiClientInstance
}

function getBasePath(): string {
  return basePath
}

export default { getInstance, getBasePath }

//////////////////////////////

function initAxios() {
  const instance = axios.create()
  instance.interceptors.response.use(undefined, function (err) {
    const { response } = err

    const errMsg = response?.data?.message || err.message
    window.alert('occur error: ' + errMsg)

    return Promise.reject(err)
  })

  return instance
}

function init() {
  let apiUrl: string
  if (process.env.REACT_APP_API_URL) {
    apiUrl = `${process.env.REACT_APP_API_URL}/api/v1`
  } else {
    apiUrl = 'http://127.0.0.1:8080/api/v1'
  }

  const dashboardClient = new DefaultApi(undefined, apiUrl, initAxios())
  save(apiUrl, dashboardClient)
}

init()
