/* eslint-disable camelcase */
const mapDBToModelAlbum = ({
  id, name, year, created_at, updated_at, coverurl,
}) => ({
  id, name, year, createdAt: created_at, updatedAt: updated_at, coverUrl: coverurl,
});

module.exports = { mapDBToModelAlbum };
