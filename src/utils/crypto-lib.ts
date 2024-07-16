import crypto from 'crypto';
import pkg from 'elliptic';
import IVerifySignatureParams from '../interfaces/IVerifySignatureParams.js';
import IEllipticKey from '../interfaces/IEllipticKey.js';

// const createHash = (stringToHash: string) => {
//   return crypto.createHash('sha256').update(stringToHash).digest('hex');
// };
const { ec } = pkg;

// TYPE args
const createHash = (...args: any) => {
  return crypto
    .createHash('sha256')
    .update(
      args
        .map((arg: any) => JSON.stringify(arg))
        .sort()
        .join('')
    )
    .digest('hex');
};

export const ellipticHash = new ec('secp256k1');

const verifySignature = ({
  publicKey,
  data,
  signature,
}: IVerifySignatureParams): boolean => {
  const key: IEllipticKey = ellipticHash.keyFromPublic(publicKey, 'hex') as any; // TODO !!! type?
  return key.verify(createHash(data), signature);
};

export { createHash, verifySignature };
