import { users } from '../../../../_mock/users.js'
import { StatusCodes } from 'http-status-codes';
import { Response } from '../../support/Response.js'


export const handler = async (event) => {
    console.log('event', event);

    if(!event.pathParameters || !event.pathParameters.id){
        return Response._error({statusCode: StatusCodes.BAD_REQUEST, content: { message: 'missing the ID from the path' }});
    }

    let user = users[event.pathParameters.id];
    if(user){
        return Response._success({statusCode: StatusCodes.OK, content: user });
    }

    return Response._error({statusCode: StatusCodes.NOT_FOUND, content: { message: 'user not found' }});
}