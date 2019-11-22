import Component from '@ember/component';
import { htmlSafe } from '@ember/template';
import { isArray } from '@ember/array';
// import { task, all } from 'ember-concurrency';
import { inject as service } from '@ember/service';
// import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
// import ArrayProxy from '@ember/array/proxy';

export default Component.extend({
  store: service(),

  isLongText: false,
  longTextHidden: true,

  fetchMandatee: function(mandateeId) {
    return this.store.findRecord('mandatee', mandateeId, {include: 'person'});
  },

  fetchMandatees: function(mandateeIds) {
    return Promise.all(mandateeIds.map(mandateeId => this.fetchMandatee(mandateeId)));
  },

  async didReceiveAttrs() {
    const htmlContent = this.newsInfo.htmlContent;
    this.set('textToDisplay', htmlSafe(htmlContent));
    if (htmlContent.length > 500) {
      this.set('shortenText', htmlSafe(htmlContent.substr(0, 501) + "..."));
      this.set('isLongText', true);
    }

    let mandatees;
    if (this.newsInfo.mandateeIds) {
      if (isArray(this.newsInfo.mandateeIds)) {
        mandatees = this.fetchMandatees(this.newsInfo.mandateeIds);
      } else {
        mandatees = this.fetchMandatees([this.newsInfo.mandateeIds]);
      }
    } else {
      mandatees = [];
    }
    this.set('mandatees', mandatees)
  },

  actions: {
    readMore() {
      this.toggleProperty('isLongText');
      this.toggleProperty('longTextHidden');
    }
  }
});
