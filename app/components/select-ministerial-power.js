import Component from '@ember/component';
import { task, all } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  store: service(),

  selectedMinisterialPower: computed('options.[]', 'ministerialPowerId', {
    get() {
      if (this.options && !this.ministerialPowerId) { // When we clear the query params, select default option
        return this.options.findBy('id', 0);
      } else if (this.options && this.ministerialPowerId) {
        return this.options.findBy('id', this.ministerialPowerId);
      } else {
        return null;
      }
    },
    set(key, value) {
      return this._selectedMinisterialPower = value;
    }
  }),

  createOptions: task(function*(options, ministerialPowers) {
    options.push({
      id: 0,
      label: "Alle bevoegdheden",
      isSpecific: false
    });
    ministerialPowers.forEach(yield(ministerialPower) => {
      const capitalizedLabel = ministerialPower.label.charAt(0).toUpperCase() + ministerialPower.label.slice(1);
      options.push({
        id: ministerialPower.id,
        label: capitalizedLabel,
        scopeNote: ministerialPower.scopeNote,
        councilNumber: null,
        isSpecific: true
      });
    });
  }),

  updateCouncilNumber: task(function*(option) {
    const endpoint = `news-items/search?filter[themeId]=${option.id}`;
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
    const ministerialPowers = await this.store.findAll('theme');
    let options = [];
    await this.createOptions.perform(options, ministerialPowers);
    await this.updateCouncilNumbers.perform(options);
    this.set('options', options);
  },

  actions: {
    onChange(selected) {
      this.set('selectedMinisterialPower', selected);
      if (selected.id != 0) {
        this.setMinisterialPower(selected.id);
      } else {
        this.setMinisterialPower(null);
      }
    }
  }
});
