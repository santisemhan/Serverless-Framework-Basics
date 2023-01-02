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

## Upload to S3 Bucket

To upload local data to S3 Bucket in AWS

```bash
  npm i --save serverless-s3-sync
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
[Reference]("https://github.com/serverless/serverless/issues/10944")
