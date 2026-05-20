// src/config/jwt.config.ts
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required. Please set it in your .env file.');
}

export const jwtConfig = {
  secret: jwtSecret,
  expiresIn: '24h',
  refreshExpiresIn: '7d',
};
