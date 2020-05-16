import { ApiCacheBoxParams, ApiCacheBoxCache } from "./ApiCacheBox";

let ___apiCacheObject: { [key: string]: any } = {};
export const bustApiCacheObject = () => (___apiCacheObject = {});

export async function apiCacheBox({
  url,
  apiFn,
  successCallback,
  failureCallback,
}: ApiCacheBoxParams): Promise<ApiCacheBoxCache> {
  const cacheKey = new URL(url).searchParams.toString();
  try {
    const res = await apiFn(url);
    ___apiCacheObject[cacheKey] = res;
    successCallback(res);
  } catch (error) {
    failureCallback(error);
  } finally {
    return ___apiCacheObject;
  }
}
