import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId =
  (idName = 'id') =>
  (req, res, next) => {
    const id = req.params[idName];

    if (!id) {
      throw createHttpError(400, `Id parameter ${idName} is required`);
    }
    if (!isValidObjectId(id)) {
      return next(createHttpError(400, 'Invalid Id format'));
    }
    return next();
  };
