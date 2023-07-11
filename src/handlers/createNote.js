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

    // Generate a unique ID for note
    const newNote = {
      id: uuid.v4(),
      text: dto.note,
      createdAt: new Date().toString(),
    };

    const result = await dynamodbGet(dto.userId);
    if (!result.Item) {
      return APIBadRequestResponse({ message: "User not found" });
    }

    // Append new notes
    const notes = result.Item.notes;
    let newNotes = [];
    if (notes) {
      newNotes = [...result.Item.notes];
    }
    newNotes.push(newNote);
    const item = {
      id: dto.userId,
      notes: newNotes,
    };

    // Update item notes
    await dynamodbPut(item);

    // Retrieve back the newly created item
    const updated = await dynamodbGet(dto.userId);
    return APICreatedResponse({ result: updated });
  } catch (error) {
    return error;
  }
};
