import { EventEmitter } from 'events'
import { Duplex } from 'stream';

declare namespace SwarmServer {
  type DiscoverySwarm = any
  type Key = Buffer

  export interface EncryptedSocket extends EventEmitter {
    new(socket: Duplex, publicKey: Key, secretKey: Key): EncryptedSocket
    connect(hostPublicKey?: Key): void
    write(data: Buffer): void
    destroy(): void
    on(eventName: 'data', callback: (data: Buffer) => void): this
    on(eventName: 'connection', callback: () => void): this
  }

  /**
   * @see https://github.com/maxogden/discovery-channel
   */
  interface DiscoveryChannelOptions {
    /**
     * DNS discovery options.
     * If false will disable dns discovery, any other value type will be passed to the dns-discovery constructor.
     * @default undefined
     */
    dns: {
      server: string[]
      domain: string
    } | false;

    /**
     * DHT discovery options.
     * If false will disable dht discovery, any other value type will be passed to the bittorrent-dht constructor.
     * @default undefined
     */
    dht: {
      bootstrap: string[]
    } | false;

    /**
     * Provide a custom hash function to hash ids before they are stored in the dht / on dns servers.
     * @default sha1
     */
    hash?: (id: Buffer) => Buffer | false;
  }

  /**
   * @see https://github.com/mafintosh/discovery-swarm#api
   */
  interface DiscoverySwarmOptions extends DiscoveryChannelOptions {
    id?: Buffer | string;
    stream?: any;
    connect?: any;
    utp?: boolean;
    tcp?: boolean;
    maxConnections?: number;
    whitelist?: string[];
  }

  /**
   * @see https://github.com/mafintosh/discovery-swarm#swonconnection-functionconnection-info---
   */
  interface ConnectionInfo {
    type: 'tcp' | 'utp'
    initiator: boolean
    channel?: Buffer
    host: string
    port: number
    id: Buffer
  }

  interface CommonOptions {
    publicKey: Key
    secretKey: Key

    /** Whether the keypair needs to be converted from a signature key to an encryption key. */
    convert?: boolean

    /** Network port */
    port?: number
  }

  export interface SwarmListenOptions extends CommonOptions, DiscoverySwarmOptions {
  }

  export interface SwarmConnectOptions extends CommonOptions, DiscoverySwarmOptions {
    hostPublicKey: Key
    timeout?: number
  }

  export function listen(
    opts: SwarmListenOptions,
    handler: (socket: EncryptedSocket, peerKey: Key) => void
  ): Promise<DiscoverySwarm>

  export function connect(opts: SwarmConnectOptions): Promise<{
    socket: EncryptedSocket,
    info: ConnectionInfo
  }>

  export const EncryptedSocket: EncryptedSocket
}

export = SwarmServer
