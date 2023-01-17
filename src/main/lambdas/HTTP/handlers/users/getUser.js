import { StatusCodes } from 'http-status-codes'
import Dynamo from '../../../common/dynamo.js'
import { Response } from '../../common/Response.js'

const tableName = process.env.userTableName

export const handler = async (event) => {
  if (!event.pathParameters || !event.pathParameters.id) {
    return Response._error({
      statusCode: StatusCodes.BAD_REQUEST,
      content: { message: 'missing the ID from the path' }
    })
  }

  const user = await Dynamo.get(event.pathParameters.id, tableName).catch(err => {
    console.log('error in Dynamo get', err)
    return null
  })

  if (!user) {
    return Response._error({
      statusCode: StatusCodes.NOT_FOUND,
      content: { message: 'failed to get user by id' }
    })
  }

  return Response._success({
    statusCode: StatusCodes.OK
  })
}
