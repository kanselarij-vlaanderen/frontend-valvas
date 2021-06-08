import Route from '@ember/routing/route';
import $ from 'jquery';

export default class DocumentViewRoute extends Route {
  model(params) {
    return this.store.findRecord('attachment', params.id);
  }

  activate() {
    // eslint-disable-next-line
    $('body').addClass(
      'vlc-u-box-model-maximize-height vlc-scroll-wrapper vl-u-no-overflow'
    );
  }

  deactivate() {
    // eslint-disable-next-line
    $('body').removeClass(
      'vlc-u-box-model-maximize-height vlc-scroll-wrapper vl-u-no-overflow'
    );
  }
}
