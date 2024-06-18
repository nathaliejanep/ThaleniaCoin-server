import { generateKeyPairSync } from 'crypto';

/**
 * Generates a public-private key pair
 * @returns {Object} An object containing the public and private keys
 */
const generateKeyPair = () => {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  return { publicKey, privateKey };
};

export { generateKeyPair };
