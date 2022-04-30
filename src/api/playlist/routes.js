const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  // ----- playlist
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongPlaylistHandler,
    options:
        {
          auth: 'openmusic_jwt',
        },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  /*  ------playsong
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getPlaylistByActivitiesHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  }, * */
];

module.exports = routes;
