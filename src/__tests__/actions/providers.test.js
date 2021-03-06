import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import * as actions from '../../actions/providers';
import * as types from '../../actions/types';

const mockProviderA = { id: 1, name: "Provider A" };
const mockProviderB = { id: 2, name: "Provider B" };
const mockProfile = { id: 3, name: "Profile A" };

const mockProfileProviderA = { id: 1, profile_id: 3, provider_id: 1 };
const mockProfileProviderB = { id: 2, profile_id: 3, provider_id: 2 };

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('providers actions', () => {
  // ----------------------- LOAD PROVIDERS -------------------------------- //
  describe('should handle loading providers', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('should create LOAD_PROVIDERS_SUCCESS after successfully loading providers', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200, response: [mockProviderA, mockProviderB] });
      });

      const store = mockStore({ providers: [], auth: { accessToken: 'abc' } });
      const expectedActions = [
        { type: types.PROVIDERS_REQUEST },
        { type: types.LOAD_PROVIDERS_SUCCESS, providers: [mockProviderA, mockProviderB] }
      ];

      return store.dispatch(actions.loadProviders()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- LOAD PROFILE PROVIDERS ------------------------ //
  describe('should handle loading profile providers', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('should create LOAD_PROFILE_PROVIDERS_SUCCESS after successfully loading providers', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200, response: [mockProfileProviderA, mockProfileProviderB] });
      });

      const store = mockStore({ providers: [mockProviderA, mockProviderB], auth: { accessToken: 'abc' } });
      const expectedActions = [
        { type: types.PROFILE_PROVIDERS_REQUEST },
        { type: types.LOAD_PROFILE_PROVIDERS_SUCCESS, profileProviders: [mockProfileProviderA, mockProfileProviderB] }
      ];

      return store.dispatch(actions.loadProfileProviders(1)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- LINK PROVIDER --------------------------------- //
  describe('should handle linking a provider', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('should create LINK_PROVIDER_SUCCESS after successfully linking a provider', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200, response: { redirect_uri: 'http://localhost:8000/oauth' } });
      });

      const store = mockStore({
        profiles: [mockProfile],
        providers: [mockProviderA],
        auth: { accessToken: 'abc' }
      });

      const expectedActions = [
        { type: types.LINK_PROVIDER_REQUEST },
        { type: types.LINK_PROVIDER_SUCCESS, redirectUri: 'http://localhost:8000/oauth' }
      ];

      return store.dispatch(actions.linkProvider(mockProviderA.id, mockProfile.id)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  // ----------------------- OAUTH CALLBACK --------------------------------- //
  describe('should handle an oauth callback', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('should create OAUTH_CALLBACK_SUCCESS after successfully handling an oauth callback', () => {
      const profileProvider = { id: 1234, profile_id: mockProfile.id, provider_id: mockProviderA.id };
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200, response: profileProvider });
      });

      const store = mockStore({
        profiles: [mockProfile],
        providers: [mockProviderA],
        auth: { accessToken: 'abc' }
      });

      const expectedActions = [
        { type: types.OAUTH_CALLBACK_REQUEST },
        { type: types.OAUTH_CALLBACK_SUCCESS, profileProvider: profileProvider }
      ];

      return store.dispatch(actions.oauthCallback('abc', '123')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
