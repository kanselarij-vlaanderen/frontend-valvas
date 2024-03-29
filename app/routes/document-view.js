import Route from '@ember/routing/route';
import $ from 'jquery';

export default class DocumentViewRoute extends Route {
  async model(params) {
    const results = await this.store.query('attachment', {
      'filter[:id:]': params.id,
      include: 'file',
    });
    if (results.length) {
      return results.firstObject;
    }
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
