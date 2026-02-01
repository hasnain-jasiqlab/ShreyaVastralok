import { pool } from '../config/database.js';
import { supabase } from '../config/supabase.js';
import AppError from '../utils/appError.js';

const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // 1) Signup with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone }
      }
    });

    if (authError) {
      return next(new AppError(authError.message, 400));
    }

    // 2) Create/Sync user in local database
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, role)
       VALUES ($1, $2, $3, 'user')
       ON CONFLICT (email) DO UPDATE SET name = $1, phone = $3
       RETURNING id, name, email, role, phone, created_at, updated_at`,
      [name, email, phone]
    );

    const user = result.rows[0];

    res.status(201).json({
      status: 'success',
      token: authData.session?.access_token,
      data: {
        user,
        session: authData.session
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 1) Login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 2) Get user from local DB
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    if (!user) {
      // Sync if missing
      const syncResult = await pool.query(
        'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
        [data.user.user_metadata?.name || email.split('@')[0], email, 'user']
      );
      user = syncResult.rows[0];
    }

    res.status(200).json({
      status: 'success',
      token: data.session.access_token,
      data: {
        user,
        session: data.session
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await supabase.auth.signOut();
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, phone, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

export {
  signup,
  login,
  logout,
  getMe
};

