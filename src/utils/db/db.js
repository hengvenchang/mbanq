const AWS = require("aws-sdk");

const TABLE_PARMS = {
  TableName: process.env.DYNAMODB_USER_TABLE,
};

const dynamodbClient = () => new AWS.DynamoDB.DocumentClient();

const dynamodbScan = async () => {
  const connection = await dynamodbClient();
  return connection.scan(TABLE_PARMS).promise();
};

const dynamodbGet = async (id) => {
  const params = {
    ...TABLE_PARMS,
    Key: {
      id,
    },
  };

  const dbConnection = await dynamodbClient();
  return dbConnection.get(params).promise();
};

const dynamodbPut = async (item) => {
  const putParams = {
    ...TABLE_PARMS,
    Item: item,
  };
  const dbConnection = await dynamodbClient();
  return dbConnection.put(putParams).promise();
};

// const dynamodbUpdate = async (userId, note) => {
//   try {
// const result = await dynamodbGet(userId);

// if (!result.Item) {
//   return APIBadRequestResponse({ message: "User not found" });
// }

// const notes = result.Item.notes;
// if (result.Item && result.Item.notes) {
//   notes.push(note);
// }

// const updateParams = {
//   ...TABLE_PARMS,
//   Key: {
//     id: userId,
//   },
//   UpdateExpression:
//     "SET notes = list_append(if_not_exists(notes, :emptyList), :newNotes)",
//   ExpressionAttributeValues: {
//     ":emptyList": [],
//     ":newNotes": notes,
//   },
//   ReturnValues: "ALL_NEW",
// };

//     const dbConnection = await dynamodbClient();
//     return dbConnection.update(updateParams, (err) => {
//       if (err) {
//         console.error("Error updating item in DynamoDB", err);
//       } else {
//         console.log("Item updated successfully");
//       }
//     });
//   } catch (error) {
//     console.log("error", error);
//     throw error;
//   }
// };

const dynamodbUpdate = async (params) => {
  params = {
    ...params,
    ...TABLE_PARMS,
  };
  const dbConnection = await dynamodbClient();
  return dbConnection.update(params);
};

module.exports = {
  dynamodbClient,
  dynamodbScan,
  dynamodbGet,
  dynamodbPut,
  dynamodbUpdate,
};
