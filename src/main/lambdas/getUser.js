'use strict';

const Responses = require('./HTTP/Response');
const StatusCodes = require('./HTTP/StatusCode');

const users = require('../_mock/users')

exports.handler = async event => {
    console.log('event', event);

    if(!event.pathParameters || !event.pathParameters.ID){
        Responses._error({statusCode: StatusCodes.BAD_REQUEST, content: { message: 'missing the ID from the path' }});
    }

    let user = users[event.pathParameters.ID];
    if(user){
        return Responses._success({statusCode: StatusCodes.OK, content: user });
    }

    Responses._error({statusCode: StatusCodes.BAD_REQUEST, content: { message: 'missing the ID from the path' }});
}