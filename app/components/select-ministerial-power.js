import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  store: service(),
  selectedMinisterialPower: computed('options.[]', 'ministerialPowerId', {
    get() {
      if (this._selectedMinisterialPower) {
        return this._selectedMinisterialPower;
      }
      if(this.ministerialPowerId && this.options) {
        return this.options.findBy('id', parseInt(this.ministerialPowerId));
      } else {
        return null;
      }
    },
    set(key, value) {
      return this._selectedMinisterialPower = value;
    }
  }),

  updateCouncilsNumber: task(function* (options) {
    options.forEach( yield (option) => {
      // TODO - Fetch the number of councils through mu-search
      option.councilsNumber = Math.ceil(Math.random() * 10);
    });
  }),

  createOptions: task(function* (options, ministerialPowers) {
    options.push({
      id: 0,
      label: "Alle bevoegdheden",
      isSpecific: false
    });
    ministerialPowers.forEach( yield (ministerialPower) => {
      options.push({
        id: parseInt(ministerialPower.id),
        label: ministerialPower.label,
        scopeNote: ministerialPower.scopeNote,
        councilsNumber: null,
        isSpecific: true
      });
    });
  }),

  async init() {
    this._super(...arguments);
    const ministerialPowers = await this.store.findAll('theme');
    let options = [];
    await this.createOptions.perform(options, ministerialPowers);
    await this.updateCouncilsNumber.perform(options);
    this.set('options', options);
    if(!this.selectedMinisterialPower) {
      this.set('selectedMinisterialPower', options.findBy('id', 0));
    }
  },

  actions: {
    onChange(selected) {
      this.set('selectedMinisterialPower', selected);
      if(selected.id != 0) {
        this.setMinisterialPower(selected.id);
      } else {
        this.setMinisterialPower(null);
      }
    }
  }
});
