import Controller from '@ember/controller';
import { or, lt } from 'ember-awesome-macros';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { A } from '@ember/array';
import EmberObject from '@ember/object';

export default Controller.extend({
  queryParams: ['search', 'dateOption', 'startDate', 'endDate', 'presentedById', 'ministerialPowerId'],

  searchNewsItems: service(),

  search: null,
  dateChoiceId: null,
  startDate: null,
  endDate: null,
  presentedById: null,
  ministerialPowerId: null,
  pageNumber: null,

  data: alias('searchNewsItems.cache'),
  count: alias('searchNewsItems.count'),
  hasMoreResults: lt('data.length', 'count'),
  showBackLink: or('search', 'dateOption', 'startDate', 'endDate', 'presentedById', 'ministerialPowerId'),

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

  actions: {
    search(params) {
      const { search, dateOption, startDate, endDate, presentedById, ministerialPowerId } = params;
      this.set('search', search);
      this.set('dateOption', dateOption);
      this.set('startDate', startDate);
      this.set('endDate', endDate);
      this.set('presentedById', presentedById);
      this.set('ministerialPowerId', ministerialPowerId);
      this.searchNewsItems.search(params);
    },

    loadMore() {
      this.searchNewsItems.loadMore();
    },

    clearParams() {
      this.set('search', null);
      this.set('dateOption', null);
      this.set('startDate', null);
      this.set('endDate', null);
      this.set('presentedById', null);
      this.set('ministerialPowerId', null);
    }
  }
});
