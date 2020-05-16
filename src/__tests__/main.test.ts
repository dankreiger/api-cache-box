import { apiCacheBox, bustApiCacheObject } from "../main";
import { ApiCacheBoxParams } from "../ApiCacheBox";
(global as any).fetch = require("jest-fetch-mock");

describe("ApiCacheBox", () => {
  afterEach(() => {
    bustApiCacheObject();
    (fetch as any).resetMocks();
  });
  test("success: given a url it calls fetch api. Then it calls success callbacks and finally returns cache data object", async () => {
    const mockResponse1 = [{ id: 1 }];
    (fetch as any).mockResponseOnce(JSON.stringify(mockResponse1));
    const successCallback1 = jest.fn();
    const failureCallback1 = jest.fn();
    const params1: ApiCacheBoxParams = {
      url: "https://api.sample.dev/search?size=36&page=1",
      successCallback: successCallback1,
      failureCallback: failureCallback1,
    };

    const results1 = await apiCacheBox(params1);

    const cacheObj = { "size=36&page=1": mockResponse1 };
    expect(results1).toEqual(cacheObj);
    expect(successCallback1).toHaveBeenCalledTimes(1);
    expect(successCallback1).toHaveBeenCalledWith(mockResponse1);
    expect(failureCallback1).toHaveBeenCalledTimes(0);
  });

  test("success: given a url and custom api function it calls custom api function. Then it calls success callbacks and returns cache data object", async () => {
    const mockResponse1 = [{ id: 1 }];
    const mockResponse2 = [{ id: 2 }];

    const apiFn1 = jest.fn(() => mockResponse1);
    const apiFn2 = jest.fn(() => mockResponse2);
    const successCallback1 = jest.fn();
    const successCallback2 = jest.fn();
    const failureCallback1 = jest.fn();
    const failureCallback2 = jest.fn();
    const params1: ApiCacheBoxParams = {
      url: "https://api.sample.dev/search?size=36&page=1",
      successCallback: successCallback1,
      failureCallback: failureCallback1,
      apiFn: apiFn1,
    };
    const params2: ApiCacheBoxParams = {
      url: "https://api.sample.dev/search?size=36&page=2",
      successCallback: successCallback2,
      failureCallback: failureCallback2,
      apiFn: apiFn2,
    };

    const results1 = await apiCacheBox(params1);
    expect(apiFn1).toHaveBeenCalledTimes(1);

    const cacheObj = { "size=36&page=1": mockResponse1 };
    expect(results1).toEqual(cacheObj);
    expect(successCallback1).toHaveBeenCalledTimes(1);
    expect(successCallback1).toHaveBeenCalledWith(mockResponse1);
    expect(failureCallback1).toHaveBeenCalledTimes(0);

    // second request
    const results2 = await apiCacheBox(params2);
    expect(apiFn1).toHaveBeenCalledTimes(1);
    expect(apiFn2).toHaveBeenCalledTimes(1);

    expect(results2).toEqual({ ...cacheObj, "size=36&page=2": mockResponse2 });

    expect(successCallback1).toHaveBeenCalledTimes(1);
    expect(successCallback1).toHaveBeenCalledWith(mockResponse1);
    expect(failureCallback1).toHaveBeenCalledTimes(0);

    expect(successCallback2).toHaveBeenCalledTimes(1);
    expect(successCallback2).toHaveBeenCalledWith(mockResponse2);
    expect(failureCallback2).toHaveBeenCalledTimes(0);
  });

  test("failure: calls failure callback and returns current cache", async () => {
    const successCallback1 = jest.fn();
    const failureCallback1 = jest.fn();
    const mockError = new Error();
    const apiFn = jest.fn().mockImplementation(() => {
      throw mockError;
    });
    const params1: ApiCacheBoxParams = {
      url: "https://api.sample.dev/search?size=36&page=1",
      successCallback: successCallback1,
      failureCallback: failureCallback1,
      apiFn,
    };
    const res = await apiCacheBox(params1);
    expect(apiFn).toHaveBeenCalledTimes(1);

    expect(successCallback1).toHaveBeenCalledTimes(0);
    expect(failureCallback1).toHaveBeenCalledTimes(1);
    expect(failureCallback1).toHaveBeenCalledWith(mockError);
    expect(res).toEqual({});
  });
});
