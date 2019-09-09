import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import moment from 'moment';

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
      pageNumber = 0;
    }

    if (params.search || params.startDate || params.endDate || params.presentedById || params.ministerialPowerId ) {
      let endpoint = `news-items/search?`;
      if (params.search) {
        endpoint = `${endpoint}&filter[htmlContent]=${params.search}`;
      }
      if (params.startDate) {
        endpoint = `${endpoint}&filter[:gte:sessionDate]=${moment(params.startDate, 'DD-MM-YYYY').toDate().toISOString()}`;
      }
      if (params.endDate) {
        endpoint = `${endpoint}&filter[:lte:sessionDate]=${moment(params.endDate, 'DD-MM-YYYY').toDate().toISOString()}`;
      }
      if (params.presentedById) {
        endpoint = `${endpoint}&filter[mandateeIds]=${params.presentedById}`;
      }
      if (params.ministerialPowerId) {
        endpoint = `${endpoint}&filter[themeId]=${params.ministerialPowerId}`;
      }
      endpoint = `${endpoint}&sort[priority]=asc&page[number]=${pageNumber}`;
      const newsItems = await fetch(endpoint);
      return newsItems.json();
    } else {
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
  }
});
