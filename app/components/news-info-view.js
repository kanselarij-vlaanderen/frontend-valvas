import Component from '@ember/component';
import { htmlSafe } from '@ember/template';
import { isArray } from '@ember/array';
import { computed } from '@ember/object';
import { task, all } from 'ember-concurrency';

export default Component.extend({
  isLongText: false,
  showGeenDocumenten: false,
  isArrayMandateeNames: false,

  async didReceiveAttrs() {
    const htmlContent = this.newsInfo.htmlContent;
    if (htmlContent.length > 500) {
      this.set('shortenText', htmlSafe(htmlContent.substr(0, 501) + "..."));
      this.set('isLongText', true);
    } else {
      this.set('textToDisplay', htmlSafe(this.newsInfo.htmlContent));
    }

    if (isArray(this.newsInfo.mandateeNames)) {
      this.set('isArrayMandateeNames', true);
      let options = [];
      await this.createMandatees.perfom(options, this.newsInfo.mandateeIds);
      this.set('mandateesArray', options);
    }
  },

  createMandatees: task(function*(options, mandateeIds) {
    yield all(mandateeIds.map(mandateeId => this.createMandatee.perform(options, mandateeId)));
  }),

  createMandatee: task(function*(options, mandateeId) {
    const mandatee = yield this.store.findBy('mandatee', mandateeId);
    const person = yield mandatee.get('person');
    const firstName = yield person.firstName;
    const lastName = yield person.lastName;

    let fullName = '';
    if (firstName) {
      fullName = `${firstName} `;
    }
    if (lastName) {
      fullName = `${fullName}${lastName}`;
    }

    options.push({
      id: mandateeId,
      title: mandatee.title,
      fullName: fullName
    });
  }),

  actions: {
    readMore() {
      this.set('isLongText', false);
    }
  }
});
