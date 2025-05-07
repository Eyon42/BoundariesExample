import axios, { AxiosError } from 'axios'
import { wrapAxiosError } from '../errors'

const API = {
  BASE_URL: 'https://example.com',
}

export const client = axios.create({
  baseURL: API.BASE_URL,
})

client.interceptors.request.use((config) => {
  console.log(config.method, config.url)
  return config
})

client.interceptors.response.use(
  (response) => {
    console.log(`RESPONSE: ${response.request._url} STATUS: ${response.status}`)
    return response
  },
  (error) => {
    if (error instanceof AxiosError) {
      return Promise.reject(wrapAxiosError(error))
    }
    return Promise.reject(error)
  },
)
