import Controller from '@ember/controller';
import ENV from 'frontend-valvas/config/environment';

export default class ApplicationController extends Controller {
  constructor() {
    super(...arguments);
    this.header = ENV['vo-webuniversum']['header'];
    this.footer = ENV['vo-webuniversum']['footer'];
  }
}
