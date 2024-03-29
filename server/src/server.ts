import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import apiRouter from './routes/api';
import path from 'path';
import logger from 'jet-logger';
import { CustomError } from '@shared/errors';


// **** Variables **** //

const app = express();


// **** Set basic express settings ****# //

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}


// **** Add API Routes ****# //

// Add api router
app.use('/api', apiRouter);

// Error handling
app.use((err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
  logger.err(err, true);
  const status = (err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST);
  return res.status(status).json({
    error: err.message,
  });
});

// Set views dir
const _app_folder = path.join(path.resolve(__dirname, "../../"), "ui/dist/mhrise-set-maker/")

app.get('*.*', express.static(_app_folder, {maxAge: '1y'}));

// Serve index.html file
app.all('*', (_: Request, res: Response) => {
  res.status(200).sendFile(`/`, {root: _app_folder});
});


// **** Export default **** //

export default app;
