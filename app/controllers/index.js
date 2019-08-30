import Controller from '@ember/controller';
import { or } from 'ember-awesome-macros';

export default Controller.extend({
  queryParams: ['search', 'startDate', 'endDate', 'presentedBy', 'ministerialPower'],
  search: null,
  startDate: null,
  endDate: null,
  presentedBy: null,
  ministerialPower: null,

  showBackLink: or('search', 'startDate', 'endDate', 'presentedBy', 'ministerialPower'),

  actions: {
    searchNewsletters(search, startDate, endDate, presentedBy, ministerialPower) {
      this.set('search', search);
      this.set('startDate', startDate);
      this.set('endDate', endDate);
      this.set('presentedBy', presentedBy);
      this.set('ministerialPower', ministerialPower);
    },

    clearParams() {
      this.set('search', null);
      this.set('startDate', null);
      this.set('endDate', null);
      this.set('presentedBy', null);
      this.set('ministerialPower', null);
    }
  }
});
