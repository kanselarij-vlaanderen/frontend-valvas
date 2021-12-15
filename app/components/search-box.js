import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

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
  }
}
