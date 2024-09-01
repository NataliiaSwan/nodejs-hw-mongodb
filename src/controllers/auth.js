import {
  loginUser,
  registerUser,
  logoutUser,
  refreshUsersSession,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/index.js';

export const registerUserController = async (req, res) => {
  try {
    const payload = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    const user = await registerUser(payload);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to register user',
      error: error.message,
    });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const session = await loginUser(email, password);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.json({
      status: 200,
      message: 'Successfully logged in user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to login user',
      error: error.message,
    });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to logout user',
      error: error.message,
    });
  }
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const refreshUserSessionController = async (req, res) => {
  try {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });
    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refreshed session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to refresh session',
      error: error.message,
    });
  }
};

export const requestResetEmailController = async (req, res) => {
  try {
    await requestResetToken(req.body.email);
    res.json({
      message: 'Reset password email has been successfully sent.',
      status: 200,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to send reset password email',
      error: error.message,
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    await resetPassword(req.body);
    res.json({
      message: 'Password has been successfully reset',
      status: 200,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};
