/**
 * Observer
 */
export default function<T>(store: T, config: RemoteDevConfig): T;

/**
 * Config object for remotedev function argument
 */
export type RemoteDevConfig = {
  name: string;
  onlyActions: Boolean;
  global: Boolean;
  filters: object;
  remote: boolean;
  hostname: string;
  port: number;
};
