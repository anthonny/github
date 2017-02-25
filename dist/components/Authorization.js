'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Requestable2 = require('./Requestable');

var _Requestable3 = _interopRequireDefault(_Requestable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Authorization = function (_Requestable) {
   _inherits(Authorization, _Requestable);

   /**
    * Create a new Authorization
    * @param {Requestable.auth} [auth] - information required to authenticate to Github
    * @param {string} [apiBase=https://api.github.com] - the base Github API URL
    */
   function Authorization(auth, apiBase) {
      _classCallCheck(this, Authorization);

      var _this = _possibleConstructorReturn(this, (Authorization.__proto__ || Object.getPrototypeOf(Authorization)).call(this, auth, apiBase));

      _this.__resourcePath = 'authorizations';
      return _this;
   }

   _createClass(Authorization, [{
      key: 'listAuthorizations',
      value: function listAuthorizations(options, cb) {
         return this._requestAllPages('/' + this.__resourcePath, options, cb);
      }
   }, {
      key: 'createAuthorization',
      value: function createAuthorization(authorizationData, cb) {
         return this._request('POST', '/' + this.__resourcePath, authorizationData, cb);
      }
   }, {
      key: 'deleteAuthorization',
      value: function deleteAuthorization(id, cb) {
         return this._request('DELETE', '/' + this.__resourcePath + '/' + id, null, cb);
      }
   }]);

   return Authorization;
}(_Requestable3.default);

module.exports = Authorization;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1dGhvcml6YXRpb24uanMiXSwibmFtZXMiOlsiQXV0aG9yaXphdGlvbiIsImF1dGgiLCJhcGlCYXNlIiwiX19yZXNvdXJjZVBhdGgiLCJvcHRpb25zIiwiY2IiLCJfcmVxdWVzdEFsbFBhZ2VzIiwiYXV0aG9yaXphdGlvbkRhdGEiLCJfcmVxdWVzdCIsImlkIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7Ozs7Ozs7Ozs7SUFFTUEsYTs7O0FBQ0g7Ozs7O0FBS0EsMEJBQVlDLElBQVosRUFBa0JDLE9BQWxCLEVBQTJCO0FBQUE7O0FBQUEsZ0lBQ2xCRCxJQURrQixFQUNaQyxPQURZOztBQUV4QixZQUFLQyxjQUFMLEdBQXNCLGdCQUF0QjtBQUZ3QjtBQUcxQjs7Ozt5Q0FFa0JDLE8sRUFBU0MsRSxFQUFJO0FBQzdCLGdCQUFPLEtBQUtDLGdCQUFMLE9BQTBCLEtBQUtILGNBQS9CLEVBQWlEQyxPQUFqRCxFQUEwREMsRUFBMUQsQ0FBUDtBQUNGOzs7MENBRW1CRSxpQixFQUFtQkYsRSxFQUFJO0FBQ3hDLGdCQUFPLEtBQUtHLFFBQUwsQ0FBYyxNQUFkLFFBQTBCLEtBQUtMLGNBQS9CLEVBQWlESSxpQkFBakQsRUFBb0VGLEVBQXBFLENBQVA7QUFDRjs7OzBDQUVtQkksRSxFQUFJSixFLEVBQUk7QUFDekIsZ0JBQU8sS0FBS0csUUFBTCxDQUFjLFFBQWQsUUFBNEIsS0FBS0wsY0FBakMsU0FBbURNLEVBQW5ELEVBQXlELElBQXpELEVBQStESixFQUEvRCxDQUFQO0FBQ0Y7Ozs7OztBQUlKSyxPQUFPQyxPQUFQLEdBQWlCWCxhQUFqQiIsImZpbGUiOiJBdXRob3JpemF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlcXVlc3RhYmxlIGZyb20gJy4vUmVxdWVzdGFibGUnO1xuXG5jbGFzcyBBdXRob3JpemF0aW9uIGV4dGVuZHMgUmVxdWVzdGFibGUge1xuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBuZXcgQXV0aG9yaXphdGlvblxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5hdXRofSBbYXV0aF0gLSBpbmZvcm1hdGlvbiByZXF1aXJlZCB0byBhdXRoZW50aWNhdGUgdG8gR2l0aHViXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW2FwaUJhc2U9aHR0cHM6Ly9hcGkuZ2l0aHViLmNvbV0gLSB0aGUgYmFzZSBHaXRodWIgQVBJIFVSTFxuICAgICovXG4gICBjb25zdHJ1Y3RvcihhdXRoLCBhcGlCYXNlKSB7XG4gICAgICBzdXBlcihhdXRoLCBhcGlCYXNlKTtcbiAgICAgIHRoaXMuX19yZXNvdXJjZVBhdGggPSAnYXV0aG9yaXphdGlvbnMnXG4gICB9XG5cbiAgIGxpc3RBdXRob3JpemF0aW9ucyhvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RBbGxQYWdlcyhgLyR7dGhpcy5fX3Jlc291cmNlUGF0aH1gLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIGNyZWF0ZUF1dGhvcml6YXRpb24oYXV0aG9yaXphdGlvbkRhdGEsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvJHt0aGlzLl9fcmVzb3VyY2VQYXRofWAsIGF1dGhvcml6YXRpb25EYXRhLCBjYik7XG4gICB9XG5cbiAgIGRlbGV0ZUF1dGhvcml6YXRpb24oaWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC8ke3RoaXMuX19yZXNvdXJjZVBhdGh9LyR7aWR9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aG9yaXphdGlvbjtcbiJdfQ==
//# sourceMappingURL=Authorization.js.map
