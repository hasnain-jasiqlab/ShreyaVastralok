import { supabase } from '../config/supabase.js';
import { pool } from '../config/database.js';
import AppError from './appError.js';

const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verification token with Supabase
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

    if (error || !supabaseUser) {
      return next(new AppError('Invalid token or session expired', 401));
    }

    // 3) Check if user exists in our local database
    // Link by email or supabase uid if you have that column
    let result = await pool.query('SELECT * FROM users WHERE email = $1', [supabaseUser.email]);
    let user = result.rows[0];

    if (!user) {
      // If user doesn't exist locally, create them (auto-sync)
      const newUser = await pool.query(
        'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
        [supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0], supabaseUser.email, 'user']
      );
      user = newUser.rows[0];
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = user;
    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const isLoggedIn = async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

      if (supabaseUser && !error) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [supabaseUser.email]);
        if (result.rows.length > 0) {
          res.locals.user = result.rows[0];
          req.user = result.rows[0];
        }
      }
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

// signToken and createSendToken might not be needed if Supabase handles everything on frontend,
// but we'll keep them if the backend still needs to issue legacy tokens or for compatibility.
import jwt from 'jsonwebtoken';
const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id, user.role);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  user.password = undefined;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

export { signToken, createSendToken, protect, isLoggedIn, restrictTo };

