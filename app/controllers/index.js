import Controller from '@ember/controller';
import { or, equal } from 'ember-awesome-macros';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { A } from '@ember/array';
import EmberObject from '@ember/object';

export default Controller.extend({
  searchNewsItems: service(),
  data: alias('searchNewsItems.cache'),
  count: alias('searchNewsItems.count'),

  disableLoadMore: equal('data.length', 'count'),

  groupedMeetings: computed('searchNewsItems.cache{,.[]}', function() {
    let attributes = A();
    this.data.forEach((newsItem) => {
      attributes.push(newsItem.attributes);
    });

    let groupedMeetings = A();
    attributes.forEach(function(newsItem) {
      let hasSessionId = groupedMeetings.findBy('sessionId', newsItem.sessionId);
      if(!hasSessionId) {
       groupedMeetings.pushObject(EmberObject.create({
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

  showBackLink: or('search', 'dateChoiceId', 'startDate', 'endDate', 'presentedById', 'ministerialPowerId'),

  actions: {
    searchNews(search, dateChoiceId, startDate, endDate, presentedById, ministerialPowerId) {
      this.set('search', search);
      this.set('dateChoiceId', dateChoiceId);
      this.set('startDate', startDate);
      this.set('endDate', endDate);
      this.set('presentedById', presentedById);
      this.set('ministerialPowerId', ministerialPowerId);
    },

    loadMore() {
      this.searchNewsItems.loadMore();
    },

    clearParams() {
      this.set('search', null);
      this.set('dateChoiceId', null);
      this.set('startDate', null);
      this.set('endDate', null);
      this.set('presentedById', null);
      this.set('ministerialPowerId', null);
    }
  }
});
