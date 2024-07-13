import Pubnub, { PubnubConfig } from 'pubnub';
import dotenv from 'dotenv';

dotenv.config();

interface IPortMessage {
  address: number; // Assuming this is a port number
}

// FIXME move to settings
const CHANNELS = {
  BLOCKCHAIN: 'BLOCKCHAIN',
  NODES: 'NODES',
};

const credentials = {
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  secretKey: process.env.PUBNUB_SECRET_KEY,
  userId: 'dev-user',
};

class PubNubServer {
  private blockchain: any;
  private nodePort: number;
  private pubnub: any;
  private nodes: any[] = []; // FIXME type: number?

  constructor(blockchain: any, nodePort: number) {
    this.blockchain = blockchain;
    this.nodePort = nodePort;
    this.pubnub = new Pubnub(credentials as PubnubConfig);
    this.subscribeChannels();
    this.pubnub.addListener(this.listener());
    this.broadcastNodeDetails();
  }

  // TODO create parameters to keep DRY
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
        // console.log(newChain);

        console.log(
          `Medddelande mottagits på kanal: ${channel}. `
          // meddelande: ${message}`
        );

        if (channel === CHANNELS.BLOCKCHAIN) {
          this.blockchain.replaceChain(newChain);
        }
      },
    };
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
