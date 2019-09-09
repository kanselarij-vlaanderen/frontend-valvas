import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import moment from 'moment';

export default Route.extend({
  store: service(),
  searchNewsItems: service(),

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
    return this.searchNewsItems.search(params);
  }
});
