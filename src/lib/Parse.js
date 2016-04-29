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
   * ### runCloudFunction
   * Run cloud function named `name`
   *
   * @param name the name of the cloud function
   * @param data object: {}
   */
  runCloudFunction(name, data) {
    return this._fetch({ method: 'POST', url: '/functions/' + name, body: data })
      .then(this._handleResponse)
      .then(json => json.result)
  }
  /**
   * ### createObject
   * Create Parse Object
   *
   * @param className the class of the object
   * @param data object: {}
   */
  createObject(className, data) {
    return this._fetch({ method: 'POST', url: '/classes/' + className, body: data })
      .then(this._handleResponse)
      .then(json => json.result)
  }
    /**
   * ### updateObject
   * Update Parse Object
   *
   * @param className the class of the object
   * @param parseId the id of the object on parse
   * @param data object: {}
   */
  updateObject(className, parseId, data) {
    return this._fetch({ method: 'PUT', url: '/classes/' + className + '/' + parseId, body: data })
      .then(this._handleResponse)
      .then(json => json.result)
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
        'X-Parse-Application-Id': this._applicationId,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    if (this._sessionToken) {
      reqOpts.headers['X-Parse-Session-Token'] = this._sessionToken;
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
    return response.json()
      .then(json => {
        console.log('Parse response', json)
        if (json.error) {
          throw new Error(json.error)
        }
        console.log('JSON');
        console.log(json);
        return json
      })
  }
}