import jwt from "@fastify/jwt";
import logger from "./logger.js";

/**
 * Generate a JWT token
 * @param {Object} payload - The data to be encoded in the token
 * @param {Object} options - Token generation options
 * @param {string} options.secret - JWT secret key
 * @param {string} [options.expiresIn='1d'] - Token expiration time
 * @returns {string} The generated JWT token
 */
export const generateToken = (payload, options = {}) => {
  try {
    const secret = options.secret || process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error("JWT secret is required");
    }

    const token = jwt.sign(payload, secret, {
      expiresIn: options.expiresIn || "1d",
      algorithm: "HS256",
      ...options,
    });

    return token;
  } catch (error) {
    logger.error("Error generating JWT token:", error);
    throw new Error("Error generating token");
  }
};

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @param {Object} options - Verification options
 * @param {string} options.secret - JWT secret key
 * @returns {Object} The decoded token payload
 */
export const verifyToken = (token, options = {}) => {
  try {
    const secret = options.secret || process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error("JWT secret is required");
    }

    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      ...options,
    });

    return decoded;
  } catch (error) {
    logger.error("Error verifying JWT token:", error);
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw new Error("Error verifying token");
  }
};

/**
 * Decode a JWT token without verification
 * @param {string} token - The JWT token to decode
 * @returns {Object} The decoded token payload
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error("Error decoding JWT token:", error);
    throw new Error("Error decoding token");
  }
};

/**
 * Generate refresh token
 * @param {Object} payload - The data to be encoded in the token
 * @param {Object} options - Token generation options
 * @returns {string} The generated refresh token
 */
export const generateRefreshToken = (payload, options = {}) => {
  return generateToken(payload, {
    ...options,
    expiresIn: options.expiresIn || "7d", // Longer expiration for refresh tokens
  });
};

/**
 * Generate access token
 * @param {Object} payload - The data to be encoded in the token
 * @param {Object} options - Token generation options
 * @returns {string} The generated access token
 */
export const generateAccessToken = (payload, options = {}) => {
  return generateToken(payload, {
    ...options,
    expiresIn: options.expiresIn || "15m", // Shorter expiration for access tokens
  });
};
