import { apiCacheBox, bustApiCacheObject } from "../main";
import { ApiCacheBoxParams } from "../ApiCacheBox";

describe("ApiCacheBox", () => {
  afterEach(() => {
    bustApiCacheObject();
  });
  test("success: given a url it calls success callbacks and returns cache data object", async (done) => {
    const mockResponse1 = "some data 1";
    const mockResponse2 = "some data 2";
    const successCallback1 = jest.fn();
    const successCallback2 = jest.fn();
    const failureCallback1 = jest.fn();
    const failureCallback2 = jest.fn();
    const params1: ApiCacheBoxParams = {
      url: "https://api.sample.dev/search?size=36&page=1",
      apiFn: jest.fn(() => mockResponse1),
      successCallback: successCallback1,
      failureCallback: failureCallback1,
    };
    const params2: ApiCacheBoxParams = {
      url: "https://api.sample.dev/search?size=36&page=2",
      apiFn: jest.fn(() => mockResponse2),
      successCallback: successCallback2,
      failureCallback: failureCallback2,
    };

    const results1 = await apiCacheBox(params1);
    const cacheObj = { "size=36&page=1": mockResponse1 };
    expect(results1).toEqual(cacheObj);
    expect(successCallback1).toHaveBeenCalledTimes(1);
    expect(successCallback1).toHaveBeenCalledWith(mockResponse1);
    expect(failureCallback1).toHaveBeenCalledTimes(0);

    // second request
    const results2 = await apiCacheBox(params2);
    expect(results2).toEqual({ ...cacheObj, "size=36&page=2": mockResponse2 });

    expect(successCallback1).toHaveBeenCalledTimes(1);
    expect(successCallback1).toHaveBeenCalledWith(mockResponse1);
    expect(failureCallback1).toHaveBeenCalledTimes(0);

    expect(successCallback2).toHaveBeenCalledTimes(1);
    expect(successCallback2).toHaveBeenCalledWith(mockResponse2);
    expect(failureCallback2).toHaveBeenCalledTimes(0);
    done();
  });

  test("failure: calls failure callback and returns current cache", async () => {
    const mockResponse1 = "some data 1";
    const successCallback1 = jest.fn();
    const failureCallback1 = jest.fn();
    const mockError = new Error();
    const apiError = jest.fn().mockImplementation(() => {
      throw mockError;
    });
    const params1: ApiCacheBoxParams = {
      url: "https://api.sample.dev/search?size=36&page=1",
      apiFn: apiError,
      successCallback: successCallback1,
      failureCallback: failureCallback1,
    };
    const res = await apiCacheBox(params1);
    expect(failureCallback1).toHaveBeenCalledTimes(1);
    expect(failureCallback1).toHaveBeenCalledWith(mockError);
    expect(res).toEqual({});
  });
});
