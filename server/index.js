import chokidar from 'chokidar';
import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import routes from './routes/routes.js';
import socketio from 'socket.io';
import locale from './middleware/locale.js';
import random from '../isomorphic/random.js';
import {promises} from 'fs';
import cookie from '@hapi/cookie';
import {setupAuth} from './utils/auth.js';

const server = Hapi.server({
  port: process.env.PORT || 24040,
  routes: {
    cors: {
      origin: ['http://localhost:24040']
    },
    validate: {
      failAction: async (request, h, err) => {
        if (process.env.NODE_ENV === 'production') {
          console.error('ValidationError:', err.message);
          throw Boom.badRequest(`Invalid request payload input`);
        } else {
          console.error(err);
          throw err;
        }
      }
    }
  }
});

const init = async () => {
  server.app.secret = await initSecurity();
  await server.register(Inert);
  // await server.register(auth);
  await server.register(cookie);
  await server.register(locale);
  setupAuth(server);
  routes(server);
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});

if (process.env.NODE_ENV === 'dev') {
  const io = socketio(server.listener);
  const watcher = chokidar.watch(['client/**/*.*'], {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  let sockets = [];
  io.on('connection', function(socket) {
    if (!sockets.find(s => s === socket)) {
      sockets.push(socket);
    }
  });

  watcher.on('change', path => {
    console.info(`client reload from change: ${path}`);
    sockets.forEach(socket => {
      socket.emit('reload');
    });
  });

  process.once('SIGUSR2', () => {
    sockets.forEach(socket => {
      socket.emit('delayed-reload');
    });
    process.kill(process.pid, 'SIGUSR2');
  });
}

const initSecurity = async () => {
  const filename = './session.hash';
  try {
    const hash = await promises.readFile(filename);
    return hash;
  } catch (err) {
    const hash = random(32, true);
    const test = await promises.writeFile(filename, hash);
    return hash;
  }
  // creating a hash file for a password for JWT.
  // see if the file already exists, if it does, return the contents.
  // if it doesn't then generate it, and return the contents.
};

init();
