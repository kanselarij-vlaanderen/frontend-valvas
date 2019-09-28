import Service from '@ember/service';
import { warn } from '@ember/debug';
import { A } from '@ember/array';
import fetch from 'fetch';
import { task } from 'ember-concurrency';

export default Service.extend({
  count: 0,

  init() {
    this._super(...arguments);
    this.set('cache', A());
  },

  async search(params) {
    this.set('searchParams', params);
    this.set('searchParams.pageNumber', 0);
    this.set('searchParams.pageSize', 25);
    const newsItems = await this.searchTask.perform();
    this.set('cache', A(newsItems));
  },

  async loadMore() {
    this.set('searchParams.pageNumber', this.searchParams.pageNumber + 1);
    const newsItems = await this.searchTask.perform();
    this.cache.pushObjects(newsItems);
  },

  searchTask: task(function * () {
    const { search, startDate, endDate, ministerId, ministerFirstName, ministerLastName, ministerialPowerId, pageNumber, pageSize } = this.searchParams;
    let endpoint = `/news-items/search?page[size]=${pageSize}&page[number]=${pageNumber}&sort[sessionDate]=desc&sort[priority]=asc`;

    if (search || startDate || endDate || ministerId || ministerialPowerId ) {
      if (search)
        endpoint += `&filter[htmlContent]=${search}`;
      if (startDate)
        endpoint += `&filter[:gte:sessionDate]=${startDate}`;
      if (endDate)
        endpoint += `&filter[:lte:sessionDate]=${endDate}`;
      if (ministerId) {
        if (ministerId == -1) {// previous ministers
          endpoint += `&filter[mandateeActiveStatus]=inactive`;
        } else {
          endpoint += `&filter[mandateeFirstNames]=${ministerFirstName}&filter[mandateeFamilyNames]=${ministerLastName}`;
        }
      } if (ministerialPowerId)
        endpoint += `&filter[themeId]=${ministerialPowerId}`;
    } else {
      endpoint += `&filter[:sqs:title]=*`;
    }

    try {
      const json = yield (yield fetch(endpoint)).json();
      this.set('count', json.count);
      return json.data.map(item => item.attributes);
    } catch (e) {
      warn(`Something went wrong while querying mu-search: ${e.message}`, { id: 'mu-search.failure' });
      return A();
    }
  }).keepLatest()
});
