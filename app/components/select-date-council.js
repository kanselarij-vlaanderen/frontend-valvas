import Component from '@ember/component';
import { task } from 'ember-concurrency';
import moment from 'moment';

export default Component.extend({
  showDateInputs: false,
  startDate: null,
  endDate: null,

  updateCouncilsNumber: task(function* (options) {
    options.forEach( yield (option) => {
      // TODO - Fetch the number of councils through mu-search
      if (option.monthsNumber) {
        option.councilsNumber = Math.ceil(Math.random() * 10);
      }
    });
  }),

  async init() {
    this._super(...arguments);
    let options = [
      { id: 1, label: 'Alle ministerraden',   monthsNumber: null, councilsNumber: null },
      { id: 2, label: 'Laatste ministerraad', monthsNumber: 1,    councilsNumber: null },
      { id: 3, label: 'Afgelopen 3 maanden',  monthsNumber: 3,    councilsNumber: null },
      { id: 4, label: 'Afgelopen 6 maanden',  monthsNumber: 6,    councilsNumber: null },
      { id: 5, label: 'Afgelopen 12 maanden', monthsNumber: 12,   councilsNumber: null },
      { id: 6, label: 'Kies een datum',       monthsNumber: null, councilsNumber: null }
    ];
    await this.updateCouncilsNumber.perform(options);
    this.set('options', options);
  },

  actions: {
    onChange(selected) {
      this.set('showDateInputs', false);
      this.set('selected', selected);
      if (selected.id == 1) {
        this.set('startDate', null);
        this.set('endDate', null);
      } else if (selected.id == 6) {
        this.set('showDateInputs', true);
      } else {
        const months = selected.monthsNumber;
        this.set('startDate', new Date());
        this.set('endDate', moment().subtract(months, 'months').toDate());
      }
      this.setStartDate(this.startDate);
      this.setEndDate(this.endDate);
    }
  }
});
