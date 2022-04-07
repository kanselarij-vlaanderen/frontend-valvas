import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { isArray } from '@ember/array';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { all } from 'ember-concurrency';

export default class NewsInfoViewComponent extends Component {
  @service store;

  @tracked longTextHidden = true;
  @tracked newsItemRecord = null;
  @tracked mandatees = [];

  constructor() {
    super(...arguments);
    this.loadData.perform();
    if (this.isLongText) {
      this.longTextHidden = true;
    }
  }

  @task
  *loadData() {
    const id = this.args.newsInfo.uuid;
    let record = this.store.peekRecord('news-item-info', id);
    if (!record) {
      const records = yield this.store.query('news-item-info', {
        'page[size]': 1,
        'filter[:id:]': id,
        include: 'attachments.file',
      });
      record = records.firstObject;
    }
    this.newsItemRecord = record;

    if (this.args.newsInfo.mandateeIds) {
      const mandateeIds = isArray(this.args.newsInfo.mandateeIds)
        ? this.args.newsInfo.mandateeIds
        : [this.args.newsInfo.mandateeIds];
      const mandatees = yield all(
        mandateeIds.map((id) => this.fetchMandatee.perform(id))
      );
      this.mandatees = mandatees;
    }
  }

  @task
  *fetchMandatee(id) {
    let record = this.store.peekRecord('mandatee', id);
    if (!record) {
      const records = yield this.store.query('mandatee', {
        'page[size]': 1,
        'filter[:id:]': id,
        include: 'person',
      });
      record = records.firstObject;
    }
    return record;
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

  async fetchMandatees(mandateeIds) {
    return Promise.all(
      mandateeIds.map((mandateeId) => this.fetchMandatee(mandateeId))
    );
  }

  get showDocuments() {
    if (this.args.meeting) {
      return this.args.meeting.plannedPublicationDate < new Date();
    } else return false;
  }

  @action
  toggleReadMore() {
    this.longTextHidden = !this.longTextHidden;
  }
}
