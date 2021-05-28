import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';

export default class DocumentsViewComponent extends Component {
  @service store;

  @tracked isExpanded = false;
  @tracked attachments = [];

  constructor() {
    super(...arguments);
    if (this.args.model) {
      this.fetchRecord.perform();
    }
  }

  @action
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  @task({ keepLatest: true })
  *fetchRecord() {
    const id = this.args.model.uuid;
    let record = this.store.peekRecord('news-item-info', id);
    if (!record) {
      record = yield this.store.findRecord('news-item-info', id, {
        include: 'attachments.file',
      });
    }
    this.attachments = record.attachments.sortBy('title');
  }
}
