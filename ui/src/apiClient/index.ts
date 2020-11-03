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
    const { response, message } = err
    const errMsg = response?.data?.message || message
    window.alert('occur error: ' + errMsg)
    return Promise.reject(err)
  })

  return instance
}

function init() {
  let apiUrl = `${
    process.env.REACT_APP_API_URL || 'http://127.0.0.1:8080'
  }/api/v1`
  const dashboardClient = new DefaultApi(undefined, apiUrl, initAxios())
  save(apiUrl, dashboardClient)
}

init()
