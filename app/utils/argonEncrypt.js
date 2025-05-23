import argon2, { argon2id } from "argon2";

/**
 * Hash a password using Argon2
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} The hashed password
 */
export const argonHashPassword = async (password) => {
  try {
    const hash = await argon2.hash(password, {
      memoryCost: 19456, // 19MB
      timeCost: 2,
      parallelism: 1,
      outputLen: 32,
      type: argon2id,
      saltLength: 16,
    });
    return hash;
  } catch (error) {
    logger.error("Error hashing password", error);
    throw error;
  }
};

/**
 * Verify a password against a hash
 * @param {string} password - The plain text password to verify
 * @param {string} hash - The hashed password to verify against
 * @returns {Promise<boolean>} Whether the password matches the hash
 */
export const argonVerifyPassword = async (password, hash) => {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    logger.error("Error verifying password", error);
    throw error;
  }
};

/**
 * Generate a secure random password
 * @param {number} length - Length of the password (default: 12)
 * @returns {string} A secure random password
 */

export const generateRandomPassword = (length = 12) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};
