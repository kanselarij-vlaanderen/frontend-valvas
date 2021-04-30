import Service from '@ember/service';
import { warn } from '@ember/debug';
import { A } from '@ember/array';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import muSearch from '../utils/mu-search';

export default class SearchNewsItemsService extends Service {
  docType = Object.freeze('news-items');
  sortKeys = Object.freeze([
    '-meeting-date',
    'meeting-position',
    'position'
  ]);
  @tracked cache;
  @tracked count = 0;
  @tracked filter = false;
  queryParams = ['keyword', 'dateOption', 'startDate', 'endDate', 'ministerId', 'ministerFirstName', 'ministerLastName', 'ministerialPowerId'];
  @tracked keyword = null;
  @tracked dateOption = null;
  @tracked startDate = null;
  @tracked endDate = null;
  @tracked ministerId = null;
  @tracked ministerFirstName = null;
  @tracked ministerLastName = null;
  @tracked ministerialPowerId = null;
  @tracked pageNumber = 0;
  @tracked pageSize = 25;

  init() {
    super.init(...arguments);
    this.cache = A();
  }

  async search() {
    this.pageNumber = 0;
    this.pageSize = 25;
    this.filter = !this.queryParams.every((key) => (!this[key]))
    const newsItems = await this.searchTask.perform();
    this.cache = newsItems;
  }

  setParams(params) {
    this.queryParams.forEach((key) => (this[key] = !!params[key] ? params[key] : this[key]));
  }

  clearParams() {
    this.filter = false;
    this.queryParams.forEach((key) => (this[key] = null))
  }

  async loadMore() {
    this.pageNumber += 1;
    const newsItems = await this.searchTask.perform();
    this.cache.push(...newsItems);
    this.cache = this.cache; // Trigger a view refresh
  }

  @(task(function* () {
    const { keyword, startDate, endDate, ministerId, ministerFirstName, ministerLastName, ministerialPowerId, pageNumber, pageSize } = this;

    const filter = {};
    if (keyword || startDate || endDate || ministerId || ministerialPowerId || ministerFirstName || ministerLastName) {
      if (keyword) {
        filter[':sqs:title,htmlContent'] = keyword;
      }
      /* Below code treats closed date ranges as something different than 2 open ranges combined.
       * in case of two open ranges combined, an off-by-one result (1 to many) is returned.
       * (semtech/mu-search:0.6.0-beta.11, semtech/mu-search-elastic-backend:1.0.0)
       */
      if (startDate && endDate) {
        filter[':gte,lte:meetingDate'] = startDate + ',' + endDate;
      } else if (startDate) {
        filter[':gte:meetingDate'] = startDate;
      } else if (endDate) {
        filter[':lte:meetingDate'] = endDate;
      }
      if (ministerId || ministerFirstName || ministerLastName) {
        if (ministerId == 'vr') { // mededelingen
          filter.agendaitemType = 'Mededeling';
        } else if (ministerId == -1) {// previous ministers
          filter.mandateeActiveStatus = 'inactive';
          filter.agendaitemType = 'Nota';
        } else {
          filter.mandateeFirstNames = ministerFirstName;
          filter.mandateeFamilyNames = ministerLastName;
          filter.agendaitemType = 'Nota';
        }
      } if (ministerialPowerId) {
        filter.themeId = ministerialPowerId;
      }
    } else {
      filter[':sqs:title'] = '*';
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
  }).keepLatest()) searchTask;
}
