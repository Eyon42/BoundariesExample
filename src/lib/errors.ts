import { AxiosError, AxiosResponse } from 'axios'
import { ClientRequest } from 'http'

export class AppError extends Error {
  constructor(msg: string) {
    super(msg)
  }
}

export class AppRequestError extends AppError {
  constructor(public axiosError: AxiosError, msg: string) {
    super(msg)
  }
}

export class AppNetworkError extends AppRequestError {}

export class AppResponseError extends AppRequestError {}

export function wrapAxiosError(e: AxiosError) {
  const req = e.request as ClientRequest
  if (!e.response) {
    console.error(`OUT: Network error requesting from ${req.host}${req.path}`)
    return new AppNetworkError(e, e.message)
  }
  const res = e.response as AxiosResponse
  console.error(`Error: ${e.response.status} ${e.response.config.url}`)
  console.error(`${JSON.stringify(e.response.data)}`)
  if (res.status >= 500) {
    console.error(`OUT: Server error requesting from ${req.host}${req.path}`)
  }
  return new AppResponseError(e, e.message)
}
