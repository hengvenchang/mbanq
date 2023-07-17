const AWS = require("aws-sdk");

const TABLE_PARMS = {
  TableName: process.env.DYNAMODB_USER_TABLE,
};

const dynamodbClient = () => new AWS.DynamoDB.DocumentClient();

const dynamodbScan = async () => {
  return dynamodbClient().scan(TABLE_PARMS).promise();
};

const dynamodbGet = async (id) => {
  const params = {
    ...TABLE_PARMS,
    Key: { id },
  };

  return dynamodbClient().get(params).promise();
};

const dynamodbPut = async (item) => {
  const putParams = {
    ...TABLE_PARMS,
    Item: item,
  };
  return dynamodbClient().put(putParams).promise();
};

const dynamodbUpdate = async (params) => {
  params = {
    ...params,
    ...TABLE_PARMS,
  };
  return dynamodbClient().update(params).promise();
};

module.exports = {
  dynamodbClient,
  dynamodbScan,
  dynamodbGet,
  dynamodbPut,
  dynamodbUpdate,
};
