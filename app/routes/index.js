import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),
  searchNewsItems: service(),

  model(params) {
    return this.searchNewsItems.search(params);
  }
});
