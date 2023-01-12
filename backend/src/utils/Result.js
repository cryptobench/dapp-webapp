const Ok = (payload) => ({
  success: true,
  payload,
});

class UserError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "UserError";
    this.code = code ? code : 400;
  }
  toJson() {
    return {
      success: false,
      error: this.message,
      code: this.code,
    };
  }
}

module.exports = { UserError, Ok };
