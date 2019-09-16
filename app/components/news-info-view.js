import Component from '@ember/component';
import { htmlSafe } from '@ember/template';
import { isArray } from '@ember/array';
import { task, all } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  isLongText: false,
  showGeenDocumenten: false,
  isArrayMandateeNames: false,

  createMandatee: task(function*(options, mandateeId) {
    const mandatee = yield this.store.findRecord('mandatee', mandateeId);
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
      fullName: fullName,
      connector: ', '
    });
  }),

  createMandatees: task(function*(options, mandateeIds) {
    yield all(mandateeIds.map(mandateeId => this.createMandatee.perform(options, mandateeId)));
  }),

  async didReceiveAttrs() {
    const htmlContent = this.newsInfo.htmlContent;
    this.set('textToDisplay', htmlSafe(htmlContent));
    if (htmlContent.length > 500) {
      this.set('shortenText', htmlSafe(htmlContent.substr(0, 501) + "..."));
      this.set('isLongText', true);
    }

    if (isArray(this.newsInfo.mandateeNames)) {
      this.set('isArrayMandateeNames', true);
      let options = [];
      await this.createMandatees.perform(options, this.newsInfo.mandateeIds);

      let i = 1;
      options.forEach((option) => {
        if (i == options.length) {
          option.connector = '';
        } else if (i == options.length - 1) {
          option.connector = ' en ';
        }
        i += 1;
      });
      this.set('mandateesArray', options);
    }
  },

  actions: {
    readMore() {
      this.set('isLongText', false);
    }
  }
});
