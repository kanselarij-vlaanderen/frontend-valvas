import Service from '@ember/service';
import { A } from '@ember/array';
import moment from 'moment';
import fetch from 'fetch';

export default Service.extend({
  count: 0,

  init() {
    this._super(...arguments);
    this.set('cache', A());
  },

  async search(params) {
    this.set('params', params);
    const endpoint = this.constructEndpoint(params);
    const json = await (await fetch(endpoint)).json();
    const newsItems = json.data;
    this.set('cache', A(newsItems));
    this.set('count', json.count);
  },

  async loadMore() {
    if (!this.params.pageNumber) {
      this.set('params.pageNumber', 1);
    } else {
      this.set('params.pageNumber', parseInt(this.params.pageNumber) + 1);
    }

    const endpoint = this.constructEndpoint(this.params);
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
