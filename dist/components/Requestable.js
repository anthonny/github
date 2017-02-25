'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _jsBase = require('js-base64');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @copyright  2016 Yahoo Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license    Licensed under {@link https://spdx.org/licenses/BSD-3-Clause-Clear.html BSD-3-Clause-Clear}.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *             Github.js is freely distributable.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var log = (0, _debug2.default)('github:request');

/**
 * The error structure returned when a network call fails
 */

var ResponseError = function (_Error) {
   _inherits(ResponseError, _Error);

   /**
    * Construct a new ResponseError
    * @param {string} message - an message to return instead of the the default error message
    * @param {string} path - the requested path
    * @param {Object} response - the object returned by Axios
    */
   function ResponseError(message, path, response) {
      _classCallCheck(this, ResponseError);

      var _this = _possibleConstructorReturn(this, (ResponseError.__proto__ || Object.getPrototypeOf(ResponseError)).call(this, message));

      _this.path = path;
      _this.request = response.config;
      _this.response = (response || {}).response || response;
      _this.status = response.status;
      return _this;
   }

   return ResponseError;
}(Error);

/**
 * Requestable wraps the logic for making http requests to the API
 */


var Requestable = function () {
   /**
    * Either a username and password or an oauth token for Github
    * @typedef {Object} Requestable.auth
    * @prop {string} [username] - the Github username
    * @prop {string} [password] - the user's password
    * @prop {token} [token] - an OAuth token
    */
   /**
    * Initialize the http internals.
    * @param {Requestable.auth} [auth] - the credentials to authenticate to Github. If auth is
    *                                  not provided request will be made unauthenticated
    * @param {string} [apiBase=https://api.github.com] - the base Github API URL
    * @param {string} [AcceptHeader=v3] - the accept header for the requests
    */
   function Requestable(auth, apiBase, AcceptHeader) {
      _classCallCheck(this, Requestable);

      this.__apiBase = apiBase || 'https://api.github.com';
      this.__auth = {
         token: auth.token,
         username: auth.username,
         password: auth.password
      };
      this.__AcceptHeader = AcceptHeader || 'v3';

      if (auth.token) {
         this.__authorizationHeader = 'token ' + auth.token;
      } else if (auth.username && auth.password) {
         this.__authorizationHeader = 'Basic ' + _jsBase.Base64.encode(auth.username + ':' + auth.password);
      }

      // Support 2FA code
      if (auth.twoFactorCode) {
         this.__otpHeader = auth.twoFactorCode;
      }
   }

   /**
    * Compute the URL to use to make a request.
    * @private
    * @param {string} path - either a URL relative to the API base or an absolute URL
    * @return {string} - the URL to use
    */


   _createClass(Requestable, [{
      key: '__getURL',
      value: function __getURL(path) {
         var url = path;

         if (path.indexOf('//') === -1) {
            url = this.__apiBase + path;
         }

         var newCacheBuster = 'timestamp=' + new Date().getTime();
         return url.replace(/(timestamp=\d+)/, newCacheBuster);
      }

      /**
       * Compute the headers required for an API request.
       * @private
       * @param {boolean} raw - if the request should be treated as JSON or as a raw request
       * @param {string} AcceptHeader - the accept header for the request
       * @return {Object} - the headers to use in the request
       */

   }, {
      key: '__getRequestHeaders',
      value: function __getRequestHeaders(raw, AcceptHeader) {
         var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/vnd.github.' + (AcceptHeader || this.__AcceptHeader)
         };

         if (raw) {
            headers.Accept += '.raw';
         }
         headers.Accept += '+json';

         if (this.__authorizationHeader) {
            headers.Authorization = this.__authorizationHeader;
         }

         if (this.__otpHeader) {
            headers['X-GitHub-OTP'] = this.__otpHeader;
         }

         return headers;
      }

      /**
       * Sets the default options for API requests
       * @protected
       * @param {Object} [requestOptions={}] - the current options for the request
       * @return {Object} - the options to pass to the request
       */

   }, {
      key: '_getOptionsWithDefaults',
      value: function _getOptionsWithDefaults() {
         var requestOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

         if (!(requestOptions.visibility || requestOptions.affiliation)) {
            requestOptions.type = requestOptions.type || 'all';
         }
         requestOptions.sort = requestOptions.sort || 'updated';
         requestOptions.per_page = requestOptions.per_page || '100'; // eslint-disable-line

         return requestOptions;
      }

      /**
       * if a `Date` is passed to this function it will be converted to an ISO string
       * @param {*} date - the object to attempt to cooerce into an ISO date string
       * @return {string} - the ISO representation of `date` or whatever was passed in if it was not a date
       */

   }, {
      key: '_dateToISO',
      value: function _dateToISO(date) {
         if (date && date instanceof Date) {
            date = date.toISOString();
         }

         return date;
      }

      /**
       * A function that receives the result of the API request.
       * @callback Requestable.callback
       * @param {Requestable.Error} error - the error returned by the API or `null`
       * @param {(Object|true)} result - the data returned by the API or `true` if the API returns `204 No Content`
       * @param {Object} request - the raw {@linkcode https://github.com/mzabriskie/axios#response-schema Response}
       */
      /**
       * Make a request.
       * @param {string} method - the method for the request (GET, PUT, POST, DELETE)
       * @param {string} path - the path for the request
       * @param {*} [data] - the data to send to the server. For HTTP methods that don't have a body the data
       *                   will be sent as query parameters
       * @param {Requestable.callback} [cb] - the callback for the request
       * @param {boolean} [raw=false] - if the request should be sent as raw. If this is a falsy value then the
       *                              request will be made as JSON
       * @return {Promise} - the Promise for the http request
       */

   }, {
      key: '_request',
      value: function _request(method, path, data, cb, raw) {
         var url = this.__getURL(path);

         var AcceptHeader = (data || {}).AcceptHeader;
         if (AcceptHeader) {
            delete data.AcceptHeader;
         }
         var headers = this.__getRequestHeaders(raw, AcceptHeader);

         var queryParams = {};

         var shouldUseDataAsParams = data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && methodHasNoBody(method);
         if (shouldUseDataAsParams) {
            queryParams = data;
            data = undefined;
         }

         var config = {
            url: url,
            method: method,
            headers: headers,
            params: queryParams,
            data: data,
            responseType: raw ? 'text' : 'json'
         };

         log(config.method + ' to ' + config.url);
         var requestPromise = (0, _axios2.default)(config).catch(callbackErrorOrThrow(cb, path));

         if (cb) {
            requestPromise.then(function (response) {
               // with 401 result, response is undefined
               if (!response) {
                  cb(null, true, null);
               } else if (response.data && Object.keys(response.data).length > 0) {
                  // When data has results
                  cb(null, response.data, response);
               } else if (config.method !== 'GET' && response.data && Object.keys(response.data).length < 1) {
                  // True when successful submit a request and receive a empty object
                  cb(null, response.status < 300, response);
               } else {
                  cb(null, response.data, response);
               }
            });
         }

         return requestPromise;
      }

      /**
       * Make a request to an endpoint the returns 204 when true and 404 when false
       * @param {string} path - the path to request
       * @param {Object} data - any query parameters for the request
       * @param {Requestable.callback} cb - the callback that will receive `true` or `false`
       * @param {method} [method=GET] - HTTP Method to use
       * @return {Promise} - the promise for the http request
       */

   }, {
      key: '_request204or404',
      value: function _request204or404(path, data, cb) {
         var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'GET';

         return this._request(method, path, data).then(function success(response) {
            if (cb) {
               cb(null, true, response);
            }
            return true;
         }, function failure(response) {
            if (response.response.status === 404) {
               if (cb) {
                  cb(null, false, response);
               }
               return false;
            }

            if (cb) {
               cb(response);
            }
            throw response;
         });
      }

      /**
       * Make a request and fetch all the available data. Github will paginate responses so for queries
       * that might span multiple pages this method is preferred to {@link Requestable#request}
       * @param {string} path - the path to request
       * @param {Object} options - the query parameters to include
       * @param {Requestable.callback} [cb] - the function to receive the data. The returned data will always be an array.
       * @param {Object[]} results - the partial results. This argument is intended for interal use only.
       * @return {Promise} - a promise which will resolve when all pages have been fetched
       * @deprecated This will be folded into {@link Requestable#_request} in the 2.0 release.
       */

   }, {
      key: '_requestAllPages',
      value: function _requestAllPages(path, options, cb, results) {
         var _this2 = this;

         results = results || [];

         return this._request('GET', path, options).then(function (response) {
            var _results;

            var thisGroup = void 0;
            if (response.data instanceof Array) {
               thisGroup = response.data;
            } else if (response.data.items instanceof Array) {
               thisGroup = response.data.items;
            } else {
               var message = 'cannot figure out how to append ' + response.data + ' to the result set';
               throw new ResponseError(message, path, response);
            }
            (_results = results).push.apply(_results, _toConsumableArray(thisGroup));

            var nextUrl = getNextPage(response.headers.link);
            if (nextUrl && typeof options.page !== 'number') {
               log('getting next page: ' + nextUrl);
               return _this2._requestAllPages(nextUrl, options, cb, results);
            }

            if (cb) {
               cb(null, results, response);
            }

            response.data = results;
            return response;
         }).catch(callbackErrorOrThrow(cb, path));
      }
   }]);

   return Requestable;
}();

module.exports = Requestable;

// ////////////////////////// //
//  Private helper functions  //
// ////////////////////////// //
var METHODS_WITH_NO_BODY = ['GET', 'HEAD', 'DELETE'];
function methodHasNoBody(method) {
   return METHODS_WITH_NO_BODY.indexOf(method) !== -1;
}

function getNextPage() {
   var linksHeader = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

   var links = linksHeader.split(/\s*,\s*/); // splits and strips the urls
   return links.reduce(function (nextUrl, link) {
      if (link.search(/rel="next"/) !== -1) {
         return (link.match(/<(.*)>/) || [])[1];
      }

      return nextUrl;
   }, undefined);
}

function callbackErrorOrThrow(cb, path) {
   return function handler(object) {
      var error = void 0;
      if (object.hasOwnProperty('config')) {
         var _object$response = object.response,
             status = _object$response.status,
             statusText = _object$response.statusText,
             _object$config = object.config,
             method = _object$config.method,
             url = _object$config.url;

         var message = status + ' error making request ' + method + ' ' + url + ': "' + statusText + '"';
         error = new ResponseError(message, path, object);
         log(message + ' ' + JSON.stringify(object.data));
      } else {
         error = object;
      }
      if (cb) {
         log('going to error callback');
         cb(error);
      } else {
         log('throwing error');
         throw error;
      }
   };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlcXVlc3RhYmxlLmpzIl0sIm5hbWVzIjpbImxvZyIsIlJlc3BvbnNlRXJyb3IiLCJtZXNzYWdlIiwicGF0aCIsInJlc3BvbnNlIiwicmVxdWVzdCIsImNvbmZpZyIsInN0YXR1cyIsIkVycm9yIiwiUmVxdWVzdGFibGUiLCJhdXRoIiwiYXBpQmFzZSIsIkFjY2VwdEhlYWRlciIsIl9fYXBpQmFzZSIsIl9fYXV0aCIsInRva2VuIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsIl9fQWNjZXB0SGVhZGVyIiwiX19hdXRob3JpemF0aW9uSGVhZGVyIiwiZW5jb2RlIiwidHdvRmFjdG9yQ29kZSIsIl9fb3RwSGVhZGVyIiwidXJsIiwiaW5kZXhPZiIsIm5ld0NhY2hlQnVzdGVyIiwiRGF0ZSIsImdldFRpbWUiLCJyZXBsYWNlIiwicmF3IiwiaGVhZGVycyIsIkFjY2VwdCIsIkF1dGhvcml6YXRpb24iLCJyZXF1ZXN0T3B0aW9ucyIsInZpc2liaWxpdHkiLCJhZmZpbGlhdGlvbiIsInR5cGUiLCJzb3J0IiwicGVyX3BhZ2UiLCJkYXRlIiwidG9JU09TdHJpbmciLCJtZXRob2QiLCJkYXRhIiwiY2IiLCJfX2dldFVSTCIsIl9fZ2V0UmVxdWVzdEhlYWRlcnMiLCJxdWVyeVBhcmFtcyIsInNob3VsZFVzZURhdGFBc1BhcmFtcyIsIm1ldGhvZEhhc05vQm9keSIsInVuZGVmaW5lZCIsInBhcmFtcyIsInJlc3BvbnNlVHlwZSIsInJlcXVlc3RQcm9taXNlIiwiY2F0Y2giLCJjYWxsYmFja0Vycm9yT3JUaHJvdyIsInRoZW4iLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiX3JlcXVlc3QiLCJzdWNjZXNzIiwiZmFpbHVyZSIsIm9wdGlvbnMiLCJyZXN1bHRzIiwidGhpc0dyb3VwIiwiQXJyYXkiLCJpdGVtcyIsInB1c2giLCJuZXh0VXJsIiwiZ2V0TmV4dFBhZ2UiLCJsaW5rIiwicGFnZSIsIl9yZXF1ZXN0QWxsUGFnZXMiLCJtb2R1bGUiLCJleHBvcnRzIiwiTUVUSE9EU19XSVRIX05PX0JPRFkiLCJsaW5rc0hlYWRlciIsImxpbmtzIiwic3BsaXQiLCJyZWR1Y2UiLCJzZWFyY2giLCJtYXRjaCIsImhhbmRsZXIiLCJvYmplY3QiLCJlcnJvciIsImhhc093blByb3BlcnR5Iiwic3RhdHVzVGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQU9BOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OzsrZUFUQTs7Ozs7OztBQVdBLElBQU1BLE1BQU0scUJBQU0sZ0JBQU4sQ0FBWjs7QUFFQTs7OztJQUdNQyxhOzs7QUFDSDs7Ozs7O0FBTUEsMEJBQVlDLE9BQVosRUFBcUJDLElBQXJCLEVBQTJCQyxRQUEzQixFQUFxQztBQUFBOztBQUFBLGdJQUM1QkYsT0FENEI7O0FBRWxDLFlBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFlBQUtFLE9BQUwsR0FBZUQsU0FBU0UsTUFBeEI7QUFDQSxZQUFLRixRQUFMLEdBQWdCLENBQUNBLFlBQVksRUFBYixFQUFpQkEsUUFBakIsSUFBNkJBLFFBQTdDO0FBQ0EsWUFBS0csTUFBTCxHQUFjSCxTQUFTRyxNQUF2QjtBQUxrQztBQU1wQzs7O0VBYndCQyxLOztBQWdCNUI7Ozs7O0lBR01DLFc7QUFDSDs7Ozs7OztBQU9BOzs7Ozs7O0FBT0Esd0JBQVlDLElBQVosRUFBa0JDLE9BQWxCLEVBQTJCQyxZQUEzQixFQUF5QztBQUFBOztBQUN0QyxXQUFLQyxTQUFMLEdBQWlCRixXQUFXLHdCQUE1QjtBQUNBLFdBQUtHLE1BQUwsR0FBYztBQUNYQyxnQkFBT0wsS0FBS0ssS0FERDtBQUVYQyxtQkFBVU4sS0FBS00sUUFGSjtBQUdYQyxtQkFBVVAsS0FBS087QUFISixPQUFkO0FBS0EsV0FBS0MsY0FBTCxHQUFzQk4sZ0JBQWdCLElBQXRDOztBQUVBLFVBQUlGLEtBQUtLLEtBQVQsRUFBZ0I7QUFDYixjQUFLSSxxQkFBTCxHQUE2QixXQUFXVCxLQUFLSyxLQUE3QztBQUNGLE9BRkQsTUFFTyxJQUFJTCxLQUFLTSxRQUFMLElB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QUFDSCxJQWpCRDtBQWtCRiIsImZpbGUiOiJSZXF1ZXN0YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIEBjb3B5cmlnaHQgIDIwMTYgWWFob28gSW5jLlxuICogQGxpY2Vuc2UgICAgTGljZW5zZWQgdW5kZXIge0BsaW5rIGh0dHBzOi8vc3BkeC5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlLUNsZWFyLmh0bWwgQlNELTMtQ2xhdXNlLUNsZWFyfS5cbiAqICAgICAgICAgICAgIEdpdGh1Yi5qcyBpcyBmcmVlbHkgZGlzdHJpYnV0YWJsZS5cbiAqL1xuXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCB7QmFzZTY0fSBmcm9tICdqcy1iYXNlNjQnO1xuXG5jb25zdCBsb2cgPSBkZWJ1ZygnZ2l0aHViOnJlcXVlc3QnKTtcblxuLyoqXG4gKiBUaGUgZXJyb3Igc3RydWN0dXJlIHJldHVybmVkIHdoZW4gYSBuZXR3b3JrIGNhbGwgZmFpbHNcbiAqL1xuY2xhc3MgUmVzcG9uc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgIC8qKlxuICAgICogQ29uc3RydWN0IGEgbmV3IFJlc3BvbnNlRXJyb3JcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gYW4gbWVzc2FnZSB0byByZXR1cm4gaW5zdGVhZCBvZiB0aGUgdGhlIGRlZmF1bHQgZXJyb3IgbWVzc2FnZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcmVxdWVzdGVkIHBhdGhcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSAtIHRoZSBvYmplY3QgcmV0dXJuZWQgYnkgQXhpb3NcbiAgICAqL1xuICAgY29uc3RydWN0b3IobWVzc2FnZSwgcGF0aCwgcmVzcG9uc2UpIHtcbiAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgIHRoaXMucmVxdWVzdCA9IHJlc3BvbnNlLmNvbmZpZztcbiAgICAgIHRoaXMucmVzcG9uc2UgPSAocmVzcG9uc2UgfHwge30pLnJlc3BvbnNlIHx8IHJlc3BvbnNlO1xuICAgICAgdGhpcy5zdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XG4gICB9XG59XG5cbi8qKlxuICogUmVxdWVzdGFibGUgd3JhcHMgdGhlIGxvZ2ljIGZvciBtYWtpbmcgaHR0cCByZXF1ZXN0cyB0byB0aGUgQVBJXG4gKi9cbmNsYXNzIFJlcXVlc3RhYmxlIHtcbiAgIC8qKlxuICAgICogRWl0aGVyIGEgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIG9yIGFuIG9hdXRoIHRva2VuIGZvciBHaXRodWJcbiAgICAqIEB0eXBlZGVmIHtPYmplY3R9IFJlcXVlc3RhYmxlLmF1dGhcbiAgICAqIEBwcm9wIHtzdHJpbmd9IFt1c2VybmFtZV0gLSB0aGUgR2l0aHViIHVzZXJuYW1lXG4gICAgKiBAcHJvcCB7c3RyaW5nfSBbcGFzc3dvcmRdIC0gdGhlIHVzZXIncyBwYXNzd29yZFxuICAgICogQHByb3Age3Rva2VufSBbdG9rZW5dIC0gYW4gT0F1dGggdG9rZW5cbiAgICAqL1xuICAgLyoqXG4gICAgKiBJbml0aWFsaXplIHRoZSBodHRwIGludGVybmFscy5cbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuYXV0aH0gW2F1dGhdIC0gdGhlIGNyZWRlbnRpYWxzIHRvIGF1dGhlbnRpY2F0ZSB0byBHaXRodWIuIElmIGF1dGggaXNcbiAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdCBwcm92aWRlZCByZXF1ZXN0IHdpbGwgYmUgbWFkZSB1bmF1dGhlbnRpY2F0ZWRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbYXBpQmFzZT1odHRwczovL2FwaS5naXRodWIuY29tXSAtIHRoZSBiYXNlIEdpdGh1YiBBUEkgVVJMXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW0FjY2VwdEhlYWRlcj12M10gLSB0aGUgYWNjZXB0IGhlYWRlciBmb3IgdGhlIHJlcXVlc3RzXG4gICAgKi9cbiAgIGNvbnN0cnVjdG9yKGF1dGgsIGFwaUJhc2UsIEFjY2VwdEhlYWRlcikge1xuICAgICAgdGhpcy5fX2FwaUJhc2UgPSBhcGlCYXNlIHx8ICdodHRwczovL2FwaS5naXRodWIuY29tJztcbiAgICAgIHRoaXMuX19hdXRoID0ge1xuICAgICAgICAgdG9rZW46IGF1dGgudG9rZW4sXG4gICAgICAgICB1c2VybmFtZTogYXV0aC51c2VybmFtZSxcbiAgICAgICAgIHBhc3N3b3JkOiBhdXRoLnBhc3N3b3JkLFxuICAgICAgfTtcbiAgICAgIHRoaXMuX19BY2NlcHRIZWFkZXIgPSBBY2NlcHRIZWFkZXIgfHwgJ3YzJztcblxuICAgICAgaWYgKGF1dGgudG9rZW4pIHtcbiAgICAgICAgIHRoaXMuX19hdXRob3JpemF0aW9uSGVhZGVyID0gJ3Rva2VuICcgKyBhdXRoLnRva2VuO1xuICAgICAgfSBlbHNlIGlmIChhdXRoLnVzZXJuYW1lICYmIGF1dGgucGFzc3dvcmQpIHtcbiAgICAgICAgIHRoaXMuX19hdXRob3JpemF0aW9uSGVhZGVyID0gJ0Jhc2ljICcgKyBCYXNlNjQuZW5jb2RlKGF1dGgudXNlcm5hbWUgKyAnOicgKyBhdXRoLnBhc3N3b3JkKTtcbiAgICAgIH1cblxuICAgICAgLy8gU3VwcG9ydCAyRkEgY29kZVxuICAgICAgaWYgKGF1dGgudHdvRmFjdG9yQ29kZSkge1xuICAgICAgICAgdGhpcy5fX290cEhlYWRlciA9IGF1dGgudHdvRmFjdG9yQ29kZTtcbiAgICAgIH1cbiAgIH1cblxuICAgLyoqXG4gICAgKiBDb21wdXRlIHRoZSBVUkwgdG8gdXNlIHRvIG1ha2UgYSByZXF1ZXN0LlxuICAgICogQHByaXZhdGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gZWl0aGVyIGEgVVJMIHJlbGF0aXZlIHRvIHRoZSBBUEkgYmFzZSBvciBhbiBhYnNvbHV0ZSBVUkxcbiAgICAqIEByZXR1cm4ge3N0cmluZ30gLSB0aGUgVVJMIHRvIHVzZVxuICAgICovXG4gICBfX2dldFVSTChwYXRoKSB7XG4gICAgICBsZXQgdXJsID0gcGF0aDtcblxuICAgICAgaWYgKHBhdGguaW5kZXhPZignLy8nKSA9PT0gLTEpIHtcbiAgICAgICAgIHVybCA9IHRoaXMuX19hcGlCYXNlICsgcGF0aDtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld0NhY2hlQnVzdGVyID0gJ3RpbWVzdGFtcD0nICsgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICByZXR1cm4gdXJsLnJlcGxhY2UoLyh0aW1lc3RhbXA9XFxkKykvLCBuZXdDYWNoZUJ1c3Rlcik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ29tcHV0ZSB0aGUgaGVhZGVycyByZXF1aXJlZCBmb3IgYW4gQVBJIHJlcXVlc3QuXG4gICAgKiBAcHJpdmF0ZVxuICAgICogQHBhcmFtIHtib29sZWFufSByYXcgLSBpZiB0aGUgcmVxdWVzdCBzaG91bGQgYmUgdHJlYXRlZCBhcyBKU09OIG9yIGFzIGEgcmF3IHJlcXVlc3RcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBBY2NlcHRIZWFkZXIgLSB0aGUgYWNjZXB0IGhlYWRlciBmb3IgdGhlIHJlcXVlc3RcbiAgICAqIEByZXR1cm4ge09iamVjdH0gLSB0aGUgaGVhZGVycyB0byB1c2UgaW4gdGhlIHJlcXVlc3RcbiAgICAqL1xuICAgX19nZXRSZXF1ZXN0SGVhZGVycyhyYXcsIEFjY2VwdEhlYWRlcikge1xuICAgICAgbGV0IGhlYWRlcnMgPSB7XG4gICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOCcsXG4gICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL3ZuZC5naXRodWIuJyArIChBY2NlcHRIZWFkZXIgfHwgdGhpcy5fX0FjY2VwdEhlYWRlciksXG4gICAgICB9O1xuXG4gICAgICBpZiAocmF3KSB7XG4gICAgICAgICBoZWFkZXJzLkFjY2VwdCArPSAnLnJhdyc7XG4gICAgICB9XG4gICAgICBoZWFkZXJzLkFjY2VwdCArPSAnK2pzb24nO1xuXG4gICAgICBpZiAodGhpcy5fX2F1dGhvcml6YXRpb25IZWFkZXIpIHtcbiAgICAgICAgIGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IHRoaXMuX19hdXRob3JpemF0aW9uSGVhZGVyO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fX290cEhlYWRlcikge1xuICAgICAgICAgaGVhZGVyc1snWC1HaXRIdWItT1RQJ10gPSB0aGlzLl9fb3RwSGVhZGVyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGVhZGVycztcbiAgIH1cblxuICAgLyoqXG4gICAgKiBTZXRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIEFQSSByZXF1ZXN0c1xuICAgICogQHByb3RlY3RlZFxuICAgICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0T3B0aW9ucz17fV0gLSB0aGUgY3VycmVudCBvcHRpb25zIGZvciB0aGUgcmVxdWVzdFxuICAgICogQHJldHVybiB7T2JqZWN0fSAtIHRoZSBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIHJlcXVlc3RcbiAgICAqL1xuICAgX2dldE9wdGlvbnNXaXRoRGVmYXVsdHMocmVxdWVzdE9wdGlvbnMgPSB7fSkge1xuICAgICAgaWYgKCEocmVxdWVzdE9wdGlvbnMudmlzaWJpbGl0eSB8fCByZXF1ZXN0T3B0aW9ucy5hZmZpbGlhdGlvbikpIHtcbiAgICAgICAgIHJlcXVlc3RPcHRpb25zLnR5cGUgPSByZXF1ZXN0T3B0aW9ucy50eXBlIHx8ICdhbGwnO1xuICAgICAgfVxuICAgICAgcmVxdWVzdE9wdGlvbnMuc29ydCA9IHJlcXVlc3RPcHRpb25zLnNvcnQgfHwgJ3VwZGF0ZWQnO1xuICAgICAgcmVxdWVzdE9wdGlvbnMucGVyX3BhZ2UgPSByZXF1ZXN0T3B0aW9ucy5wZXJfcGFnZSB8fCAnMTAwJzsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXG4gICAgICByZXR1cm4gcmVxdWVzdE9wdGlvbnM7XG4gICB9XG5cbiAgIC8qKlxuICAgICogaWYgYSBgRGF0ZWAgaXMgcGFzc2VkIHRvIHRoaXMgZnVuY3Rpb24gaXQgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gYW4gSVNPIHN0cmluZ1xuICAgICogQHBhcmFtIHsqfSBkYXRlIC0gdGhlIG9iamVjdCB0byBhdHRlbXB0IHRvIGNvb2VyY2UgaW50byBhbiBJU08gZGF0ZSBzdHJpbmdcbiAgICAqIEByZXR1cm4ge3N0cmluZ30gLSB0aGUgSVNPIHJlcHJlc2VudGF0aW9uIG9mIGBkYXRlYCBvciB3aGF0ZXZlciB3YXMgcGFzc2VkIGluIGlmIGl0IHdhcyBub3QgYSBkYXRlXG4gICAgKi9cbiAgIF9kYXRlVG9JU08oZGF0ZSkge1xuICAgICAgaWYgKGRhdGUgJiYgKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICAgZGF0ZSA9IGRhdGUudG9JU09TdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRhdGU7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQSBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIHRoZSByZXN1bHQgb2YgdGhlIEFQSSByZXF1ZXN0LlxuICAgICogQGNhbGxiYWNrIFJlcXVlc3RhYmxlLmNhbGxiYWNrXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLkVycm9yfSBlcnJvciAtIHRoZSBlcnJvciByZXR1cm5lZCBieSB0aGUgQVBJIG9yIGBudWxsYFxuICAgICogQHBhcmFtIHsoT2JqZWN0fHRydWUpfSByZXN1bHQgLSB0aGUgZGF0YSByZXR1cm5lZCBieSB0aGUgQVBJIG9yIGB0cnVlYCBpZiB0aGUgQVBJIHJldHVybnMgYDIwNCBObyBDb250ZW50YFxuICAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3QgLSB0aGUgcmF3IHtAbGlua2NvZGUgaHR0cHM6Ly9naXRodWIuY29tL216YWJyaXNraWUvYXhpb3MjcmVzcG9uc2Utc2NoZW1hIFJlc3BvbnNlfVxuICAgICovXG4gICAvKipcbiAgICAqIE1ha2UgYSByZXF1ZXN0LlxuICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAtIHRoZSBtZXRob2QgZm9yIHRoZSByZXF1ZXN0IChHRVQsIFBVVCwgUE9TVCwgREVMRVRFKVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcGF0aCBmb3IgdGhlIHJlcXVlc3RcbiAgICAqIEBwYXJhbSB7Kn0gW2RhdGFdIC0gdGhlIGRhdGEgdG8gc2VuZCB0byB0aGUgc2VydmVyLiBGb3IgSFRUUCBtZXRob2RzIHRoYXQgZG9uJ3QgaGF2ZSBhIGJvZHkgdGhlIGRhdGFcbiAgICAqICAgICAgICAgICAgICAgICAgIHdpbGwgYmUgc2VudCBhcyBxdWVyeSBwYXJhbWV0ZXJzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gdGhlIGNhbGxiYWNrIGZvciB0aGUgcmVxdWVzdFxuICAgICogQHBhcmFtIHtib29sZWFufSBbcmF3PWZhbHNlXSAtIGlmIHRoZSByZXF1ZXN0IHNob3VsZCBiZSBzZW50IGFzIHJhdy4gSWYgdGhpcyBpcyBhIGZhbHN5IHZhbHVlIHRoZW4gdGhlXG4gICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qgd2lsbCBiZSBtYWRlIGFzIEpTT05cbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIFByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgX3JlcXVlc3QobWV0aG9kLCBwYXRoLCBkYXRhLCBjYiwgcmF3KSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLl9fZ2V0VVJMKHBhdGgpO1xuXG4gICAgICBjb25zdCBBY2NlcHRIZWFkZXIgPSAoZGF0YSB8fCB7fSkuQWNjZXB0SGVhZGVyO1xuICAgICAgaWYgKEFjY2VwdEhlYWRlcikge1xuICAgICAgICAgZGVsZXRlIGRhdGEuQWNjZXB0SGVhZGVyO1xuICAgICAgfVxuICAgICAgY29uc3QgaGVhZGVycyA9IHRoaXMuX19nZXRSZXF1ZXN0SGVhZGVycyhyYXcsIEFjY2VwdEhlYWRlcik7XG5cbiAgICAgIGxldCBxdWVyeVBhcmFtcyA9IHt9O1xuXG4gICAgICBjb25zdCBzaG91bGRVc2VEYXRhQXNQYXJhbXMgPSBkYXRhICYmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpICYmIG1ldGhvZEhhc05vQm9keShtZXRob2QpO1xuICAgICAgaWYgKHNob3VsZFVzZURhdGFBc1BhcmFtcykge1xuICAgICAgICAgcXVlcnlQYXJhbXMgPSBkYXRhO1xuICAgICAgICAgZGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICBwYXJhbXM6IHF1ZXJ5UGFyYW1zLFxuICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgIHJlc3BvbnNlVHlwZTogcmF3ID8gJ3RleHQnIDogJ2pzb24nLFxuICAgICAgfTtcblxuICAgICAgbG9nKGAke2NvbmZpZy5tZXRob2R9IHRvICR7Y29uZmlnLnVybH1gKTtcbiAgICAgIGNvbnN0IHJlcXVlc3RQcm9taXNlID0gYXhpb3MoY29uZmlnKS5jYXRjaChjYWxsYmFja0Vycm9yT3JUaHJvdyhjYiwgcGF0aCkpO1xuXG4gICAgICBpZiAoY2IpIHtcbiAgICAgICAgIHJlcXVlc3RQcm9taXNlLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAvLyB3aXRoIDQwMSByZXN1bHQsIHJlc3BvbnNlIGlzIHVuZGVmaW5lZFxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgY2IobnVsbCwgdHJ1ZSwgbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLmRhdGEgJiYgT2JqZWN0LmtleXMocmVzcG9uc2UuZGF0YSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgLy8gV2hlbiBkYXRhIGhhcyByZXN1bHRzXG4gICAgICAgICAgICAgICBjYihudWxsLCByZXNwb25zZS5kYXRhLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5tZXRob2QgIT09ICdHRVQnICYmIHJlc3BvbnNlLmRhdGEgJiYgT2JqZWN0LmtleXMocmVzcG9uc2UuZGF0YSkubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgLy8gVHJ1ZSB3aGVuIHN1Y2Nlc3NmdWwgc3VibWl0IGEgcmVxdWVzdCBhbmQgcmVjZWl2ZSBhIGVtcHR5IG9iamVjdFxuICAgICAgICAgICAgICAgY2IobnVsbCwgKHJlc3BvbnNlLnN0YXR1cyA8IDMwMCksIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICBjYihudWxsLCByZXNwb25zZS5kYXRhLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcXVlc3RQcm9taXNlO1xuICAgfVxuXG4gICAvKipcbiAgICAqIE1ha2UgYSByZXF1ZXN0IHRvIGFuIGVuZHBvaW50IHRoZSByZXR1cm5zIDIwNCB3aGVuIHRydWUgYW5kIDQwNCB3aGVuIGZhbHNlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHRoZSBwYXRoIHRvIHJlcXVlc3RcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gYW55IHF1ZXJ5IHBhcmFtZXRlcnMgZm9yIHRoZSByZXF1ZXN0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHRoZSBjYWxsYmFjayB0aGF0IHdpbGwgcmVjZWl2ZSBgdHJ1ZWAgb3IgYGZhbHNlYFxuICAgICogQHBhcmFtIHttZXRob2R9IFttZXRob2Q9R0VUXSAtIEhUVFAgTWV0aG9kIHRvIHVzZVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBfcmVxdWVzdDIwNG9yNDA0KHBhdGgsIGRhdGEsIGNiLCBtZXRob2QgPSAnR0VUJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QobWV0aG9kLCBwYXRoLCBkYXRhKVxuICAgICAgICAgLnRoZW4oZnVuY3Rpb24gc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgICBjYihudWxsLCB0cnVlLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgIH0sIGZ1bmN0aW9uIGZhaWx1cmUocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZXNwb25zZS5zdGF0dXMgPT09IDQwNCkge1xuICAgICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgICAgICBjYihudWxsLCBmYWxzZSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgIGNiKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgICAgfSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTWFrZSBhIHJlcXVlc3QgYW5kIGZldGNoIGFsbCB0aGUgYXZhaWxhYmxlIGRhdGEuIEdpdGh1YiB3aWxsIHBhZ2luYXRlIHJlc3BvbnNlcyBzbyBmb3IgcXVlcmllc1xuICAgICogdGhhdCBtaWdodCBzcGFuIG11bHRpcGxlIHBhZ2VzIHRoaXMgbWV0aG9kIGlzIHByZWZlcnJlZCB0byB7QGxpbmsgUmVxdWVzdGFibGUjcmVxdWVzdH1cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gdGhlIHBhdGggdG8gcmVxdWVzdFxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBpbmNsdWRlXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gdGhlIGZ1bmN0aW9uIHRvIHJlY2VpdmUgdGhlIGRhdGEuIFRoZSByZXR1cm5lZCBkYXRhIHdpbGwgYWx3YXlzIGJlIGFuIGFycmF5LlxuICAgICogQHBhcmFtIHtPYmplY3RbXX0gcmVzdWx0cyAtIHRoZSBwYXJ0aWFsIHJlc3VsdHMuIFRoaXMgYXJndW1lbnQgaXMgaW50ZW5kZWQgZm9yIGludGVyYWwgdXNlIG9ubHkuXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIGEgcHJvbWlzZSB3aGljaCB3aWxsIHJlc29sdmUgd2hlbiBhbGwgcGFnZXMgaGF2ZSBiZWVuIGZldGNoZWRcbiAgICAqIEBkZXByZWNhdGVkIFRoaXMgd2lsbCBiZSBmb2xkZWQgaW50byB7QGxpbmsgUmVxdWVzdGFibGUjX3JlcXVlc3R9IGluIHRoZSAyLjAgcmVsZWFzZS5cbiAgICAqL1xuICAgX3JlcXVlc3RBbGxQYWdlcyhwYXRoLCBvcHRpb25zLCBjYiwgcmVzdWx0cykge1xuICAgICAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG5cbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBwYXRoLCBvcHRpb25zKVxuICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgdGhpc0dyb3VwO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgdGhpc0dyb3VwID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UuZGF0YS5pdGVtcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICB0aGlzR3JvdXAgPSByZXNwb25zZS5kYXRhLml0ZW1zO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gYGNhbm5vdCBmaWd1cmUgb3V0IGhvdyB0byBhcHBlbmQgJHtyZXNwb25zZS5kYXRhfSB0byB0aGUgcmVzdWx0IHNldGA7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgUmVzcG9uc2VFcnJvcihtZXNzYWdlLCBwYXRoLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goLi4udGhpc0dyb3VwKTtcblxuICAgICAgICAgICAgY29uc3QgbmV4dFVybCA9IGdldE5leHRQYWdlKHJlc3BvbnNlLmhlYWRlcnMubGluayk7XG4gICAgICAgICAgICBpZiAobmV4dFVybCAmJiB0eXBlb2Ygb3B0aW9ucy5wYWdlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgbG9nKGBnZXR0aW5nIG5leHQgcGFnZTogJHtuZXh0VXJsfWApO1xuICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RBbGxQYWdlcyhuZXh0VXJsLCBvcHRpb25zLCBjYiwgcmVzdWx0cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjYikge1xuICAgICAgICAgICAgICAgY2IobnVsbCwgcmVzdWx0cywgcmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNwb25zZS5kYXRhID0gcmVzdWx0cztcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgIH0pLmNhdGNoKGNhbGxiYWNrRXJyb3JPclRocm93KGNiLCBwYXRoKSk7XG4gICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdGFibGU7XG5cbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIC8vXG4vLyAgUHJpdmF0ZSBoZWxwZXIgZnVuY3Rpb25zICAvL1xuLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gLy9cbmNvbnN0IE1FVEhPRFNfV0lUSF9OT19CT0RZID0gWydHRVQnLCAnSEVBRCcsICdERUxFVEUnXTtcbmZ1bmN0aW9uIG1ldGhvZEhhc05vQm9keShtZXRob2QpIHtcbiAgIHJldHVybiBNRVRIT0RTX1dJVEhfTk9fQk9EWS5pbmRleE9mKG1ldGhvZCkgIT09IC0xO1xufVxuXG5mdW5jdGlvbiBnZXROZXh0UGFnZShsaW5rc0hlYWRlciA9ICcnKSB7XG4gICBjb25zdCBsaW5rcyA9IGxpbmtzSGVhZGVyLnNwbGl0KC9cXHMqLFxccyovKTsgLy8gc3BsaXRzIGFuZCBzdHJpcHMgdGhlIHVybHNcbiAgIHJldHVybiBsaW5rcy5yZWR1Y2UoZnVuY3Rpb24obmV4dFVybCwgbGluaykge1xuICAgICAgaWYgKGxpbmsuc2VhcmNoKC9yZWw9XCJuZXh0XCIvKSAhPT0gLTEpIHtcbiAgICAgICAgIHJldHVybiAobGluay5tYXRjaCgvPCguKik+LykgfHwgW10pWzFdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV4dFVybDtcbiAgIH0sIHVuZGVmaW5lZCk7XG59XG5cbmZ1bmN0aW9uIGNhbGxiYWNrRXJyb3JPclRocm93KGNiLCBwYXRoKSB7XG4gICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlcihvYmplY3QpIHtcbiAgICAgIGxldCBlcnJvcjtcbiAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoJ2NvbmZpZycpKSB7XG4gICAgICAgICBjb25zdCB7cmVzcG9uc2U6IHtzdGF0dXMsIHN0YXR1c1RleHR9LCBjb25maWc6IHttZXRob2QsIHVybH19ID0gb2JqZWN0O1xuICAgICAgICAgbGV0IG1lc3NhZ2UgPSAoYCR7c3RhdHVzfSBlcnJvciBtYWtpbmcgcmVxdWVzdCAke21ldGhvZH0gJHt1cmx9OiBcIiR7c3RhdHVzVGV4dH1cImApO1xuICAgICAgICAgZXJyb3IgPSBuZXcgUmVzcG9uc2VFcnJvcihtZXNzYWdlLCBwYXRoLCBvYmplY3QpO1xuICAgICAgICAgbG9nKGAke21lc3NhZ2V9ICR7SlNPTi5zdHJpbmdpZnkob2JqZWN0LmRhdGEpfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIGVycm9yID0gb2JqZWN0O1xuICAgICAgfVxuICAgICAgaWYgKGNiKSB7XG4gICAgICAgICBsb2coJ2dvaW5nIHRvIGVycm9yIGNhbGxiYWNrJyk7XG4gICAgICAgICBjYihlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgbG9nKCd0aHJvd2luZyBlcnJvcicpO1xuICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9XG4gICB9O1xufVxuIl19
//# sourceMappingURL=Requestable.js.map
