const CollaborationsPayloadSchema = require('./schema');
const InvariantErrror = require('../../exceptions/InvariantError');

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const validationResult = CollaborationsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantErrror(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;