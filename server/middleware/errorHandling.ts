import type { MiddlewareError } from '@/server/types/middleware';
import type { Request, Response } from 'express';

/**
 * Create an error object to be used in the error handling middleware.
 *
 * @param method The method where the error occurred
 * @param controller The controller where the error occurred
 * @param message The error message
 * @param error The error object
 * @param status The status code to return
 *
 * @return the error object
 */
export function createError(
  method: string,
  controller: string,
  errorString: string,
  error: unknown
): Error {
  switch (typeof error) {
    case 'string':
      errorString = error;
      break;
    case 'object':
      errorString = JSON.stringify(error, Object.getOwnPropertyNames(error));
      break;
    default:
      console.error('Error type not handled in createError.');
      console.error('Error type:', typeof error);
  }

  const errorMessage = `Error occured in ${controller}.${method}: ${errorString}`;
  const wrappedError = new Error(errorMessage);

  return wrappedError;
}

export function globalErrorHandler(
  err: Error,
  _: Request,
  res: Response
): Response {
  const defaultError: MiddlewareError = {
    name: 'MiddlewareError',
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };

  const errObj = Object.assign(defaultError, err);

  return res.status(errObj.status).json(errObj.message);
}
