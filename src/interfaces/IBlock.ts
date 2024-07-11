interface IBlock {
  timestamp: number;
  index: number;
  previousHash: string;
  hash: string;
  data: Array<any>;
  nonce: number;
  difficulty: number;

  toString(): string;
}

export default IBlock;
