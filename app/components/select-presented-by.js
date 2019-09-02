import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';

export default Component.extend({
  selectedPresentedBy: computed('options.[]', 'presentedById', {
    get() {
      if (this._selectedPresentedBy) {
        return this._selectedPresentedBy;
      }
      if(this.presentedById && this.options) {
        return this.options.findBy('id', parseInt(this.presentedById));
      } else {
        return null;
      }
    },
    set(key, value) {
      return this._selectedPresentedBy = value;
    }
  }),

  updateCouncilsNumber: task(function* (options) {
    options.forEach( yield (option) => {
      // TODO - Fetch the number of councils through mu-search
      option.councilsNumber = Math.ceil(Math.random() * 10);
    });
  }),

  async init() {
    this._super(...arguments);
    let options = [
      { id: 1, label: 'Martha Martha',     councilsNumber: null },
      { id: 2, label: 'Paul Paul',         councilsNumber: null },
      { id: 3, label: 'Yves Yves',         councilsNumber: null },
      { id: 4, label: 'Florette Florette', councilsNumber: null }
    ];
    await this.updateCouncilsNumber.perform(options);
    this.set('options', options);
  },

  actions: {
    onChange(selected) {
      this.set('selectedPresentedBy', selected);
      this.setPresentedBy(selected.id);
    }
  }
});
