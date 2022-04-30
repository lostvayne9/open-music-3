const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportsNotesHandler,

    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
