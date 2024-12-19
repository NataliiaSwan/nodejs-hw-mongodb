import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersCollection } from '../db/models/User.js';
import createHttpError from 'http-errors';
import {
  FIFTEEN_MINUTES,
  THIRTY_DAYS,
  TEMPLATES_DIR,
} from '../constants/index.js';
import { SessionCollection } from '../db/models/Session.js';
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

export const registerUser = async (payload) => {
  const existingUser = await UsersCollection.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });
};

export const loginUser = async (email, password) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createHttpError(401, 'Unauthorized');

  await SessionCollection.deleteMany({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) throw createHttpError(401, 'Session not found');

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  const newSession = createSession();
  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = jwt.sign({ sub: user._id, email }, env('JWT_SECRET'), {
    expiresIn: '15m',
  });

  const templatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');
  const templateSource = await fs.readFile(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    throw createHttpError(500, `Failed to send the email: ${error.message}`);
  }
};

export const resetPassword = async (payload) => {
  let decodedToken;

  try {
    decodedToken = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid');
    }
    throw error;
  }

  const user = await UsersCollection.findOne({
    email: decodedToken.email,
    _id: decodedToken.sub,
  });

  if (!user) throw createHttpError(404, 'User not found');

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  await UsersCollection.updateOne(
    { _id: user._id },
    { password: hashedPassword },
  );
};