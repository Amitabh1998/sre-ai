/**
 * Encryption utilities for integration credentials
 * Uses AES-256-GCM encryption for sensitive data
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }

  // Derive a 32-byte key from the environment variable
  return crypto
    .createHash("sha256")
    .update(encryptionKey)
    .digest();
}

/**
 * Encrypt sensitive configuration data
 */
export function encryptConfig(config: Record<string, unknown>): Record<string, unknown> {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const configString = JSON.stringify(config);
  let encrypted = cipher.update(configString, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  // Store IV and tag with encrypted data
  return {
    encrypted: encrypted,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
}

/**
 * Decrypt sensitive configuration data
 */
export function decryptConfig(encryptedConfig: Record<string, unknown>): Record<string, unknown> {
  // If config is not encrypted (legacy data), return as-is
  if (!encryptedConfig.encrypted || !encryptedConfig.iv || !encryptedConfig.tag) {
    return encryptedConfig;
  }

  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(encryptedConfig.iv as string, "hex");
    const tag = Buffer.from(encryptedConfig.tag as string, "hex");
    const encrypted = encryptedConfig.encrypted as string;

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Failed to decrypt config:", error);
    // Return empty config if decryption fails
    return {};
  }
}

