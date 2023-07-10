const { dynamodbGet } = require("../utils/db/db");
const {
  APIResponse,
  APIBadRequestResponse,
} = require("../utils/response/APIResponse");

module.exports.handler = async (event) => {
  if (!event?.pathParameters?.id) {
    return APIBadRequestResponse({ message: "Id path parameters is required" });
  }

  const id = event.pathParameters.id;
  const result = await dynamodbGet(id);

  if (result.Item) {
    return APIResponse(result.Item);
  } else {
    return APIBadRequestResponse({ message: "User not found" });
  }
};
