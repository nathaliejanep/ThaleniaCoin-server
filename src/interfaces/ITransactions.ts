interface ITransactionDetails {
  sender: ISender;
  recipient: string;
  amount: number;
  input?: IInput;
  outputMap?: IOutputMap;
}

interface ISender {
  publicKey: string;
  balance: number;
  sign: (data: IOutputMap) => string;
}

interface IInput {
  timestamp: number;
  amount: number;
  address: string;
  signature: string;
}

interface IOutputMap {
  // [key: string]: number;
  [address: string]: number; 
}

interface ITransaction {
  id: string;
  input: IInput;
  outputMap: IOutputMap;
}

export { ITransactionDetails, ISender, IInput, IOutputMap, ITransaction };
