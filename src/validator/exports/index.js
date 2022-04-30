const ExportsPlaylistPayloadSchema = require('./schema');
const InvariantError = require('../../exception/InvarianError');

const ExportsValidator = {
  validateExportsPlaylistPayload: (payload) => {
    const validationResult = ExportsPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

};

module.exports = ExportsValidator;
