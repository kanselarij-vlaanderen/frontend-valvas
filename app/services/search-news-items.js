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
    const json = await (await fetch(endpoint)).json();
    const newsItems = json.data;
    this.set('cache', A(newsItems));
    this.set('count', json.count);
  },

  async loadMore(params) {
    const endpoint = this.constructEndpoint(params);
    const json = await (await fetch(endpoint)).json();
    const newsItems = json.data;
    this.cache.pushObjects(newsItems);
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
