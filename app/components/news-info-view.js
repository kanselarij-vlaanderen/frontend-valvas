import Component from '@ember/component';
import { htmlSafe } from '@ember/template';
import { isArray } from '@ember/array';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NewsInfoViewComponent extends Component {
  @service store;

  @tracked longTextHidden = true;
  @tracked mandatees;

  get htmlContent() {
    return this.newsInfo.htmlContent || '';
  }

  get rawText() {
    const node = window.document.createElement('div');
    node.innerHTML = this.htmlContent;
    const text = node.textContent;
    return text.trim().length;
  }

  get isLongText() {
    return this.rawText > 500;
  }

  get fullText() {
    return htmlSafe(this.htmlContent);
  }

  get shortText() {
    return this.isLongText ? htmlSafe(this.htmlContent.substr(0, 500) + '...') : this.fullText;
  }

  async fetchMandatee(mandateeId) {
    let mandatee = this.store.findRecord('mandatee', mandateeId, { include: 'person' });
    return mandatee;
  }

  async fetchMandatees(mandateeIds) {
    return Promise.all(mandateeIds.map((mandateeId) => (this.fetchMandatee(mandateeId))));
  }

  async didReceiveAttrs() {
    if (this.isLongText) this.longTextHidden = true;
    let mandatees;
    if (this.newsInfo.mandateeIds) {
      if (isArray(this.newsInfo.mandateeIds)) {
        mandatees = this.fetchMandatees(this.newsInfo.mandateeIds);
      } else {
        mandatees = this.fetchMandatees([this.newsInfo.mandateeIds]);
      }
    } else {
      mandatees = [];
    }
    this.mandatees = mandatees;
  }

  @action
  toggleReadMore() {
    this.longTextHidden = !this.longTextHidden;
  }
}
