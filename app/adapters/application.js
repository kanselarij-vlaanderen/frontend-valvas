import DS from 'ember-data';

// TODO derive namespace from rootURL in config/environment.js
export default DS.JSONAPIAdapter.extend({
  namespace: '/beslissingenvlaamseregering',

  findHasMany(store, snapshot, url, relationship) {
    var id = snapshot.id;
    var type = snapshot.modelName;
    url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findHasMany'));
    // workaround because our backend doesn't return correctly scoped relationship links
    url = this.namespace + url;
    return this.ajax(url, 'GET');
  },

  findBelongsTo(store, snapshot, url, relationship) {
    var id = snapshot.id;
    var type = snapshot.modelName;
    url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findBelongsTo'));
    // workaround because our backend doesn't return correctly scoped relationship links
    url = this.namespace + url;
    return this.ajax(url, 'GET');
  }
});
