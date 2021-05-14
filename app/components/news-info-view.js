import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { isArray } from '@ember/array';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NewsInfoViewComponent extends Component {
  @service store;

  @tracked longTextHidden = true;
  @tracked mandatees;

  constructor() {
    super(...arguments);
    if (this.isLongText) this.longTextHidden = true;
    if (this.args.newsInfo.mandateeIds) {
      if (isArray(this.args.newsInfo.mandateeIds)) {
        this.fetchMandatees(this.args.newsInfo.mandateeIds).then(
          (mandatees) => {
            this.mandatees = mandatees;
          }
        );
      } else {
        this.fetchMandatees([this.args.newsInfo.mandateeIds]).then(
          (mandatees) => {
            this.mandatees = mandatees;
          }
        );
      }
    } else {
      this.mandatees = [];
    }
  }

  get htmlContent() {
    return this.args.newsInfo.htmlContent || '';
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
    return this.isLongText
      ? htmlSafe(this.htmlContent.substr(0, 500) + '...')
      : this.fullText;
  }

  async fetchMandatee(mandateeId) {
    let mandatee = this.store.findRecord('mandatee', mandateeId, {
      include: 'person',
    });
    return mandatee;
  }

  async fetchMandatees(mandateeIds) {
    return Promise.all(
      mandateeIds.map((mandateeId) => this.fetchMandatee(mandateeId))
    );
  }

  @action
  toggleReadMore() {
    this.longTextHidden = !this.longTextHidden;
  }
}
