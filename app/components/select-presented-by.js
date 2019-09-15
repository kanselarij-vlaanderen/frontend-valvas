import Component from '@ember/component';
import { task, all } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import fetch from 'fetch';

export default Component.extend({
  store: service(),

  selectedPresentedBy: computed('options.[]', 'presentedById', {
    get() {
      if (this.options && !this.presentedById) { // When we clear the query params, select default option
        return this.options.findBy('id', 0);
      } else if (this.options && this.presentedById) {
        return this.options.findBy('id', this.presentedById);
      } else {
        return null;
      }
    },
    set(key, value) {
      return this._selectedPresentedBy = value;
    }
  }),

  createOption: task(function*(options, mandatee) {
    const person = yield mandatee.get('person');

    options.push({
      id: mandatee.id,
      label: yield person.alternativeName,
      councilNumber: null,
      isSpecific: true
    });
  }),

  createOptions: task(function*(options, mandatees) {
    options.push({
      id: 0,
      label: "Alle ministers",
      isSpecific: false
    });
    yield all(mandatees.map(mandatee => this.createOption.perform(options, mandatee)));
  }),

  updateCouncilNumber: task(function*(option) {
    const endpoint = `news-items/search?filter[mandateeIds]=${option.id}`;
    const newsItems = yield (yield fetch(endpoint)).json();
    if (newsItems.count != undefined) {
      option.councilNumber = newsItems.count;
    } else {
      option.councilNumber = 0;
    }
  }),

  updateCouncilNumbers: task(function*(options) {
    yield all(options.map(option => this.updateCouncilNumber.perform(option)));
  }),

  async init() {
    this._super(...arguments);
    const queryParams = {
      // 'filter[:has-no:end]': true
      page: { size: 10 }
    };
    const mandatees = await this.store.query('mandatee', queryParams);
    let options = [];
    await this.createOptions.perform(options, mandatees);
    await this.updateCouncilNumbers.perform(options);
    this.set('options', options);
  },

  actions: {
    onChange(selected) {
      this.set('selectedPresentedBy', selected);
      if (selected.id != 0) {
        this.setPresentedBy(selected.id);
      } else {
        this.setPresentedBy(null);
      }
    }
  }
});
