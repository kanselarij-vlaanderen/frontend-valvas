import Component from '@ember/component';
import { inject as service } from '@ember/service';
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
    const id = this.model.uuid;
    let record = this.store.peekRecord('newsletter-info', id);
    if (!record) {
      record = yield this.store.findRecord('newsletter-info', id, {
        include: 'document-versions' // using include we won't run into page limits
      });
    }
    this.set('documentVersions', record.documentVersions);
  }).keepLatest()
});
