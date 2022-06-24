import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SearchBoxComponent extends Component {
  searchKeys = [
    'search',
    'dateOption',
    'startDate',
    'endDate',
    'ministerId',
    'ministerFirstName',
    'ministerLastName',
    'themeId',
  ];

  @service store;
  @service plausible;

  @tracked search = null;
  @tracked dateOption = null;
  @tracked startDate = null;
  @tracked endDate = null;
  @tracked ministerId = null;
  @tracked ministerFirstName = null;
  @tracked ministerLastName = null;
  @tracked themeId = null;

  constructor() {
    super(...arguments);
    this.onDidUpdate();
  }

  @action
  onDidUpdate() {
    let {
      search,
      dateOption,
      startDate,
      endDate,
      ministerId,
      ministerFirstName,
      ministerLastName,
      themeId,
    } = this.args.searchParams;

    if (this.search !== search) {
      this.changeSearch({ target: { value: search } });
    }
    if (
      this.ministerId !== ministerId ||
      this.ministerFirstName !== ministerFirstName ||
      this.ministerLastName !== ministerLastName
    ) {
      this.selectMinister(ministerId, ministerFirstName, ministerLastName);
    }
    if (this.themeId !== themeId) {
      this.selectThemeId(themeId);
    }
    if (
      this.dateOption !== dateOption ||
      this.startDate !== startDate ||
      this.endDate !== endDate
    ) {
      this.selectSessionDate(
        dateOption,
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null
      );
    }
  }

  @action
  selectSessionDate(dateOption, startDate, endDate) {
    if (endDate) {
      endDate.setHours(23, 59, 59);
    }
    this.dateOption = dateOption;
    this.startDate = startDate ? startDate.toISOString() : null;
    this.endDate = endDate ? endDate.toISOString() : null;
  }

  @action
  changeSearch(e) {
    this.search = e.target.value;
  }

  @action
  selectMinister(ministerId, ministerFirstName, ministerLastName) {
    this.ministerId = ministerId;
    this.ministerFirstName = ministerFirstName;
    this.ministerLastName = ministerLastName;
  }

  @action
  selectThemeId(themeId) {
    this.themeId = themeId;
  }

  @action
  searchNews(e) {
    e.preventDefault();
    let searchParams = {};
    this.searchKeys.forEach((key) => (searchParams[key] = this[key]));
    this.args.onSearch(searchParams);

    const eventProps = {};
    if (searchParams.search) {
      eventProps['Zoek'] = searchParams.search;
    }
    if (searchParams.dateOption) {
      switch (searchParams.dateOption) {
        case 'latest':
          eventProps['Datum ministerraad'] = 'Laatste ministerraad';
          break;
        case 'last-3-months':
          eventProps['Datum ministerraad'] = 'Afgelopen 3 maanden';
          break;
        case 'last-6-months':
          eventProps['Datum ministerraad'] = 'Afgelopen 6 maanden';
          break;
        case 'last-12-months':
          eventProps['Datum ministerraad'] = 'Afgelopen 12 maanden';
          break;
        case 'select':
          const from = searchParams.startDate;
          const to = searchParams.endDate;
          eventProps['Datum ministerraad'] = `Van ${from} tot ${to}`;
          break;
        default:
          break;
      }
    } else {
      eventProps['Datum ministerraad'] = 'Alle ministerraden';
    }
    if (searchParams.themeId) {
      const theme = this.store.peekRecord('concept', searchParams.themeId);
      eventProps['Ministeriële bevoegdheden'] = theme.label;
    } else {
      eventProps['Ministeriële bevoegdheden'] = 'Alle bevoegdheden';
    }
    if (searchParams.ministerFirstName) {
      const name = `${searchParams.ministerFirstName} ${searchParams.ministerLastName}`;
      eventProps['Voogesteld door'] = name;
    }

    this.plausible.trackEvent('Filter', eventProps);
  }
}
