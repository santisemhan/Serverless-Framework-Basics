# Serverless-Framework-Basics

## Set up

Install the last version of Serverless Framework with the last LTS node version
```bash
  npm i -g serverless@latest
```

Put your AWS IAM credentials in the serverless config and create a profile
```bash
  serverless config credentials --provider aws --key XXX --secret XXX --profile ProfileName
```

Create an app with a NodeJS template
```bash
  serverless create --template aws-nodejs --path myServerlessProyect
```
## Create an API
Package for a StatusCode enum

```bash
npm install http-status-codes --save
```

We create a response model

```bash
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
```
And make the handler for the lambda. In this case we are going to make a handler to get a user.

```bash
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
        return Responses._success({statusCode: StatusCodes.BAD_REQUEST, content: user });
    }

    Responses._error({statusCode: StatusCodes.BAD_REQUEST, content: { message: 'missing the ID from the path' }});
}
```

We asociate the handler with the lambda in the *serverless.yml* and we will configure
the http endpoint.

```bash
functions:
  getUser:
    handler: src\main\lambdas\getUser.handler
    events:
        - http:
            path: get-user/{id}
            method: GET
            cors: true
            request:
              parameters:
                paths:
                  id: true
```


## Upload to S3 Bucket

To upload local data to S3 Bucket in AWS

```bash
  npm install --save serverless-s3-sync
```

In the serverless.yml

```bash
plugins:
  - serverless-s3-sync

custom:
  s3Sync:
    - bucketName: ${your-custom-bucketName}
      localDir: ${your-custom-folder}
```
## Common Bugs & Fixes

Bug #1
```bash
Cannot read file node_modules\bluebird\js\release\context.js due to: EMFILE: too many open files, open 'C:\Serverless-Basics\node_modules\bluebird\js\release\context.js'
```

**Fix:** 

```
1) npm install graceful-fs
```
```
2) Go to file: node_modules/serverless/lib/plugins/package/lib/zip-service.js
```
```
3) Delete: const fs = BbPromise.promisifyAll(require('fs'));   
```
```
4) Replace with:
    
   var realFs = require('fs')
   var gracefulFs = require('graceful-fs')
   gracefulFs.gracefulify(realFs)
   const fs = BbPromise.promisifyAll(realFs);
```
Reference: "https://github.com/serverless/serverless/issues/10944"
