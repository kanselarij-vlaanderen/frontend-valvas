import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

export default Route.extend({
  store: service(),
  firstTimeLoading: true,

  queryParams: {
    search: {
      refreshModel: true
    },
    dateChoiceId: {
      refreshModel: true
    },
    startDate: {
      refreshModel: true
    },
    endDate: {
      refreshModel: true
    },
    presentedById: {
      refreshModel: true
    },
    ministerialPowerId: {
      refreshModel: true
    },
    pageNumber: {
      refreshModel: true
    }
  },

  async model(params) {
    let pageNumber = params.pageNumber;
    if (!pageNumber) {
      pageNumber = 1;
    }
    const queryParams = {
      sort: '-planned-start'
    };
    const meetings = await this.store.query('meeting', queryParams);

    if (meetings.length) {
      const firstMeetingId = meetings.get('firstObject').id;
      const endpoint = `news-items/search?filter[sessionId]=${firstMeetingId}&sort[priority]=asc&page[number]=${pageNumber}`;
      const newsItems = await fetch(endpoint);
      return newsItems.json();
    } else {
      return {
        count: 0,
        data: []
      };
    }
  }
});
