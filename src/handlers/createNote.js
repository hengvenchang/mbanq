const uuid = require("uuid");
const joi = require("joi");
const { dynamodbGet, dynamodbUpdate } = require("../utils/connection");
const { APICreatedResponse } = require("../utils/response/APIResponse");
const { convertEventBodyToDTO } = require("../utils/request/dtoValidation");

const schema = joi.object({
  userId: joi.string().required(),
  note: joi.string().required(),
});

module.exports.handler = async (event) => {
  try {
    // convert event body to Json object and validate using defined schema
    const dto = convertEventBodyToDTO(event, schema);

    // Generate a unique ID for note
    const note = { id: uuid.v4(), note: dto.note };

    // Update item notes
    await dynamodbUpdate(dto.userId, note);

    // Retrieve back the newly created item
    const result = await dynamodbGet(dto.userId);
    return APICreatedResponse({ result });
  } catch (error) {
    return error;
  }
};
