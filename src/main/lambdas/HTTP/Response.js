'use strict';

const StatusCodes = require('./StatusCode');

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*'
}

const Response = {
    _success(data = {statusCode: StatusCodes.NO_CONTENT, content: {}}){
        return {
            headers: headers,
            statusCode: data.statusCode,
            body: JSON.stringify(data.content)
        }
    },
    _error(data = {statusCode: StatusCodes.INTERNAL_SERVER_ERROR, content: {}}){
        return {
            headers: headers,
            statusCode: data.statusCode,
            body: JSON.stringify(data.content)
        }
    }
}

module.exports = Response;