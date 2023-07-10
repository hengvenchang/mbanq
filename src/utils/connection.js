const AWS = require("aws-sdk");

const params = {
  TableName: process.env.DYNAMODB_USER_TABLE,
};

const dynamodb = async () => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  return dynamodb;
};

const dynamodbScan = async () => {
  const connection = await dynamodb();
  return connection.scan(params).promise();
};

const dynamodbGet = async (id) => {
  const getParams = {
    ...params,
    Key: {
      id,
    },
  };

  const dbConnection = await dynamodb();
  return dbConnection.get(getParams).promise();
};

const dynamodbPut = async (item) => {
  const putParams = {
    ...params,
    Item: item,
  };
  const dbConnection = await dynamodb();
  return dbConnection.put(putParams).promise();
};

const dynamodbUpdate = async (userId, note) => {
  const p = {
    ...params,
    Key: { id: userId },
    UpdateExpression: "SET #notes = #notes.L.append(newNote)",
    ExpressionAttributeNames: {
      "#notes": "notes",
    },
    ExpressionAttributeValues: {
      ":newNote": { L: [note.note, "world"] },
    },
  };
  console.log("p", p);
  const dbConnection = await dynamodb();
  return dbConnection.update(p).promise();
};

module.exports = {
  dynamodb,
  dynamodbScan,
  dynamodbGet,
  dynamodbPut,
  dynamodbUpdate,
};
