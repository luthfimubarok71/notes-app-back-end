const Hapi = require('@hapi/hapi');
require('dotenv').config();
const ClientError = require('./exceptions/ClientError');

// notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

// users
const users = require('./api/users');
const UserService = require('./services/postgres/UsersService');
const UserValidator = require('./validator/users');

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UserService();
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
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResposne = h.response({
        status: 'fail',
        message: response.message,
      });
      newResposne.code(response.statusCode);
      return newResposne;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();