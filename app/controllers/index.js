import Controller from '@ember/controller';
import { or } from 'ember-awesome-macros';

export default Controller.extend({
  queryParams: ['search', 'dateChoiceId', 'startDate', 'endDate', 'presentedById', 'ministerialPowerId'],
  search: null,
  dateChoiceId: null,
  startDate: null,
  endDate: null,
  presentedById: null,
  ministerialPowerId: null,
  pageNumber: null,

  showBackLink: or('search', 'dateChoiceId', 'startDate', 'endDate', 'presentedById', 'ministerialPowerId', 'pageNumber'),

  actions: {
    searchNews(search, dateChoiceId, startDate, endDate, presentedById, ministerialPowerId) {
      this.set('search', search);
      this.set('dateChoiceId', dateChoiceId);
      this.set('startDate', startDate);
      this.set('endDate', endDate);
      this.set('presentedById', presentedById);
      this.set('ministerialPowerId', ministerialPowerId);
    },

    nextPage() {
      if (!this.pageNumber) {
        this.set('pageNumber', 2);
      } else {
        this.set('pageNumber', parseInt(this.pageNumber) + 1);
      }
    },

    clearParams() {
      this.set('search', null);
      this.set('dateChoiceId', null);
      this.set('startDate', null);
      this.set('endDate', null);
      this.set('presentedById', null);
      this.set('ministerialPowerId', null);
      this.set('pageNumber', null);
    }
  }
});
