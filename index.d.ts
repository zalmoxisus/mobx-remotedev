/**
 * Decorator for Mobx stores
 */

export default function<T>(
  config?: RemoteDevConfig
): (component: any, config?: RemoteDevConfig) => void;

/**
 * Wrapper for Mobx stores
 */
export default function<T>(store: T, config?: RemoteDevConfig): T;

/**
 * Config object for remotedev function argument
 */
export type RemoteDevConfig = {
  /**the instance name to be showed on the monitor page. Default value is document.title. */
  name?: string;
  /**set it to true to have a clear log only with actions. If MobX is in strict mode, it is true by default. Don't forget about async actions. */
  onlyActions?: Boolean;
  /**set it to true in order to assign dispatching of all unhandled actions to this store. Useful for nested classes /
   *  observables or when having async actions without specifying the scope explicitly. */
  global?: Boolean;
  /**map of arrays named whitelist or blacklist to filter action types. You can also set it globally in the extension settings.
   */
  filters?: object;
  /** set it to true to have remote monitoring via the local or remotedev.io server. remote: false is used for the extension or react-native-debugger */
  remote?: boolean;
  /**use to specify host for remotedev-server. If port is specified, default value is localhost. */
  hostname?: string;
  /**use to specify host's port for remotedev-server. */
  port?: number;
};
