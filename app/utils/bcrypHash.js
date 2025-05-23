import bcrypt from "bcrypt";
import logger from "./logger.js";

/**
 * Hash a password using bcrypt
 * @param {string} password - The plain text password to hash
 * @param {number} saltRounds - Number of salt rounds (default: 10)
 * @returns {Promise<string>} The hashed password
 */
export const bcryptHashPassword = async (password, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    logger.error("Error hashing password with bcrypt:", error);
    throw new Error("Error hashing password");
  }
};

/**
 * Verify a password against a hash using bcrypt
 * @param {string} password - The plain text password to verify
 * @param {string} hash - The hashed password to verify against
 * @returns {Promise<boolean>} Whether the password matches the hash
 */
export const bcryptVerifyPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error("Error verifying password with bcrypt:", error);
    throw new Error("Error verifying password");
  }
};

/**
 * Generate a secure random password
 * @param {number} length - Length of the password (default: 12)
 * @returns {string} A secure random password
 */
export const bcryptGenerateSecurePassword = (length = 12) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }

  return password;
};

/**
 * Get the cost factor from a bcrypt hash
 * @param {string} hash - The bcrypt hash to analyze
 * @returns {number} The cost factor used in the hash
 */
export const bcryptGetHashCost = (hash) => {
  try {
    return parseInt(hash.split("$")[2]);
  } catch (error) {
    logger.error("Error getting hash cost:", error);
    throw new Error("Invalid hash format");
  }
};
