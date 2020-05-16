import { ApiCacheBoxParams, ApiCacheBoxCache } from "./ApiCacheBox";

let ___apiCacheObject: { [key: string]: any } = {};
export const bustApiCacheObject = () => (___apiCacheObject = {});

export async function apiCacheBox({
  url,
  successCallback,
  failureCallback,
  apiFn,
}: ApiCacheBoxParams): Promise<ApiCacheBoxCache> {
  const cacheKey = new URL(url).searchParams.toString();
  if (___apiCacheObject[cacheKey]) return ___apiCacheObject;
  try {
    let json;
    if (!apiFn) {
      const res = await fetch(url);
      json = await res.json();
    } else {
      json = await apiFn(url);
    }
    ___apiCacheObject[cacheKey] = json;
    successCallback(json);
  } catch (error) {
    failureCallback(error);
  } finally {
    return ___apiCacheObject;
  }
}
