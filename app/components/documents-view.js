import Component from '@ember/component';
import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  store: service(),

  model: null,
  isExpanded: false,

  didReceiveAttrs() {
    if (this.model)
      this.fetchRecord.perform();
  },

  fetchRecord: task(function * () {
    // TODO first try to peek record
    const id = this.model.uuid;
    const record = yield this.store.findRecord('newsletter-info', id);
    this.set('record', record);
    yield this.record.documentVersions;
  }).keepLatest()
});
