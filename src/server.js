/* eslint-disable no-console */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// song
const songs = require('./api/songs');
const SongService = require('./service/postgres/SongService');
const SongValidator = require('./validator/songs');

// album
const albums = require('./api/albums');
const AlbumService = require('./service/postgres/AlbumService');
const AlbumValidator = require('./validator/albums');

// users
const users = require('./api/users');
const UsersService = require('./service/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const AuthenticationService = require('./service/postgres/AuthenticationsService');
const authentications = require('./api/authentications');

// playlist
const playlists = require('./api/playlist');
const PlaylistService = require('./service/postgres/PlaylistService');
const playlistValidator = require('./validator/playlist');
const TokenManager = require('./tokenize/tokenManager');
const AuthenticationsValidator = require('./validator/Authentications');

// collaborations
const CollaborationsService = require('./service/postgres/CollaborationsService');
const collaborations = require('./api/collaborations');
const CollaborationsValidator = require('./validator/Collaborations');

// exports
const _exports = require('./api/exports');
const ProducerService = require('./service/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// upload
const StorageService = require('./service/storage/StorageService');
const UploadValidator = require('./validator/upload');

// cache
const CacheService = require('./service/redis/CacheService');

const init = async () => {
  const songService = new SongService();
  const cacheService = new CacheService();
  const albumService = new AlbumService(cacheService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationService();
  const collaborationsService = new CollaborationsService();
  const playlistService = new PlaylistService(collaborationsService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/albums/file/images'));

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategi autentikasi jwt

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
        storageService,
        uploadValidator: UploadValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistService,
        songService,
        validator: playlistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
        playlistService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
