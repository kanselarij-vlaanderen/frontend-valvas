import Component from '@ember/component';
import { action } from '@ember/object';

export default class SearchBoxComponent extends Component {
  @action
  selectSessionDate(dateOption, startDate, endDate) {
    if (endDate) {
      endDate.setHours(23, 59, 59);
    }
    this.searchParams.dateOption = dateOption;
    this.searchParams.startDate = startDate ? startDate.toISOString() : null;
    this.searchParams.endDate = endDate ? endDate.toISOString() : null;
  }

  @action
  selectMinister(id, firstName, lastName) {
    this.searchParams.ministerId = id;
    this.searchParams.ministerFirstName = firstName;
    this.searchParams.ministerLastName = lastName;
  }
}
