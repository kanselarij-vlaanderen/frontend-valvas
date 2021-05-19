import Component from '@glimmer/component';
import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

export default class SelectDateCouncilComponent extends Component {
  @service store;

  tagName = '';
  @tracked options = [];
  @tracked defaultOption = {
    id: null,
    label: 'Alle ministerraden',
    start: null,
    end: null,
  };
  @tracked latestOption = {
    id: 'latest',
    label: 'Laatstse ministerraad',
    start: null,
    end: null,
  };
  @tracked selectOption = {
    id: 'select',
    label: 'Kies een datum',
    start: null,
    end: null,
  };

  constructor() {
    super(...arguments);
    this.initLatestSessionDate();
    this.options = [
      this.defaultOption,
      this.latestOption,
      this.latestXMonthsOption(3),
      this.latestXMonthsOption(6),
      this.latestXMonthsOption(12),
      this.selectOption,
    ];
    let { id, start, stop } = this.defaultOption;
    this.args.onChange(id, start, stop);
  }

  get enableSelectDateInput() {
    return this.args.selectedId === 'select';
  }

  get selected() {
    if (this.args.selectedId && this.options) {
      this.setSelectedOptionForSelectedId();
      return this.options.find((option) => option.id === this.args.selectedId);
    } else {
      return this.defaultOption;
    }
  }

  latestXMonthsOption(months) {
    const now = new Date();
    return {
      id: `last-${months}-months`,
      label: `Afgelopen ${months} maanden`,
      start: moment(now).subtract(months, 'months').toDate(),
      end: null,
    };
  }

  setSelectedOptionForSelectedId() {
    if (this.args.selectedId === 'select') {
      if (this.args.startDate)
        this.selectOption.startDate = new Date(this.args.startDate);
      if (this.args.endDate)
        this.selectOption.endDate = new Date(this.args.endDate);
    } else {
      this.selectOption = {
        id: 'select',
        label: 'Kies een datum',
        start: null,
        end: null,
      };
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
      this.latestOption.end = moment(latestMeeting.plannedStart)
        .add(1, 'days')
        .toDate();
    }
  }

  @action
  onDidUpdate(element, [id]) {
    if (!id) {
      set(this.selectOption, 'start', null);
      set(this.selectOption, 'end', null);
    }
  }

  @action
  onChangeOption(selected) {
    const { id, start, end } = selected;
    this.args.onChange(id, start, end);
  }

  @action
  onChangeSelectedStart(date) {
    if (this.selected.id === 'select') {
      set(this.selectOption, 'start', date);
      this.args.onChange(
        this.selected.id,
        this.selected.start,
        this.selected.end
      );
    }
  }

  @action
  onChangeSelectedEnd(date) {
    if (this.selected.id === 'select') {
      set(this.selectOption, 'end', date);
      this.args.onChange(
        this.selected.id,
        this.selected.start,
        this.selected.end
      );
    }
  }
}
