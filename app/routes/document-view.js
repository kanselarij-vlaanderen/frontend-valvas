import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    return this.store.findRecord('document-version', params.id);
  }
});
