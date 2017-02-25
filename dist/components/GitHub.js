'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright  2013 Michael Aufreiter (Development Seed) and 2016 Yahoo Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license    Licensed under {@link https://spdx.org/licenses/BSD-3-Clause-Clear.html BSD-3-Clause-Clear}.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *             Github.js is freely distributable.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
/* eslint valid-jsdoc: ["error", {"requireReturnDescription": false}] */

var _Gist = require('./Gist');

var _Gist2 = _interopRequireDefault(_Gist);

var _User = require('./User');

var _User2 = _interopRequireDefault(_User);

var _Issue = require('./Issue');

var _Issue2 = _interopRequireDefault(_Issue);

var _Search = require('./Search');

var _Search2 = _interopRequireDefault(_Search);

var _RateLimit = require('./RateLimit');

var _RateLimit2 = _interopRequireDefault(_RateLimit);

var _Repository = require('./Repository');

var _Repository2 = _interopRequireDefault(_Repository);

var _Organization = require('./Organization');

var _Organization2 = _interopRequireDefault(_Organization);

var _Team = require('./Team');

var _Team2 = _interopRequireDefault(_Team);

var _Markdown = require('./Markdown');

var _Markdown2 = _interopRequireDefault(_Markdown);

var _Project = require('./Project');

var _Project2 = _interopRequireDefault(_Project);

var _Authorization = require('./Authorization');

var _Authorization2 = _interopRequireDefault(_Authorization);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * GitHub encapsulates the functionality to create various API wrapper objects.
 */
var GitHub = function () {
  /**
   * Create a new GitHub.
   * @param {Requestable.auth} [auth] - the credentials to authenticate to Github. If auth is
   *                                  not provided requests will be made unauthenticated
   * @param {string} [apiBase=https://api.github.com] - the base Github API URL
   */
  function GitHub(auth) {
    var apiBase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'https://api.github.com';

    _classCallCheck(this, GitHub);

    this.__apiBase = apiBase;
    this.__auth = auth || {};
  }

  /**
   * Create a new Gist wrapper
   * @param {number} [id] - the id for the gist, leave undefined when creating a new gist
   * @return {Gist}
   */


  _createClass(GitHub, [{
    key: 'getGist',
    value: function getGist(id) {
      return new _Gist2.default(id, this.__auth, this.__apiBase);
    }

    /**
     * Create a new User wrapper
     * @param {string} [user] - the name of the user to get information about
     *                        leave undefined for the authenticated user
     * @return {User}
     */

  }, {
    key: 'getUser',
    value: function getUser(user) {
      return new _User2.default(user, this.__auth, this.__apiBase);
    }

    /**
     * Create a new Organization wrapper
     * @param {string} organization - the name of the organization
     * @return {Organization}
     */

  }, {
    key: 'getOrganization',
    value: function getOrganization(organization) {
      return new _Organization2.default(organization, this.__auth, this.__apiBase);
    }

    /**
     * create a new Team wrapper
     * @param {string} teamId - the name of the team
     * @return {team}
     */

  }, {
    key: 'getTeam',
    value: function getTeam(teamId) {
      return new _Team2.default(teamId, this.__auth, this.__apiBase);
    }

    /**
     * Create a new Repository wrapper
     * @param {string} user - the user who owns the respository
     * @param {string} repo - the name of the repository
     * @return {Repository}
     */

  }, {
    key: 'getRepo',
    value: function getRepo(user, repo) {
      return new _Repository2.default(this._getFullName(user, repo), this.__auth, this.__apiBase);
    }

    /**
     * Create a new Issue wrapper
     * @param {string} user - the user who owns the respository
     * @param {string} repo - the name of the repository
     * @return {Issue}
     */

  }, {
    key: 'getIssues',
    value: function getIssues(user, repo) {
      return new _Issue2.default(this._getFullName(user, repo), this.__auth, this.__apiBase);
    }

    /**
     * Create a new Search wrapper
     * @param {string} query - the query to search for
     * @return {Search}
     */

  }, {
    key: 'search',
    value: function search(query) {
      return new _Search2.default(query, this.__auth, this.__apiBase);
    }

    /**
     * Create a new RateLimit wrapper
     * @return {RateLimit}
     */

  }, {
    key: 'getRateLimit',
    value: function getRateLimit() {
      return new _RateLimit2.default(this.__auth, this.__apiBase);
    }

    /**
     * Create a new Markdown wrapper
     * @return {Markdown}
     */

  }, {
    key: 'getMarkdown',
    value: function getMarkdown() {
      return new _Markdown2.default(this.__auth, this.__apiBase);
    }

    /**
     * Create a new Project wrapper
     * @param {string} id - the id of the project
     * @return {Project}
     */

  }, {
    key: 'getProject',
    value: function getProject(id) {
      return new _Project2.default(id, this.__auth, this.__apiBase);
    }

    /**
     * Create a new Authorization wrapper
     * @param {string} user - the user who owns the respository
     * @param {string} repo - the name of the repository
     * @return {Issue}
     */

  }, {
    key: 'getAuthorization',
    value: function getAuthorization() {
      return new _Authorization2.default(this.__auth, this.__apiBase);
    }

    /**
     * Computes the full repository name
     * @param {string} user - the username (or the full name)
     * @param {string} repo - the repository name, must not be passed if `user` is the full name
     * @return {string} the repository's full name
     */

  }, {
    key: '_getFullName',
    value: function _getFullName(user, repo) {
      var fullname = user;

      if (repo) {
        fullname = user + '/' + repo;
      }

      return fullname;
    }
  }]);

  return GitHub;
}();

module.exports = GitHub;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdpdEh1Yi5qcyJdLCJuYW1lcyI6WyJHaXRIdWIiLCJhdXRoIiwiYXBpQmFzZSIsIl9fYXBpQmFzZSIsIl9fYXV0aCIsImlkIiwidXNlciIsIm9yZ2FuaXphdGlvbiIsInRlYW1JZCIsInJlcG8iLCJfZ2V0RnVsbE5hbWUiLCJxdWVyeSIsImZ1bGxuYW1lIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7cWpCQUFBOzs7Ozs7QUFNQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7SUFHTUEsTTtBQUNIOzs7Ozs7QUFNQSxrQkFBWUMsSUFBWixFQUFzRDtBQUFBLFFBQXBDQyxPQUFvQyx1RUFBMUIsd0JBQTBCOztBQUFBOztBQUNuRCxTQUFLQyxTQUFMLEdBQWlCRCxPQUFqQjtBQUNBLFNBQUtFLE1BQUwsR0FBY0gsUUFBUSxFQUF0QjtBQUNGOztBQUVEOzs7Ozs7Ozs7NEJBS1FJLEUsRUFBSTtBQUNULGFBQU8sbUJBQVNBLEVBQVQsRUFBYSxLQUFLRCxNQUFsQixFQUEwQixLQUFLRCxTQUEvQixDQUFQO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs0QkFNUUcsSSxFQUFNO0FBQ1gsYUFBTyxtQkFBU0EsSUFBVCxFQUFlLEtBQUtGLE1BQXBCLEVBQTRCLEtBQUtELFNBQWpDLENBQVA7QUFDRjs7QUFFRDs7Ozs7Ozs7b0NBS2dCSSxZLEVBQWM7QUFDM0IsYUFBTywyQkFBaUJBLFlBQWpCLEVBQStCLEtBQUtILE1BQXBDLEVBQTRDLEtBQUtELFNBQWpELENBQVA7QUFDRjs7QUFFRDs7Ozs7Ozs7NEJBS1FLLE0sRUFBUTtBQUNiLGFBQU8sbUJBQVNBLE1BQVQsRUFBaUIsS0FBS0osTUFBdEIsRUFBOEIsS0FBS0QsU0FBbkMsQ0FBUDtBQUNGOztBQUVEOzs7Ozs7Ozs7NEJBTVFHLEksRUFBTUcsSSxFQUFNO0FBQ2pCLGFBQU8seUJBQWUsS0FBS0MsWUFBTCxDQUFrQkosSUFBbEIsRUFBd0JHLElBQXhCLENBQWYsRUFBOEMsS0FBS0wsTUFBbkQsRUFBMkQsS0FBS0QsU0FBaEUsQ0FBUDtBQUNGOztBQUVEOzs7Ozs7Ozs7OEJBTVVHLEksRUFBTUcsSSxFQUFNO0FBQ25CLGFBQU8sb0JBQVUsS0FBS0MsWUFBTCxDQUFrQkosSUFBbEIsRUFBd0JHLElBQXhCLENBQVYsRUFBeUMsS0FBS0wsTUFBOUMsRUFBc0QsS0FBS0QsU0FBM0QsQ0FBUDtBQUNGOztBQUVEOzs7Ozs7OzsyQkFLT1EsSyxFQUFPO0FBQ1gsYUFBTyxxQkFBV0EsS0FBWCxFQUFrQixLQUFLUCxNQUF2QixFQUErQixLQUFLRCxTQUFwQyxDQUFQO0FBQ0Y7O0FBRUQ7Ozs7Ozs7bUNBSWU7QUFDWixhQUFPLHdCQUFjLEtBQUtDLE1BQW5CLEVBQTJCLEtBQUtELFNBQWhDLENBQVA7QUFDRjs7QUFFRDs7Ozs7OztrQ0FJYztBQUNYLGFBQU8sdUJBQWEsS0FBS0MsTUFBbEIsRUFBMEIsS0FBS0QsU0FBL0IsQ0FBUDtBQUNGOztBQUVEOzs7Ozs7OzsrQkFLV0UsRSxFQUFJO0FBQ1osYUFBTyxzQkFBWUEsRUFBWixFQUFnQixLQUFLRCxNQUFyQixFQUE2QixLQUFLRCxTQUFsQyxDQUFQO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozt1Q0FNbUI7QUFDaEIsYUFBTyw0QkFBa0IsS0FBS0MsTUFBdkIsRUFBK0IsS0FBS0QsU0FBcEMsQ0FBUDtBQUNGOztBQUVEOzs7Ozs7Ozs7aUNBTWFHLEksRUFBTUcsSSxFQUFNO0FBQ3RCLFVBQUlHLFdBQVdOLElBQWY7O0FBRUEsVUFBSUcsSUFBSixFQUFVO0FBQ1BHLG1CQUFjTixJQUFkLFNBQXNCRyxJQUF0QjtBQUNGOztBQUVELGFBQU9HLFFBQVA7QUFDRjs7Ozs7O0FBR0pDLE9BQU9DLE9BQVAsR0FBaUJkLE1BQWpCIiwiZmlsZSI6IkdpdEh1Yi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIEBjb3B5cmlnaHQgIDIwMTMgTWljaGFlbCBBdWZyZWl0ZXIgKERldmVsb3BtZW50IFNlZWQpIGFuZCAyMDE2IFlhaG9vIEluYy5cbiAqIEBsaWNlbnNlICAgIExpY2Vuc2VkIHVuZGVyIHtAbGluayBodHRwczovL3NwZHgub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZS1DbGVhci5odG1sIEJTRC0zLUNsYXVzZS1DbGVhcn0uXG4gKiAgICAgICAgICAgICBHaXRodWIuanMgaXMgZnJlZWx5IGRpc3RyaWJ1dGFibGUuXG4gKi9cbi8qIGVzbGludCB2YWxpZC1qc2RvYzogW1wiZXJyb3JcIiwge1wicmVxdWlyZVJldHVybkRlc2NyaXB0aW9uXCI6IGZhbHNlfV0gKi9cblxuaW1wb3J0IEdpc3QgZnJvbSAnLi9HaXN0JztcbmltcG9ydCBVc2VyIGZyb20gJy4vVXNlcic7XG5pbXBvcnQgSXNzdWUgZnJvbSAnLi9Jc3N1ZSc7XG5pbXBvcnQgU2VhcmNoIGZyb20gJy4vU2VhcmNoJztcbmltcG9ydCBSYXRlTGltaXQgZnJvbSAnLi9SYXRlTGltaXQnO1xuaW1wb3J0IFJlcG9zaXRvcnkgZnJvbSAnLi9SZXBvc2l0b3J5JztcbmltcG9ydCBPcmdhbml6YXRpb24gZnJvbSAnLi9Pcmdhbml6YXRpb24nO1xuaW1wb3J0IFRlYW0gZnJvbSAnLi9UZWFtJztcbmltcG9ydCBNYXJrZG93biBmcm9tICcuL01hcmtkb3duJztcbmltcG9ydCBQcm9qZWN0IGZyb20gJy4vUHJvamVjdCc7XG5pbXBvcnQgQXV0aG9yaXphdGlvbiBmcm9tICcuL0F1dGhvcml6YXRpb24nO1xuXG4vKipcbiAqIEdpdEh1YiBlbmNhcHN1bGF0ZXMgdGhlIGZ1bmN0aW9uYWxpdHkgdG8gY3JlYXRlIHZhcmlvdXMgQVBJIHdyYXBwZXIgb2JqZWN0cy5cbiAqL1xuY2xhc3MgR2l0SHViIHtcbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IEdpdEh1Yi5cbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuYXV0aH0gW2F1dGhdIC0gdGhlIGNyZWRlbnRpYWxzIHRvIGF1dGhlbnRpY2F0ZSB0byBHaXRodWIuIElmIGF1dGggaXNcbiAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdCBwcm92aWRlZCByZXF1ZXN0cyB3aWxsIGJlIG1hZGUgdW5hdXRoZW50aWNhdGVkXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW2FwaUJhc2U9aHR0cHM6Ly9hcGkuZ2l0aHViLmNvbV0gLSB0aGUgYmFzZSBHaXRodWIgQVBJIFVSTFxuICAgICovXG4gICBjb25zdHJ1Y3RvcihhdXRoLCBhcGlCYXNlID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20nKSB7XG4gICAgICB0aGlzLl9fYXBpQmFzZSA9IGFwaUJhc2U7XG4gICAgICB0aGlzLl9fYXV0aCA9IGF1dGggfHwge307XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IEdpc3Qgd3JhcHBlclxuICAgICogQHBhcmFtIHtudW1iZXJ9IFtpZF0gLSB0aGUgaWQgZm9yIHRoZSBnaXN0LCBsZWF2ZSB1bmRlZmluZWQgd2hlbiBjcmVhdGluZyBhIG5ldyBnaXN0XG4gICAgKiBAcmV0dXJuIHtHaXN0fVxuICAgICovXG4gICBnZXRHaXN0KGlkKSB7XG4gICAgICByZXR1cm4gbmV3IEdpc3QoaWQsIHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IFVzZXIgd3JhcHBlclxuICAgICogQHBhcmFtIHtzdHJpbmd9IFt1c2VyXSAtIHRoZSBuYW1lIG9mIHRoZSB1c2VyIHRvIGdldCBpbmZvcm1hdGlvbiBhYm91dFxuICAgICogICAgICAgICAgICAgICAgICAgICAgICBsZWF2ZSB1bmRlZmluZWQgZm9yIHRoZSBhdXRoZW50aWNhdGVkIHVzZXJcbiAgICAqIEByZXR1cm4ge1VzZXJ9XG4gICAgKi9cbiAgIGdldFVzZXIodXNlcikge1xuICAgICAgcmV0dXJuIG5ldyBVc2VyKHVzZXIsIHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IE9yZ2FuaXphdGlvbiB3cmFwcGVyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gb3JnYW5pemF0aW9uIC0gdGhlIG5hbWUgb2YgdGhlIG9yZ2FuaXphdGlvblxuICAgICogQHJldHVybiB7T3JnYW5pemF0aW9ufVxuICAgICovXG4gICBnZXRPcmdhbml6YXRpb24ob3JnYW5pemF0aW9uKSB7XG4gICAgICByZXR1cm4gbmV3IE9yZ2FuaXphdGlvbihvcmdhbml6YXRpb24sIHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogY3JlYXRlIGEgbmV3IFRlYW0gd3JhcHBlclxuICAgICogQHBhcmFtIHtzdHJpbmd9IHRlYW1JZCAtIHRoZSBuYW1lIG9mIHRoZSB0ZWFtXG4gICAgKiBAcmV0dXJuIHt0ZWFtfVxuICAgICovXG4gICBnZXRUZWFtKHRlYW1JZCkge1xuICAgICAgcmV0dXJuIG5ldyBUZWFtKHRlYW1JZCwgdGhpcy5fX2F1dGgsIHRoaXMuX19hcGlCYXNlKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBuZXcgUmVwb3NpdG9yeSB3cmFwcGVyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIHRoZSB1c2VyIHdobyBvd25zIHRoZSByZXNwb3NpdG9yeVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHJlcG8gLSB0aGUgbmFtZSBvZiB0aGUgcmVwb3NpdG9yeVxuICAgICogQHJldHVybiB7UmVwb3NpdG9yeX1cbiAgICAqL1xuICAgZ2V0UmVwbyh1c2VyLCByZXBvKSB7XG4gICAgICByZXR1cm4gbmV3IFJlcG9zaXRvcnkodGhpcy5fZ2V0RnVsbE5hbWUodXNlciwgcmVwbyksIHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IElzc3VlIHdyYXBwZXJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyIC0gdGhlIHVzZXIgd2hvIG93bnMgdGhlIHJlc3Bvc2l0b3J5XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcmVwbyAtIHRoZSBuYW1lIG9mIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAcmV0dXJuIHtJc3N1ZX1cbiAgICAqL1xuICAgZ2V0SXNzdWVzKHVzZXIsIHJlcG8pIHtcbiAgICAgIHJldHVybiBuZXcgSXNzdWUodGhpcy5fZ2V0RnVsbE5hbWUodXNlciwgcmVwbyksIHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IFNlYXJjaCB3cmFwcGVyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcXVlcnkgLSB0aGUgcXVlcnkgdG8gc2VhcmNoIGZvclxuICAgICogQHJldHVybiB7U2VhcmNofVxuICAgICovXG4gICBzZWFyY2gocXVlcnkpIHtcbiAgICAgIHJldHVybiBuZXcgU2VhcmNoKHF1ZXJ5LCB0aGlzLl9fYXV0aCwgdGhpcy5fX2FwaUJhc2UpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhIG5ldyBSYXRlTGltaXQgd3JhcHBlclxuICAgICogQHJldHVybiB7UmF0ZUxpbWl0fVxuICAgICovXG4gICBnZXRSYXRlTGltaXQoKSB7XG4gICAgICByZXR1cm4gbmV3IFJhdGVMaW1pdCh0aGlzLl9fYXV0aCwgdGhpcy5fX2FwaUJhc2UpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhIG5ldyBNYXJrZG93biB3cmFwcGVyXG4gICAgKiBAcmV0dXJuIHtNYXJrZG93bn1cbiAgICAqL1xuICAgZ2V0TWFya2Rvd24oKSB7XG4gICAgICByZXR1cm4gbmV3IE1hcmtkb3duKHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IFByb2plY3Qgd3JhcHBlclxuICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gdGhlIGlkIG9mIHRoZSBwcm9qZWN0XG4gICAgKiBAcmV0dXJuIHtQcm9qZWN0fVxuICAgICovXG4gICBnZXRQcm9qZWN0KGlkKSB7XG4gICAgICByZXR1cm4gbmV3IFByb2plY3QoaWQsIHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IEF1dGhvcml6YXRpb24gd3JhcHBlclxuICAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXIgLSB0aGUgdXNlciB3aG8gb3ducyB0aGUgcmVzcG9zaXRvcnlcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSByZXBvIC0gdGhlIG5hbWUgb2YgdGhlIHJlcG9zaXRvcnlcbiAgICAqIEByZXR1cm4ge0lzc3VlfVxuICAgICovXG4gICBnZXRBdXRob3JpemF0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBBdXRob3JpemF0aW9uKHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ29tcHV0ZXMgdGhlIGZ1bGwgcmVwb3NpdG9yeSBuYW1lXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIHRoZSB1c2VybmFtZSAob3IgdGhlIGZ1bGwgbmFtZSlcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSByZXBvIC0gdGhlIHJlcG9zaXRvcnkgbmFtZSwgbXVzdCBub3QgYmUgcGFzc2VkIGlmIGB1c2VyYCBpcyB0aGUgZnVsbCBuYW1lXG4gICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSByZXBvc2l0b3J5J3MgZnVsbCBuYW1lXG4gICAgKi9cbiAgIF9nZXRGdWxsTmFtZSh1c2VyLCByZXBvKSB7XG4gICAgICBsZXQgZnVsbG5hbWUgPSB1c2VyO1xuXG4gICAgICBpZiAocmVwbykge1xuICAgICAgICAgZnVsbG5hbWUgPSBgJHt1c2VyfS8ke3JlcG99YDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bGxuYW1lO1xuICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdpdEh1YjtcbiJdfQ==
//# sourceMappingURL=GitHub.js.map
