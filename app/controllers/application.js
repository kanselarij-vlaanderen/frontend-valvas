import Controller from '@ember/controller';
import ENV from 'frontend-valvas/config/environment';

export default class ApplicationController extends Controller {
  VO_HEADER_WIDGET_URL = ENV.VO_HEADER_WIDGET_URL;
  VO_FOOTER_WIDGET_URL = ENV.VO_FOOTER_WIDGET_URL;

  get hasExternallySourcedHeader() {
    try {
      new URL(ENV.VO_HEADER_WIDGET_URL);
      return true;
    } catch (_) {
      return false;
    }
  }

  get hasExternallySourcedFooter() {
    try {
      new URL(ENV.VO_FOOTER_WIDGET_URL);
      return true;
    } catch (_) {
      return false;
    }
  }
}
