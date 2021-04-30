import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service searchNewsItems;

  model(params) {
    this.searchNewsItems.setParams(params);
    return this.searchNewsItems.search();
  }
}
