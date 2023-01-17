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
```
And make the handler for the lambda. In this case we are going to make a handler to get a user

```bash
import { users } from '../../../../_mock/users.js'
import { StatusCodes } from 'http-status-codes'
import { Response } from '../../support/Response.js'

export const handler = async (event) => {
  if (!event.pathParameters || !event.pathParameters.id) {
    return Response._error({
      statusCode: StatusCodes.BAD_REQUEST,
      content: { message: 'missing the ID from the path' }
    })
  }

  const user = users[event.pathParameters.id]
  if (user) {
    return Response._success({
      statusCode: StatusCodes.OK,
      content: user
    })
  }

  return Response._error({
    statusCode: StatusCodes.NOT_FOUND,
    content: { message: 'user not found' }
  })
}
```

We asociate the handler with the lambda in the *serverless.yml* and we will configure
the http endpoint

```bash
functions:
  getUser:
    handler: src/main/lambdas/HTTP/handlers/users/getUser.handler
    events:
        - http:
            path: /get-user/{id}
            method: GET
            cors: true
            request:
              parameters:
                paths:
                  id: true
```

## Create a DynamoDB table

To create a DynamoDB table in serverless we must put in our *serverless.yml* resources section this:

```bash
resources:
  Resources:
    UserTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: user
        AttributeDefinitions:
            - AttributeName: id
              AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST # PROVISIONED | PAY_PER_REQUEST

```
BillingMode reference: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BillingModeSummary.html

## Integrate DynamoDB with your API

To integrate DynamoDB with our API we will need the aws-sdk

```bash
npm install aws-sdk
```

### Getting data
We will centralize the logic for the Dynamo get method
```bash
import AWS from 'aws-sdk'

const documentClient = new AWS.DynamoDB.DocumentClient()

const Dynamo = {
  async get (id, tableName) {
    const params = {
      tableName,
      key: {
        id
      }
    }

    const data = await documentClient
      .get(params)
      .promise()

    if (!data || !data.Item) {
      throw Error(`There was an error fetching the data for id of ${id} from ${tableName}`)
    }

    return data.Item
  }
}

export default Dynamo
```

Getting data inside the lambda function

```bash
const user = await Dynamo.get(event.pathParameters.id, 'yourTableName').catch(err => {
  console.log('error in Dynamo get', err)
  return null
})
```

### Adding data

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
Reference: https://github.com/serverless/serverless/issues/10944
