const { APIResponse } = require("./utils/response/APIResponse");

module.exports.handler = () => {
  return APIResponse({ message: "Demo API for Mbanq!" });
};
