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
      { id: 0, label: "Alle ministers",    councilsNumber: null, isSpecific: false },
      { id: 1, label: 'Martha Martha',     councilsNumber: null, isSpecific: true  },
      { id: 2, label: 'Paul Paul',         councilsNumber: null, isSpecific: true  },
      { id: 3, label: 'Yves Yves',         councilsNumber: null, isSpecific: true  },
      { id: 4, label: 'Florette Florette', councilsNumber: null, isSpecific: true  }
    ];
    await this.updateCouncilsNumber.perform(options);
    this.set('options', options);
    if(!this.selectedPresentedBy) {
      this.set('selectedPresentedBy', options.findBy('id', 0));
    }
  },

  actions: {
    onChange(selected) {
      this.set('selectedPresentedBy', selected);
      if(selected.id != 0) {
        this.setPresentedBy(selected.id);
      } else {
        this.setPresentedBy(null);
      }
    }
  }
});
