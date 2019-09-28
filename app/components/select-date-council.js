import Component from '@ember/component';
import { inject as service } from '@ember/service';
import moment from 'moment';
import { A } from '@ember/array';
import EmberObject from '@ember/object';
import { equal } from '@ember/object/computed';

export default Component.extend({
  store: service(),

  tagName: '',

  startDate: null, // Date ISO string
  endDate: null, // Date ISO string
  selectedId: null,

  enableSelectDateInput: equal('selectedId', 'select'),

  async init() {
    this._super(...arguments);

    const now = new Date();

    const defaultOption = EmberObject.create({
      id: null,
      label: 'Alle ministerraden',
      start: null,
      end: null
    });
    const latestOption = EmberObject.create({
      id: 'latest',
      label: 'Laatste ministerraad',
      start: null,
      end: null,
    });
    const latestXMonthsOption = function(months) {
      return EmberObject.create({
        id: `last-${months}-months`,
        label: `Afgelopen ${months} maanden`,
        start: moment(now).subtract(months, 'months').toDate(),
        end: null
      });
    };
    const selectOption = EmberObject.create({
      id: 'select',
      label: 'Kies een datum',
      start: null,
      end: null
    });
    const options = A([
      defaultOption,
      latestOption,
      latestXMonthsOption(3),
      latestXMonthsOption(6),
      latestXMonthsOption(12),
      selectOption
    ]);
    this.set('options', options);
    this.set('defaultOption', defaultOption);
    this.set('latestOption', latestOption);
    this.set('selectOption', selectOption);

    this.setSelectedOptionForSelectedId();

    await this.initLatestSessionDate();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.setSelectedOptionForSelectedId();
  },

  /* Select correct option for ember-power-select if selectedId is changed by external component */
  setSelectedOptionForSelectedId() {
    if (this.options) {
      const selected = this.selectedId ? this.options.find(o => o.id == this.selectedId) : this.defaultOption;
      this.set('selected', selected);

      if (this.selectedId == 'select') {
        if (this.startDate)
          this.selectOption.set('start', new Date(this.startDate));
        if (this.endDate)
          this.selectOption.set('end', new Date(this.endDate));
      } else { // start and end date are precconfigured by the selected option and not entered by user
        this.selectOption.set('start', null);
        this.selectOption.set('end', null);
      }
    }
  },

  async initLatestSessionDate() {
    const meetings = await this.store.query('meeting', {
      page: { size: 1 },
      sort: '-planned-start'
    });
    if (meetings.length) {
      const latestMeeting = meetings.firstObject;
      this.latestOption.set('start', latestMeeting.plannedStart);
      const end = moment(latestMeeting.plannedStart).add(1, 'days').toDate();
      this.latestOption.set('end', end);
    }
  },

  actions: {
    onChange(selected) {
      this.set('selected', selected);
      this.onChange(this.selected.id, this.selected.start, this.selected.end);
    },
    onChangeSelectedStart(date) {
      if (this.selected.id == 'select') {
        this.selected.set('start', date);
        this.onChange(this.selected.id, this.selected.start, this.selected.end);
      }
    },
    onChangeSelectedEnd(date) {
      if (this.selected.id == 'select') {
        this.selected.set('end', date);
        this.onChange(this.selected.id, this.selected.start, this.selected.end);
      }
    }
  }
});
