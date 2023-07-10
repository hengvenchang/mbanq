const uuid = require("uuid");
const joi = require("joi");
const { dynamodbPut, dynamodbGet } = require("../utils/db/db");
const { APICreatedResponse } = require("../utils/response/APIResponse");
const { convertEventBodyToDTO } = require("../utils/request/dtoValidation");

const schema = joi.object({
  username: joi.string().required(),
  dob: joi.date().optional(),
  gender: joi.string().optional(),
});

module.exports.handler = async (event) => {
  try {
    // convert event body to Json object and validate using defined schema
    const dto = convertEventBodyToDTO(event, schema);

    // Generate a unique ID for item
    const id = uuid.v4();
    await dynamodbPut({
      id,
      username: dto.username,
      dob: dto.dob,
      createdAt: new Date().toString(),
    });

    // Retrieve back the newly created item
    const result = await dynamodbGet(id);
    return APICreatedResponse({ result });
  } catch (error) {
    return error;
  }
};
