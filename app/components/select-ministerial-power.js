import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  updateCouncilsNumber: task(function* (options) {
    options.forEach( yield (option) => {
      // TODO - Fetch the number of councils through mu-search
      option.councilsNumber = Math.ceil(Math.random() * 10);
    });
  }),

  createOptions: task(function* (options, ministerialPowers) {
    ministerialPowers.forEach( yield (ministerialPower) => {
      options.push({ label: ministerialPower.label, councilsNumber: null });
    });
  }),

  async init() {
    this._super(...arguments);

    // Insert mock theme records in the store
    await this.store.createRecord('theme', {
      label: 'Haven',
      scopeNote: 'Scope note Haven'
    });
    await this.store.createRecord('theme', {
      label: 'Brussel',
      scopeNote: 'Scope note Brussel'
    });
    // ---------------------------------------

    const ministerialPowers = await this.store.findAll('theme');
    let options = [];
    await this.createOptions.perform(options, ministerialPowers);
    await this.updateCouncilsNumber.perform(options);
    this.set('options', options);
  },

  actions: {
    onChange(selected) {
      this.set('selected', selected);
      this.setMinisterialPower(selected.label);
    }
  }
});
