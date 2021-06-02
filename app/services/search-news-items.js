import Service from '@ember/service';
import { warn } from '@ember/debug';
import { A } from '@ember/array';
import { tracked } from '@glimmer/tracking';
import { keepLatestTask } from 'ember-concurrency-decorators';
import muSearch from '../utils/mu-search';

export default class SearchNewsItemsService extends Service {
  docType = 'news-items';
  sortKeys = ['-meeting-date', 'meeting-position', 'position'];
  searchParams = {};
  @tracked cache;
  @tracked count = 0;
  @tracked pageNumber = 0;
  @tracked pageSize = 25;
  @tracked hasFilter = false;

  constructor() {
    super(...arguments);
    this.cache = A();
  }

  get hasMoreResults() {
    return this.cache.length < this.count;
  }

  async search(params) {
    this.pageNumber = 0;
    this.pageSize = 25;
    this.searchParams = params ? params : {};
    const newsItems = await this.searchTask.perform();
    this.cache = newsItems;
  }

  async loadMore() {
    this.pageNumber += 1;
    const newsItems = await this.searchTask.perform();
    this.cache.push(...newsItems);
    // Trigger a view refresh
    this.cache = this.cache; // eslint-disable-line
  }

  @keepLatestTask
  *searchTask() {
    const {
      search,
      startDate,
      endDate,
      ministerId,
      ministerFirstName,
      ministerLastName,
      themeId,
    } = this.searchParams;
    const { pageNumber, pageSize } = this;

    const filter = {};
    if (
      search ||
      startDate ||
      endDate ||
      ministerId ||
      themeId ||
      ministerFirstName ||
      ministerLastName
    ) {
      this.hasFilter = true;
      if (search) {
        filter[':sqs:title,htmlContent'] = search;
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
        if (ministerId == 'vr') {
          // mededelingen
          filter.agendaitemType = 'Mededeling';
        } else if (ministerId == -1) {
          // previous ministers
          filter.mandateeActiveStatus = 'inactive';
          filter.agendaitemType = 'Nota';
        } else {
          filter.mandateeFirstNames = ministerFirstName;
          filter.mandateeFamilyNames = ministerLastName;
          filter.agendaitemType = 'Nota';
        }
      }
      if (themeId) {
        filter.themeId = themeId;
      }
    } else {
      this.hasFilter = false;
      filter[':sqs:title'] = '*';
    }

    try {
      const result = yield muSearch(
        this.docType,
        pageNumber,
        pageSize,
        this.sortKeys,
        filter,
        function (item) {
          const entry = item.attributes;
          entry.id = item.id;
          return entry;
        }
      );
      this.count = result.meta.count;
      return result;
    } catch (e) {
      warn(`Something went wrong while querying mu-search: ${e.message}`, {
        id: 'mu-search.failure',
      });
      return A();
    }
  }
}
