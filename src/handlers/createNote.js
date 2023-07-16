const uuid = require("uuid");
const joi = require("joi");
const { dynamodbGet, dynamodbUpdate, dynamodbPut } = require("../utils/db/db");
const {
  APICreatedResponse,
  APIBadRequestResponse,
} = require("../utils/response/APIResponse");
const { convertEventBodyToDTO } = require("../utils/request/dtoValidation");

const schema = joi.object({
  userId: joi.string().required(),
  note: joi.string().required(),
});

module.exports.handler = async (event) => {
  try {
    // convert event body to Json object and validate using defined schema
    const dto = convertEventBodyToDTO(event, schema);

    // Generate a unique ID for note1
    const newNote = {
      id: uuid.v4(),
      text: dto.note,
      createdAt: new Date().toString(),
    };

    // Update item notes
    return dynamodbUpdate(dto.userId, newNote);
  } catch (error) {
    return error;
  }
};
