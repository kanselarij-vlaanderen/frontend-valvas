import Controller from '@ember/controller';
import { or, lt } from 'ember-awesome-macros';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { A } from '@ember/array';
import EmberObject from '@ember/object';

export default Controller.extend({
  searchNewsItems: service(),
  data: alias('searchNewsItems.cache'),
  count: alias('searchNewsItems.count'),

  hasMoreResults: lt('data.length', 'count'),

  sessions: computed('searchNewsItems.cache{,.[]}', function() {
    let sessions = A();
    this.data.forEach(function(newsItem) {
      let session = sessions.findBy('id', newsItem.sessionId);
      if (!session) {
        session = EmberObject.create({
          id: newsItem.sessionId,
          date: newsItem.sessionDate,
          news: A(),
          announcements: A()
        });
        sessions.pushObject(session);
      }

      if (newsItem.category == "mededeling")
        session.announcements.pushObject(newsItem);
      else
        session.news.pushObject(newsItem);
     });

     return sessions;
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


/*

  { sessionDate, news: [], announcements: []

*/
