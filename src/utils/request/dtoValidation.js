const { APIBadRequestResponse } = require("../response/APIResponse");

const convertEventBodyToDTO = (event, schema) => {
  const body = event?.body;
  console.log(body, body);
  if (!body) {
    throw APIBadRequestResponse({ message: "Invalid body" });
  }

  // Validate Event Request
  const dto = typeof body === "string" ? JSON.parse(body) : body;
  const validatedEvent = schema.validate(dto);
  if (validatedEvent.error) {
    throw APIBadRequestResponse(validatedEvent.error);
  }
  return dto;
};

module.exports = {
  convertEventBodyToDTO,
};
