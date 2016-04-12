/**
 * # Parse.js
 * 
 * This class interfaces with Parse.com using the rest api
 * see [https://parse.com/docs/rest/guide](https://parse.com/docs/rest/guide)
 *
 */

import {
  PARSE_APP_ID,
  PARSE_BASE_URL
} from './config'

import _ from 'lodash'

export default class Parse {
  /**
   * ## Parse
   *
   * constructor sets the default keys required by Parse.com
   * if a user is logged in, we'll need the sessionToken
   *
   * @throws tokenMissing if token is undefined
   */
  constructor(sessionToken) {
    this._sessionToken = sessionToken
    this.API_BASE_URL= PARSE_BASE_URL
    this._applicationId = PARSE_APP_ID
    this._restAPIKey = null
    this._masterKey = null
  }

  /**
   * ### signup
   *
   * @param data object
   *
   * {username: "barton", email: "foo@gmail.com", password: "Passw0rd!"}
   *
   * @return
   * if ok, {createdAt: "2015-12-30T15:17:05.379Z",
   *   objectId: "5TgExo2wBA", 
   *   sessionToken: "r:dEgdUkcs2ydMV9Y9mt8HcBrDM"}
   *
   * if error, {code: xxx, error: 'message'}
   */
  signup(data) {
    return this._fetch({ method: 'POST', url: '/users', body: data })
      .then(this._handleResponse)
  }
  /**
   * ### login
   * encode the data and and call _fetch
   *
   * @param data
   *
   *  {username: "barton", password: "Passw0rd!"}
   *
   * @returns
   *
   * createdAt: "2015-12-30T15:29:36.611Z"
   * email: "barton@foo.com"
   * objectId: "Z4yvP19OeL"
   * sessionToken: "r:Kt9wXIBWD0dNijNIq2u5rRllW"
   * updatedAt: "2015-12-30T16:08:50.419Z"
   * username: "barton"
   *
   */
  login(data) {
    var formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    return this._fetch({ method: 'GET', url: '/login?' + formBody })
      .then(this._handleResponse)

  }
  /**
   * ### logout
   * prepare the request and call _fetch
   */  
  logout() {
    return this._fetch({ method: 'POST', url: '/logout', body: {} })
      .then((response) => {
        var  res = JSON.parse(response._bodyInit);        
        if ((response.status === 200 || response.status === 201)
            || //invalid session token
            (response.status === 400 && res.code === 209)) {
          return {};
        } else {
          throw({code: 404, error: 'unknown error from Parse.com'});
        }
      })

  }
  /**
   * ### getProfile
   * Using the sessionToken, we'll get everything about
   * the current user.
   *
   * @returns
   *
   * if good:
   * {createdAt: "2015-12-30T15:29:36.611Z"
   *  email: "barton@acclivyx.com"
   *  objectId: "Z4yvP19OeL"
   *  sessionToken: "r:uFeYONgIsZMPyxOWVJ6VqJGqv"
   *  updatedAt: "2015-12-30T15:29:36.611Z"
   *  username: "barton"}
   *
   * if error, {code: xxx, error: 'message'}
   */
  getProfile() {
    return this._fetch({ method: 'GET', url: '/users/me' })
      .then(this._handleResponse)
  }
  /**
   * ### updateProfile
   * for this user, update their record
   * the data is already in JSON format
   *
   * @param userId  _id of Parse.com
   * @param data object:
   * {username: "barton", email: "barton@foo.com"}
   */
  updateProfile(userId,data) {
    return this._fetch({ method: 'PUT', url: '/users/' + userId, body: data })
      .then(this._handleResponse)
  }  
  /**
   * ### _fetch
   * A generic function that prepares the request to Parse.com
   */  
  _fetch(opts) {

    opts = _.extend({
      method: 'GET',
      url: null,
      body: null,
      callback: null
    }, opts);

    var reqOpts = {
      method: opts.method,
      headers: {
        'X-Parse-Application-Id': this._applicationId
      }
    }

    if (this._restAPIKey) {
      reqOpts.headers['X-Parse-REST-API-Key'] = this._restAPIKey
    }
    if (this._sessionToken) {
      reqOpts.headers['X-Parse-Session-Token'] = this._sessionToken;
    }
    if (this._masterKey) {
      reqOpts.headers['X-Parse-Master-Key'] = this.masterKey;
    }
    if (opts.method === 'POST' || opts.method === 'PUT') {
      reqOpts.headers['Accept'] = 'application/json';
      reqOpts.headers['Content-Type'] = 'application/json';
    }
    if (opts.body) {
      reqOpts.body = JSON.stringify(opts.body);
    }

    return fetch(this.API_BASE_URL + opts.url, reqOpts);
  }

  /**
   * ### _fetch
   * A generic function that handles the response
   */  
  _handleResponse(response) {
    var json = response._bodyInit ? JSON.parse(response._bodyInit) : {};
    if (response.status === 200 || response.status === 201) {
      return json;
    } else {
      throw(json);
    }
  }
}
