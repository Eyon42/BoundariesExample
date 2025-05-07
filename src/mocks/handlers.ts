import { http, HttpResponse } from 'msw'

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get('https://example.com/ok', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),
  http.get('https://example.com/network', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.error()
  }),
  http.get('https://example.com/forbidden', () => {
    // ...and respond to them using this JSON response.
    return new HttpResponse(null, { status: 403 })
  }),
  http.get('https://example.com/unauthorized', () => {
    // ...and respond to them using this JSON response.
    return new HttpResponse(null, { status: 401 })
  }),
  http.get('https://example.com/server', () => {
    // ...and respond to them using this JSON response.
    return new HttpResponse(null, { status: 500 })
  }),
]
