const APIResponse = (body) => {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};

const APIBadRequestResponse = (body) => {
  return {
    statusCode: 401,
    body: JSON.stringify(body),
  };
};

const APICreatedResponse = (body) => {
  return {
    statusCode: 201,
    body: JSON.stringify(body),
  };
};

module.exports = {
  APIResponse,
  APIBadRequestResponse,
  APICreatedResponse,
};
