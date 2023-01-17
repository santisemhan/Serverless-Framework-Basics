import { StatusCodes } from 'http-status-codes'
import { headers } from './headers.js'

const Response = {
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

export default Response
