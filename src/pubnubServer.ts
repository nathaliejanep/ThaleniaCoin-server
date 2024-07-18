import Pubnub, { PubnubConfig } from 'pubnub';
import dotenv from 'dotenv';
import { transactionPool } from './server.js';

dotenv.config();

interface IPortMessage {
  address: number; // Assuming this is a port number
}

// FIXME move to settings
const CHANNELS = {
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
  NODES: 'NODES',
};

const credentials = {
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  secretKey: process.env.PUBNUB_SECRET_KEY,
  userId: 'dev-user',
};

// TYPE for parameters
class PubNubServer {
  private blockchain: any;
  private transactionPool: any;
  private wallet: any;
  private nodePort: number;
  private pubnub: any;
  private nodes: any[] = []; // FIXME type: number?

  // FIXME change constructor to take in {}
  constructor(
    blockchain: any,
    transactionPool: any,
    wallet: any,
    nodePort: number
  ) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.nodePort = nodePort;
    this.pubnub = new Pubnub(credentials as PubnubConfig);
    this.subscribeChannels();
    this.pubnub.addListener(this.listener());
    this.broadcastNodeDetails();
  }

  // FIXME use this.publish to keep DRY
  broadcast() {
    try {
      this.pubnub.publish({
        channel: CHANNELS.BLOCKCHAIN,
        message: JSON.stringify(this.blockchain.chain),
      });
      console.log('Successfully published blockchain data');
    } catch (err) {
      console.error(`Failed to publish blockchain data, error: ${err}`);
    }
  }

  broadcastTransaction(transaction: any) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }

  broadcastNodeDetails() {
    const portMessage: IPortMessage = { address: this.nodePort };
    try {
      this.pubnub.publish({
        channel: CHANNELS.NODES,
        message: JSON.stringify(portMessage),
      });
    } catch (err) {
      console.error(`Failed to publish nodes data, error: ${err}`);
    }
  }

  getNodes(): any[] {
    return this.nodes; // FIXME Adjust return type
  }

  listener() {
    return {
      message: (msgObject: any) => {
        const { channel, message } = msgObject;
        const newChain = JSON.parse(message);

        console.log(
          `Medddelande mottagits på kanal: ${channel}. `
          // meddelande: ${message}`
        );

        if (channel === CHANNELS.BLOCKCHAIN) {
          this.blockchain.replaceChain(newChain);
          this.transactionPool.clearBlockTransactions({ chain: newChain });
        }

        if (channel === CHANNELS.TRANSACTION) {
          if (
            !this.transactionPool.transactionExist({
              address: this.wallet.publicKey,
            })
          ) {
            this.transactionPool.addTransaction(newChain);
          }
        }

        if (channel === CHANNELS.NODES) this.nodes.push(newChain);
      },
    };
  }

  publish({ channel, message }: { channel: string; message: string }) {
    this.pubnub.publish({ channel, message });
  }

  subscribeChannels() {
    try {
      this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
    } catch (err) {
      console.error(`Failed to subscribe to channels, error: ${err}`);
    }
  }
}

export default PubNubServer;
