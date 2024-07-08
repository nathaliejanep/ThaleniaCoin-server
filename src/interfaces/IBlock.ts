interface IBlock {
  timestamp: number;
  index: number;
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  transactions: Array<any>;

  toString(): string;
}

export default IBlock;
