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
