interface IVerifySignatureParams {
  publicKey: string;
  data: any; // TODO !!!  type? - string? and change in verifySignaturre something JSON.stringify?
  signature: string;
}

export default IVerifySignatureParams;
