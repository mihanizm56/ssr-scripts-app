import { createServer } from 'http';
import { Duplex } from 'stream';
import { IApplicationServer } from '@/_types';

// const PORT = env.PORT ? Number(env.PORT) : 3000;
const PORT = process.env.PORT || 3000;

/* eslint-disable no-console */
export const createHttpServer = (app: IApplicationServer) =>
  new Promise((resolve) => {
    const clientErrorHandler = (error: Error, socket: Duplex) => {
      console.error('clientErrorHandler', error);

      socket.end('HTTP/1.1 400 Bad Request');
    };

    createServer(app)
      .on('clientError', clientErrorHandler)
      .listen(PORT, (error?: Error) => {
        if (error) {
          console.error(error, 'Server error on listenCallback');
        }

        console.log(`Server is running on port ${PORT}`);

        /**
         * Send ready signal for graceful startup/shutdown with PM2
         * Process.send is only enabled if process was spawned by parent process,
         * so we have to check this explicitly
         */
        if (typeof process.send === 'function') {
          process.send('ready');
        }

        resolve(null);
      });
  });
