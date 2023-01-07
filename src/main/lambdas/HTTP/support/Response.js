import { StatusCodes } from 'http-status-codes'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Origin': '*'
}

export const Response = {
  _success (data = { statusCode: StatusCodes.NO_CONTENT, content: {} }) {
    return {
      headers,
      statusCode: data.statusCode,
      body: JSON.stringify(data.content, null, 2)
    }
  },
  _error (data = { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, content: {} }) {
    return {
      headers,
      statusCode: data.statusCode,
      body: JSON.stringify(data.content, null, 2)
    }
  }
}
