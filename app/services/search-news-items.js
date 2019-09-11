import Service from '@ember/service';
import { A } from '@ember/array';
import moment from 'moment';

export default Service.extend({
  count: 0,

  init() {
    this._super(...arguments);
    this.set('cache', A());
  },

  async search(params) {
    const endpoint = this.constructEndpoint(params);
    const newsItems = await fetch(endpoint);
    const jsonifiedNewsItems = await newsItems.json();
    if (jsonifiedNewsItems.count > 0) {
      this.set('cache', A(jsonifiedNewsItems.data));
      this.set('count', jsonifiedNewsItems.count);
    } else {
      this.set('cache', A());
      this.set('count', 0);
    }
  },

  async loadMore(params) {
    const endpoint = this.constructEndpoint(params);
    const newsItems = await fetch(endpoint);
    const jsonifiedNewsItems = await newsItems.json();
    if (jsonifiedNewsItems.data.length > 0) {
      jsonifiedNewsItems.data.forEach((item) => {
        this.cache.pushObject(item);
      });
    }
  },

  constructEndpoint({search, startDate, endDate, presentedById, ministerialPowerId, pageNumber=0, pageSize=10}) {
    const rootURL = '/vlaamse-regering/beslissingenvlaamseregering/'; // TODO retrieve rootURL from config/environment.js
    let endpoint = `${rootURL}news-items/search?page[size]=${pageSize}&page[number]=${pageNumber}&sort[sessionDate]=desc&sort[priority]=asc`;

    if (search || startDate || endDate || presentedById || ministerialPowerId ) {
      if (search) {
        endpoint = `${endpoint}&filter[htmlContent]=${search}`;
      }
      if (startDate) {
        endpoint = `${endpoint}&filter[:gte:sessionDate]=${moment(startDate, 'DD-MM-YYYY').toDate().toISOString()}`;
      }
      if (endDate) {
        endpoint = `${endpoint}&filter[:lte:sessionDate]=${moment(endDate, 'DD-MM-YYYY').toDate().toISOString()}`;
      }
      if (presentedById) {
        endpoint = `${endpoint}&filter[mandateeIds]=${presentedById}`;
      }
      if (ministerialPowerId) {
        endpoint = `${endpoint}&filter[themeId]=${ministerialPowerId}`;
      }
    } else {
      endpoint = `${endpoint}&filter[:sqs:title]=*`;
    }
    return endpoint;
  }
});
