import Component from '@ember/component';
import { task, all } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  store: service(),

  selectedPresentedBy: computed('options.[]', 'presentedById', {
    get() {
      if (this.options && !this.presentedById) { // When we clear the query params, select default option
        return this.options.findBy('id', 0);
      } else if (this.options && this.presentedById) {
        return this.options.findBy('id', parseInt(this.presentedById));
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
    const firstName = yield person.firstName;
    const lastName = yield person.lastName;

    let label = '';
    if (firstName) {
      label = `${firstName} `;
    }
    if (lastName) {
      label = `${label}${lastName}`;
    }
    options.push({
      id: parseInt(mandatee.id),
      label: label,
      councilsNumber: null,
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

  updateCouncilsNumber: task(function*(options) {
    options.forEach(yield(option) => {
      // TODO - Fetch the number of councils through mu-search
      option.councilsNumber = Math.ceil(Math.random() * 10);
    });
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
    await this.updateCouncilsNumber.perform(options);
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
