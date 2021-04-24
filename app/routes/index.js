import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service store;
  @service searchNewsItems;

  model(params) {
    return this.searchNewsItems.search(params);
  }
}
