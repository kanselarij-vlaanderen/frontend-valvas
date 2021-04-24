import Route from '@ember/routing/route';
import $ from 'jquery';

export default class DocumentViewRoute extends Route {
  async model(params) {
    return this.store.findRecord('file', params.id);
  }

  activate() {
    $('body').addClass('vlc-u-box-model-maximize-height vlc-scroll-wrapper vl-u-no-overflow');
  }

  deactivate() {
    $('body').removeClass('vlc-u-box-model-maximize-height vlc-scroll-wrapper vl-u-no-overflow');
  }
}
