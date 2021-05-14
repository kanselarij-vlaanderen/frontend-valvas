import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SearchBoxComponent extends Component {
  @service searchNewsItems;

  @action
  selectSessionDate(dateOption, startDate, endDate) {
    if (endDate) {
      endDate.setHours(23, 59, 59);
    }
    this.searchNewsItems.dateOption = dateOption;
    this.searchNewsItems.startDate = startDate ? startDate.toISOString() : null;
    this.searchNewsItems.endDate = endDate ? endDate.toISOString() : null;
  }

  @action
  selectMinister(id, firstName, lastName) {
    this.searchNewsItems.ministerId = id;
    this.searchNewsItems.ministerFirstName = firstName;
    this.searchNewsItems.ministerLastName = lastName;
  }

  @action
  selectMinisterialPowerId(id) {
    this.searchNewsItems.ministerialPowerId = id;
  }

  @action
  search() {
    this.searchNewsItems.search();
  }
}
