import Controller from '@ember/controller';
import { or } from 'ember-awesome-macros';

export default Controller.extend({
  queryParams: ['search', 'startDate', 'endDate', 'presentedById', 'ministerialPowerId'],
  search: null,
  startDate: null,
  endDate: null,
  presentedById: null,
  ministerialPowerId: null,

  showBackLink: or('search', 'startDate', 'endDate', 'presentedById', 'ministerialPowerId'),

  actions: {
    searchNewsletters(search, startDate, endDate, presentedById, ministerialPowerId) {
      this.set('search', search);
      this.set('startDate', startDate);
      this.set('endDate', endDate);
      this.set('presentedById', presentedById);
      this.set('ministerialPowerId', ministerialPowerId);
    },

    clearParams() {
      this.set('search', null);
      this.set('startDate', null);
      this.set('endDate', null);
      this.set('presentedById', null);
      this.set('ministerialPowerId', null);
    }
  }
});
