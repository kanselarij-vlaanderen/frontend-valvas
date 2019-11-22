import Component from '@ember/component';
import { htmlSafe } from '@ember/template';
import { isArray } from '@ember/array';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { gt } from '@ember/object/computed';

export default Component.extend({
  store: service(),

  longTextHidden: true,

  htmlContent: computed('newsInfo.htmlContent', function() {
    return this.newsInfo.htmlContent || '';
  }),
  rawText: computed('htmlContent', function() {
    const node = window.document.createElement('div');
    node.innerHTML = this.htmlContent;
    const text = node.textContent;
    return text.trim().length;
  }),
  isLongText: gt('rawText', 500),
  fullText: computed('htmlContent', function() {
    return htmlSafe(this.htmlContent);
  }),
  shortText: computed('htmlContent', function() {
    return this.isLongText ? htmlSafe(this.htmlContent.substr(0, 500) + '...') : this.fullText;
  }),

  fetchMandatee: function(mandateeId) {
    return this.store.findRecord('mandatee', mandateeId, { include: 'person' });
  },

  fetchMandatees: function(mandateeIds) {
    return Promise.all(mandateeIds.map(mandateeId => this.fetchMandatee(mandateeId)));
  },

  async didReceiveAttrs() {
    if (this.isLongText)
      this.set('longTextHidden', true);

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
    this.set('mandatees', mandatees);
  },

  actions: {
    toggleReadMore() {
      this.toggleProperty('longTextHidden');
    }
  }
});
