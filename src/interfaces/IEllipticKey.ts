interface IEllipticKey {
  verify(hash: string, signature: string): boolean;
  keyFromPublic(publicKey: string, encoding: 'hex' | 'base64'): IEllipticKey;
}

export default IEllipticKey;
