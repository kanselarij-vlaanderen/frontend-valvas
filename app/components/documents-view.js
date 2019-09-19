import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  store: service(),

  model: null,
  isExpanded: false,
  filesAreExpanded: false,

  didReceiveAttrs() {
    if (this.model)
      this.fetchRecord.perform();
  },

  fetchRecord: task(function * () {
    // TODO first try to peek record
    const id = this.model.uuid;
    const record = yield this.store.findRecord('newsletter-info', id);
    const queryParams = {
      'filter[news-items][id]': record.id,
      page: { size: 50 }
    };
    const documentVersions = yield this.store.query('document-version', queryParams);
    this.set('documentVersions', documentVersions);

  }).keepLatest()
});
