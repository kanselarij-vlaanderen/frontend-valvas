import Component from '@ember/component';
import { task } from 'ember-concurrency';
import moment from 'moment';
import { computed } from '@ember/object';

export default Component.extend({
  showDateInputs: false,
  startDate: null,
  endDate: null,

  selectedDateChoice: computed('options.[]', 'dateChoiceId', {
    get() {
      if (this.options && !this.dateChoiceId) { // When we clear the query params, select default option
        return this.options.findBy('id', 0);
      } else if (this._selectedDateChoice) {
        return this._selectedDateChoice;
      } else if (this.dateChoiceId && this.options) {
        return this.options.findBy('id', parseInt(this.dateChoiceId));
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

  updateCouncilsNumber: task(function*(options) {
    options.forEach(yield(option) => {
      // TODO - Fetch the number of councils through mu-search
      if (option.monthsNumber) {
        option.councilsNumber = Math.ceil(Math.random() * 10);
      }
    });
  }),

  async init() {
    this._super(...arguments);
    let options = [{
        id: 0,
        label: 'Alle ministerraden',
        monthsNumber: null,
        councilsNumber: null
      },
      {
        id: 1,
        label: 'Laatste ministerraad',
        monthsNumber: 1,
        councilsNumber: null
      },
      {
        id: 2,
        label: 'Afgelopen 3 maanden',
        monthsNumber: 3,
        councilsNumber: null
      },
      {
        id: 3,
        label: 'Afgelopen 6 maanden',
        monthsNumber: 6,
        councilsNumber: null
      },
      {
        id: 4,
        label: 'Afgelopen 12 maanden',
        monthsNumber: 12,
        councilsNumber: null
      },
      {
        id: 5,
        label: 'Kies een datum',
        monthsNumber: null,
        councilsNumber: null
      }
    ];
    await this.updateCouncilsNumber.perform(options);
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
        this.setDateChoiceId(null);
      } else if (selected.id == 5) {
        this.setDateChoiceId(selected.id);
      } else {
        const months = selected.monthsNumber;
        this.set('startDate', moment().subtract(months, 'months').toDate());
        this.set('endDate', new Date());
        this.setDateChoiceId(selected.id);
      }
      if (this.startDate) {
        this.setStartDate(moment(this.startDate).format('DD-MM-YYYY'));
      } else {
        this.setStartDate(this.startDate);
      }
      if (this.endDate) {
        this.setEndDate(moment(this.endDate).format('DD-MM-YYYY'));
      } else {
        this.setEndDate(this.endDate);
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
