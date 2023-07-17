const uuid = require("uuid");
const joi = require("joi");
const { dynamodbUpdate, dynamodbGet } = require("../utils/db/db");
const { APIBadRequestResponse } = require("../utils/response/APIResponse");
const { convertEventBodyToDTO } = require("../utils/request/dtoValidation");

const schema = joi.object({
  userId: joi.string().required(),
  note: joi.string().required(),
});

module.exports.handler = async (event) => {
  try {
    // convert event body to Json object and validate using defined schema
    const dto = convertEventBodyToDTO(event, schema);

    // Check if item already exist
    const result = await dynamodbGet(dto.userId);
    if (!result.Item) {
      return APIBadRequestResponse({ message: "User not found" });
    }

    // Generate a unique ID for note1
    const newNote = {
      id: uuid.v4(),
      text: dto.note,
      createdAt: new Date().toString(),
    };

    const updateParams = {
      Key: {
        id: dto.userId,
      },
      UpdateExpression:
        "SET notes = list_append(if_not_exists(notes, :emptyList), :newNotes)",
      ExpressionAttributeValues: {
        ":emptyList": [],
        ":newNotes": [newNote],
      },
      ReturnValues: "ALL_NEW",
    };
    // Update item notes
    return dynamodbUpdate(updateParams);
  } catch (error) {
    return error;
  }
};
