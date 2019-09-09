import Controller from '@ember/controller';
import { or } from 'ember-awesome-macros';
import { groupBy } from 'ember-awesome-macros/array';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { A } from '@ember/array';

export default Controller.extend({
  searchNewsItems: service(),
  data: alias('searchNewsItems.cache'),
  count: alias('searchNewsItems.count'),

  groupedMeetings: computed('searchNewsItems.cache{,.[]}', function() {
    let attributes = A();
    this.data.forEach((newsItem) => {
      attributes.push(newsItem.attributes);
    })

    let groupedMeetings = A();
    let sessionIds = A();
    attributes.forEach(function(newsItem) {
      let hasSessionId = groupedMeetings.findBy('sessionId', newsItem.sessionId);
      if(!hasSessionId) {
       groupedMeetings.pushObject(Ember.Object.create({
          sessionId: newsItem.sessionId,
          sessionDate: newsItem.sessionDate,
          meetings: []
       }));
      }
      groupedMeetings.findBy('sessionId', newsItem.sessionId).get('meetings').pushObject(newsItem);
     });

     return groupedMeetings;
  }),

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
        this.set('pageNumber', 1);
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
