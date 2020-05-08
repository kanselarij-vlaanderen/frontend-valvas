import Service from '@ember/service';
import { warn } from '@ember/debug';
import { A } from '@ember/array';
import { task } from 'ember-concurrency';
import muSearch from '../utils/mu-search';

export default Service.extend({
  count: 0,

  docType: Object.freeze('news-items'),
  sortKeys: Object.freeze([
    '-session-date',
    'priority'
  ]),

  init() {
    this._super(...arguments);
    this.set('cache', A());
  },

  async search(params) {
    this.set('searchParams', params);
    this.set('searchParams.pageNumber', 0);
    this.set('searchParams.pageSize', 25);
    const newsItems = await this.searchTask.perform();
    this.set('cache', newsItems);
  },

  async loadMore() {
    this.set('searchParams.pageNumber', this.searchParams.pageNumber + 1);
    const newsItems = await this.searchTask.perform();
    this.cache.pushObjects(newsItems);
  },

  searchTask: task(function * () {
    const { search, startDate, endDate, ministerId, ministerFirstName, ministerLastName, ministerialPowerId, pageNumber, pageSize } = this.searchParams;

    const filter = {};
    if (search || startDate || endDate || ministerId || ministerialPowerId || ministerFirstName || ministerLastName) {
      if (search) {
        filter[':sqs:title,htmlContent'] = search;
      }
      /* Below code treats closed date ranges as something different than 2 open ranges combined.
       * in case of two open ranges combined, an off-by-one result (1 to many) is returned.
       * (semtech/mu-search:0.6.0-beta.11, semtech/mu-search-elastic-backend:1.0.0)
       */
      if (startDate && endDate) {
        filter[':lte,gte:sessionDate'] = endDate + ',' + startDate;
      } else if (startDate) {
        filter[':gte:sessionDate'] = startDate;
      } else if (endDate) {
        filter[':lte:sessionDate'] = endDate;
      }
      if (ministerId || ministerFirstName || ministerLastName) {
        if (ministerId == 'vr') { // mededelingen
          filter.category = 'mededeling';
        } else if (ministerId == -1) {// previous ministers
          filter.mandateeActiveStatus = 'inactive';
          filter.category = 'nieuws';
        } else {
          filter.mandateeFirstNames = ministerFirstName;
          filter.mandateeFamilyNames = ministerLastName;
          filter.category = 'nieuws';
        }
      } if (ministerialPowerId) {
        filter.themeId = ministerialPowerId;
      }
    } else {
      filter[':sqs:title']= '*';
    }

    try {
      const result = yield muSearch(this.docType, pageNumber, pageSize, this.sortKeys, filter, function (item) {
        const entry = item.attributes;
        entry.id = item.id;
        return entry;
      });
      this.set('count', result.meta.count);
      return result;
    } catch (e) {
      warn(`Something went wrong while querying mu-search: ${e.message}`, { id: 'mu-search.failure' });
      return A();
    }
  }).keepLatest()
});
