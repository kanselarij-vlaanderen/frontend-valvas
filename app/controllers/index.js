import Controller from '@ember/controller';
import { and } from 'ember-awesome-macros';

export default Controller.extend({
  queryParams: ['search', 'startDate', 'endDate', 'presentedBy', 'ministerialPower'],
  search: null,
  startDate: null,
  endDate: null,
  presentedBy: null,
  ministerialPower: null,

  showBackLink: and('search', 'startDate', 'endDate', 'presentedBy', 'ministerialPower'),

  actions: {
    search() {
      this.set('search', this.searchInput);
      this.set('startDate', this.startDateInput);
      this.set('endDate', this.endDateInput);
      this.set('presentedBy', this.presentedByInput);
      this.set('ministerialPower', this.ministerialPowerInput);
    }
  }
});
