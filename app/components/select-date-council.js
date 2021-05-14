import Component from '@ember/component';
import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

export default class SelectDateCouncilComponent extends Component {
  @service store;

  tagName = '';
  @tracked options = [];
  defaultOption = { id: null, label: 'Alle ministerraden', start: null, end: null };
  latestOption = { id: 'latest', label: 'Laatstse ministerraad', start: null, end: null };
  @tracked selectOption = { id: 'select', label: 'Kies een datum', start: null, end: null };
  @tracked selected = null;
  @tracked selectedId;

  get enableSelectDateInput() {
    return this.selectedId === 'select';
  }

  async init() {
    super.init(...arguments);
    await this.initLatestSessionDate();
    this.options = [this.defaultOption, this.latestOption, this.latestXMonthsOption(3), this.latestXMonthsOption(6), this.latestXMonthsOption(12), this.selectOption];
    this.setSelectedOptionForSelectedId();
  }

  didReceiveAttrs() {
    super.init(...arguments);
    this.setSelectedOptionForSelectedId();
  }

  latestXMonthsOption(months) {
    const now = new Date();
    return {
      id: `last-${months}-months`,
      label: `Afgelopen ${months} maanden`,
      start: moment(now).subtract(months, 'months').toDate(),
      end: null,
    }
  }

  setSelectedOptionForSelectedId() {
    if (this.options) {
      this.selected = this.selectedId ? this.options.find((option) => (option.id === this.selectedId)) : this.defaultOption;
      if (this.selectedId === 'select') {
        if (this.startDate) this.selectOption.startDate = new Date(this.startDate);
        if (this.endDate) this.selectOption.endDate = new Date(this.endDate);
      } else {
        this.selectOption = { id: 'select', label: 'Kies een datum', start: null, end: null };
      }
    }
  }

  async initLatestSessionDate() {
    const meetings = await this.store.query('meeting', {
      page: { size: 1 },
      sort: '-planned-start',
    });
    if (meetings.length) {
      const latestMeeting = meetings.firstObject;
      this.latestOption.start = latestMeeting.plannedStart;
      this.latestOption.end = moment(latestMeeting.plannedStart).add(1, 'days').toDate();
    }
  }

  @action
  onChangeOption(selected) {
    this.selected = selected;
    this.onChange(this.selected.id, this.selected.start, this.selected.end);
  }

  @action
  onChangeSelectedStart(date) {
    if (this.selected.id === 'select') {
      set(this.selected, 'start', date);
      this.onChange(this.selected.id, this.selected.start, this.selected.end);
    }
  }

  @action
  onChangeSelectedEnd(date) {
    if (this.selected.id === 'select') {
      set(this.selected, 'end', date);
      this.onChange(this.selected.id, this.selected.start, this.selected.end);
    }
  }
}
