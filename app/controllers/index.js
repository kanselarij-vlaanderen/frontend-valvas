import Controller from '@ember/controller';
import { or, lt } from 'ember-awesome-macros';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { A } from '@ember/array';
import EmberObject from '@ember/object';

export default Controller.extend({
  queryParams: ['search',
                'dateOption', 'startDate', 'endDate',
                'ministerId', 'ministerFirstName', 'ministerLastName',
                'ministerialPowerId'],

  searchNewsItems: service(),
  store: service(),

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
  showBackLink: or('search',
                   'dateOption', 'startDate', 'endDate',
                   'ministerId', 'ministerFirstName', 'ministerLastName',
                   'ministerialPowerId'),

  sessions: computed('searchNewsItems.cache{,.[]}', function() {
    let sessions = A();
    this.data.forEach((newsItem) => {
      let session = sessions.findBy('id', newsItem.sessionId);
      if (!session) {
        const sessionRecord = this.store.find('meeting', newsItem.sessionId);
        session = EmberObject.create({
          id: newsItem.sessionId,
          date: newsItem.sessionDate,
          record: sessionRecord,
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
      const { search, dateOption, startDate, endDate, ministerId, ministerFirstName, ministerLastName, ministerialPowerId } = params;
      this.set('search', search);
      this.set('dateOption', dateOption);
      this.set('startDate', startDate);
      this.set('endDate', endDate);
      this.set('ministerId', ministerId);
      this.set('ministerFirstName', ministerFirstName);
      this.set('ministerLastName', ministerLastName);
      this.set('ministerialPowerId', ministerialPowerId);
      this.searchNewsItems.search(params);
    },

    loadMore() {
      this.searchNewsItems.loadMore();
    },

    clearParams() {
      ['search',
       'dateOption',
       'startDate',
       'endDate',
       'ministerId',
       'ministerFirstName',
       'ministerLastName',
       'ministerialPowerId'].forEach(key => this.set(key, null));
      this.searchNewsItems.search({});
    }
  }
});
