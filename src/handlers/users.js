const { dynamodbScan } = require("../utils/connection");
const { APIResponse } = require("../utils/response/APIResponse");
module.exports.handler = async () => {
  const result = await dynamodbScan();

  if (result.Count === 0) {
    return {
      statusCode: 404,
    };
  }

  return APIResponse({
    total: result.Count,
    items: await result.Items,
  });
};
