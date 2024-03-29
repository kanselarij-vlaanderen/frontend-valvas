import EmberRouter from '@ember/routing/router';
import config from 'frontend-valvas/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('document-view', { path: '/document-view/:id' });
  this.route('newsitems', { path: '' }, function () {});
});
