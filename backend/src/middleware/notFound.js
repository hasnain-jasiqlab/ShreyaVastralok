import { StatusCodes } from 'http-status-codes';

const notFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`
  });
};

export { notFound };
