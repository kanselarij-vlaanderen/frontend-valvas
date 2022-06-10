import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'frontend-valvas/config/environment';

export default class ApplicationRoute extends Route {
  @service moment;
  @service plausible;

  beforeModel() {
    this.moment.setLocale('nl-be');
    let { domain, apiHost } = ENV.plausible;

    if (
      domain !== '{{ANALYTICS_APP_DOMAIN}}' &&
      apiHost !== '{{ANALYTICS_API_HOST}}'
    ) {
      return this.plausible.enable({
        domain,
        apiHost,
      });
    }
  }
}
