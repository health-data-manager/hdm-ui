import * as types from './types';
import axios from 'axios';

// ------------------------- LOAD PROVIDERS -------------------------------- //

function requestProviders() {
  return {
    type: types.PROVIDERS_REQUEST
  };
}

function loadProvidersSuccess(providers) {
  return {
    type: types.LOAD_PROVIDERS_SUCCESS,
    providers
  };
}

function loadProvidersFailure(error) {
  return {
    type: types.LOAD_PROVIDERS_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}


function sendProvidersRequest(accessToken) {
  return new Promise((resolve, reject) => {
    axios.get(
      `/api/v1/providers`,
      { headers: { 'X-Key-Inflection': 'camel', Accept: 'application/json', Authorization: `Bearer ${accessToken}` } }
    )
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}


export function loadProviders() {
  return (dispatch, getState) => {
    const accessToken = getState().auth.accessToken;

    dispatch(requestProviders());

    return sendProvidersRequest(accessToken)
      .then(data => dispatch(loadProvidersSuccess(data)))
      .catch(error => dispatch(loadProvidersFailure(error)));
  };
}

// ------------------------- LOAD PROFILE PROVIDERS ------------------------ //

function requestProfileProviders() {
  return {
    type: types.PROFILE_PROVIDERS_REQUEST
  };
}

function loadProfileProvidersSuccess(profileProviders) {
  return {
    type: types.LOAD_PROFILE_PROVIDERS_SUCCESS,
    profileProviders
  };
}

function loadProfileProvidersFailure(error) {
  return {
    type: types.LOAD_PROFILE_PROVIDERS_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendProfileProvidersRequest(profileId, accessToken) {
  return new Promise((resolve, reject) => {
    axios.get(
      `/api/v1/profiles/${profileId}/providers`,
      { headers: { 'X-Key-Inflection': 'camel', Accept: 'application/json', Authorization: `Bearer ${accessToken}` } }
    )
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function loadProfileProviders(profileId) {
  return (dispatch, getState) => {
    const accessToken = getState().auth.accessToken;

    dispatch(requestProfileProviders());

    return sendProfileProvidersRequest(profileId, accessToken)
      .then(data => dispatch(loadProfileProvidersSuccess(data)))
      .catch(error => dispatch(loadProfileProvidersFailure(error)));
  };
}

// ------------------------- DELETE PROFILE PROVIDER ----------------------- //

export function deleteProfileProvider(profileProviderId) {
  return {
    type: types.DELETE_PROFILE_PROVIDER,
    profileProviderId
  };
}

// ------------------------- LINK PROVIDER --------------------------------- //

function requestLinkProviders() {
  return {
    type: types.LINK_PROVIDER_REQUEST
  };
}

function linkProviderSuccess(redirectUri) {
  return {
    type: types.LINK_PROVIDER_SUCCESS,
    redirectUri
  };
}

function linkProviderFailure(error) {
  return {
    type: types.LINK_PROVIDER_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendLinkProviderRequest(providerId, profileId, accessToken) {
  return new Promise((resolve, reject) => {
    const redirectUri = `${window.location.protocol}//${window.location.host}/oauth`;
    const data = { provider_id: providerId, redirect_uri: redirectUri };

    axios.post(
      `/api/v1/profiles/${profileId}/providers`,
      data,
      { headers: { 'X-Key-Inflection': 'camel', Accept: 'application/json', Authorization: `Bearer ${accessToken}` } }
    )
      .then(result => resolve(result.data.redirect_uri))
      .catch(error => reject(error));
  });
}

export function linkProvider(providerId, profileId) {
  return (dispatch, getState) => {
    const accessToken = getState().auth.accessToken;

    dispatch(requestLinkProviders());

    return sendLinkProviderRequest(providerId, profileId, accessToken)
      .then(uri => dispatch(linkProviderSuccess(uri)))
      .catch(error => dispatch(linkProviderFailure(error)));
  };
}

// ------------------------- OAUTH CALLBACK -------------------------------- //

function requestOauthCallback() {
  return {
    type: types.OAUTH_CALLBACK_REQUEST
  };
}

function oauthCallbackSuccess(data) {
  return {
    profileProvider: data,
    type: types.OAUTH_CALLBACK_SUCCESS,
  };
}

function oauthCallbackFailure(error) {
  return {
    type: types.OAUTH_CALLBACK_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendOauthCallbackRequest(state, code) {
  const redirectUri = `${window.location.protocol}//${window.location.host}/oauth`;
  return new Promise((resolve, reject) => {
    axios.get(
      `/oauth/callback?state=${state}&code=${code}&redirect_uri=${redirectUri}`,
      { headers: { 'X-Key-Inflection': 'camel', Accept: 'application/json' } }
    )
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function oauthCallback(state, code) {
  return (dispatch) => {
    dispatch(requestOauthCallback());

    return sendOauthCallbackRequest(state, code)
      .then(result => dispatch(oauthCallbackSuccess(result)))
      .catch(error => dispatch(oauthCallbackFailure(error)));
  };
}
