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

  console.log("putParams", putParams);
  const dbConnection = await dynamodb();
  return dbConnection.put(putParams).promise();
};

const dynamodbUpdate = async (userId, note) => {
  try {
    const result = await dynamodbGet(userId);

    if (!result.Item) {
      return APIBadRequestResponse({ message: "User not found" });
    }
    const notes = result.Item.notes;

    if (result.Item && result.Item.notes) {
      notes.push(note);
    }

    const updateParams = {
      ...params,
      Key: {
        id: userId,
      },
      UpdateExpression:
        "SET notes = list_append(if_not_exists(notes, :emptyList), :newNotes)",
      ExpressionAttributeValues: {
        ":emptyList": [],
        ":newNotes": notes,
      },
      ReturnValues: "ALL_NEW",
    };

    const dbConnection = await dynamodb();
    return dbConnection.update(updateParams, (err) => {
      if (err) {
        console.error("Error updating item in DynamoDB", err);
      } else {
        console.log("Item updated successfully");
      }
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

module.exports = {
  dynamodb,
  dynamodbScan,
  dynamodbGet,
  dynamodbPut,
  dynamodbUpdate,
};
