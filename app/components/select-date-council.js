import Component from '@ember/component';
import { task, all } from 'ember-concurrency';
import moment from 'moment';
import { computed } from '@ember/object';

export default Component.extend({
  startDate: null,
  endDate: null,

  selectedDateChoice: computed('options.[]', 'dateChoiceId', {
    get() {
      if (this.options && !this.dateChoiceId) { // When we clear the query params, select default option
        return this.options.findBy('id', 0);
      } else if (this.options && this.dateChoiceId) {
        return this.options.findBy('id', this.dateChoiceId);
      } else {
        return null;
      }
    },
    set(key, value) {
      return this._selectedDateChoice = value;
    }
  }),

  showDateInputs: computed('selectedDateChoice', function() {
    if (this.selectedDateChoice) {
      return this.selectedDateChoice.id == 5;
    }
  }),

  updateCouncilNumber: task(function*(option) {
    const endpoint = `news-items/search?filter[:gte:sessionDate]=${moment().subtract(option.monthsNumber, 'months').toDate().toISOString()}&sort[priority]=asc&page[number]=0`;
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
    let options = [{
        id: 0,
        label: 'Alle ministerraden',
        monthsNumber: null,
        councilNumber: null
      },
      {
        id: 1,
        label: 'Laatste ministerraad',
        monthsNumber: 1,
        councilNumber: null
      },
      {
        id: 2,
        label: 'Afgelopen 3 maanden',
        monthsNumber: 3,
        councilNumber: null
      },
      {
        id: 3,
        label: 'Afgelopen 6 maanden',
        monthsNumber: 6,
        councilNumber: null
      },
      {
        id: 4,
        label: 'Afgelopen 12 maanden',
        monthsNumber: 12,
        councilNumber: null
      },
      {
        id: 5,
        label: 'Kies een datum',
        monthsNumber: null,
        councilNumber: null
      }
    ];
    await this.updateCouncilNumbers.perform(options);
    this.set('options', options);

    if (this.startDateInput) {
      this.set('startDate', moment(this.startDateInput, 'DD-MM-YYYY').toDate());
    }

    if (this.endDateInput) {
      this.set('endDate', moment(this.endDateInput, 'DD-MM-YYYY').toDate());
    }
  },

  actions: {
    onChange(selected) {
      this.set('selectedDateChoice', selected);
      if (selected.id == 0) {
        this.set('startDate', null);
        this.set('endDate', null);
        this.setStartDate(this.startDate);
        this.setEndDate(this.endDate);
        this.setDateChoiceId(null);
      } else {
        this.setDateChoiceId(selected.id);
        if (selected.id != 5) {
          const months = selected.monthsNumber;
          this.set('startDate', moment().subtract(months, 'months').toDate());
          this.set('endDate', new Date());
          this.setStartDate(moment(this.startDate).format('DD-MM-YYYY'));
          this.setEndDate(moment(this.endDate).format('DD-MM-YYYY'));
        }
      }
    },

    onChangeStart(startDate) {
      this.set('startDate', startDate);
      this.setStartDate(moment(startDate).format('DD-MM-YYYY'));
    },

    onChangeEnd(endDate) {
      this.set('endDate', endDate);
      this.setEndDate(moment(endDate).format('DD-MM-YYYY'));
    }
  }
});
