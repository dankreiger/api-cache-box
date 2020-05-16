export type CacheBoxCallback = (...args: any[]) => any;

export type ApiCacheBoxCache = {
  [key: string]: any;
};

export interface ApiCacheBoxParams {
  url: string;
  successCallback: CacheBoxCallback;
  failureCallback: CacheBoxCallback;
  apiFn?: (...args: any[]) => any;
  cacheObject?: ApiCacheBoxCache;
}
