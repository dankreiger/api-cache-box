export type CacheBoxCallback = (...args: any[]) => any;

export type ApiCacheBoxCache = {
  [key: string]: any;
};

export interface ApiCacheBoxParams {
  url: string;
  apiFn: (...args: any[]) => any;
  successCallback: CacheBoxCallback;
  failureCallback: CacheBoxCallback;
  cacheObject?: ApiCacheBoxCache;
}
