import Requestable from './Requestable';

class Authorization extends Requestable {
   /**
    * Create a new Authorization
    * @param {Requestable.auth} [auth] - information required to authenticate to Github
    * @param {string} [apiBase=https://api.github.com] - the base Github API URL
    */
   constructor(auth, apiBase) {
      super(auth, apiBase);
      this.__resourcePath = 'authorizations'
   }

   listAuthorizations(options, cb) {
      return this._requestAllPages(`/${this.__resourcePath}`, options, cb);
   }

   createAuthorization(authorizationData, cb) {
      return this._request('POST', `/${this.__resourcePath}`, authorizationData, cb);
   }

   deleteAuthorization(id, cb) {
      return this._request('DELETE', `/${this.__resourcePath}/${id}`, null, cb);
   }

}

module.exports = Authorization;
