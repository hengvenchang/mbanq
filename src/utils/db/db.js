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

// all these comment function is my attempt to use update but couldn't able to make it work yet

// const dynamodbUpdate = async (userId, note) => {
//   const p = {
//     ...params,
//     Key: { id: userId },
//     UpdateExpression: "SET #notes = #notes.L.append(newNote)",
//     ExpressionAttributeNames: {
//       "#notes": "notes",
//     },
//     ExpressionAttributeValues: {
//       ":newNote": { L: [note.note, "world"] },
//     },
//   };
//   console.log("p", p);
//   const dbConnection = await dynamodb();
//   return dbConnection.update(p).promise();
// };

// const dynamodbUpdate = async (userId, note) => {
// const p = {
//   ...params,
//   Key: { id: { S: userId } },
//   UpdateExpression: "SET #ri = list_append(#ri, :vals)",
//   ExpressionAttributeNames: { "#ri": "notes" },
//   ExpressionAttributeValues: {
//     ":vals": {
//       L: [{ S: "Screwdriver" }, { S: "Hacksaw" }],
//     },
//   },
// };
// --table-name ProductCatalog \
// --key '{"Id":{"N":"789"}}' \

// --update-expression "SET #ri = list_append(#ri, :vals)" \
// --expression-attribute-names '{"#ri": "RelatedItems"}' \
// --expression-attribute-values file://values.json  \
// --return-values ALL_NEW

//   const dbConnection = await dynamodb();
//   return dbConnection.update(p).promise();
// };

// const dynamodbUpdate = async (userId, note) => {
//   const p = {
//     ...params,
//     Key: {
//       id: userId,
//     },
//     UpdateExpression: "set #title = :v_songTitle, #year = :v_year",
//     ExpressionAttributeNames: {
//       "#title": "SongTitle",
//       "#year": "Year",
//     },
//     ExpressionAttributeValues: {
//       ":v_songTitle": "Call me tomorrow",
//       ":v_year": 1998,
//     },
//     ReturnValues: "ALL_NEW",
//   };
//   console.log("p", p);
// const dbConnection = await dynamodb();
// return dbConnection.update(p).promise();
// };

// const dynamodbUpdate = async (userId, note) => {
//   const newNote = { id: note.id, text: note.note };
//   const item = {
//     id: userId,
//     notes: [newNote],
//   };
//   try {
//     const p = {
//       ...params,
//       Item: item,
//     };

//     const dbConnection = await dynamodb();
//     return dbConnection.put(p).promise();
//   } catch (error) {
//     console.log(error);
//   }
// };

// const dynamodbUpdate = async (userId, note) => {
//   try {
//     const dbConnection = await dynamodb();
//     const p = {
//       ...params,
//       Key: { id: userId },
//       UpdateExpression: "SET books = list_append(books, :newItem)",
//       ExpressionAttributeValues: {
//         ":newItem": [note],
//       },
//       ReturnValues: "ALL_NEW",
//     };
//     console.log("p", p);
//     return dbConnection.update(p).promise();
//   } catch (error) {
//     console.log(error);
//   }
// };

// const dynamodbUpdate = async (userId, note) => {
//   try {
//     const getParams = {
//       ...params,
//       Item: result,
//     };

//     const dbConnection = await dynamodb();
//     const result = dbConnection.get(getParams).promise();
//     console.log("results", result);

//     return dbConnection.put(p).promise();
//   } catch (error) {
//     console.log(error);
//   }
// };

const dynamodbUpdate = async (userId, note) => {
  try {
    const result = await dynamodbGet(userId);
    const notes = result.Item.notes;

    let newNotes = [];
    if (notes) {
      newNotes = [...result.Item.notes];
    }

    const item = {
      id: userId,
      notes: newNotes,
    };
    const p = {
      ...params,
      Item: item,
    };

    console.log("p", p);
    const dbConnection = await dynamodb();
    return dbConnection.put(p).promise();
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
