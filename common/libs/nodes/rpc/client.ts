import { randomBytes } from 'crypto';
import { JsonRpcResponse, RPCRequest } from './types';

export default class RPCClient {
  public endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public id(): string {
    return randomBytes(16).toString('hex');
  }

  public decorateRequest = (req: RPCRequest) => ({
    ...req,
    id: this.id(),
    jsonrpc: '2.0'
  });

  public call = (request: RPCRequest | any): Promise<JsonRpcResponse> => {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.decorateRequest(request))
    }).then(r => r.json());
  };

  public batch = (requests: RPCRequest[] | any): Promise<JsonRpcResponse[]> => {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requests.map(this.decorateRequest))
    }).then(r => r.json());
  };
}
