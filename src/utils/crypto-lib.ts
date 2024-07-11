import crypto from 'crypto';

const createHash = (stringToHash: string) => {
  return crypto.createHash('sha256').update(stringToHash).digest('hex');
};

export default createHash;
