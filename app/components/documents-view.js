import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DocumentsViewComponent extends Component {
  @tracked isExpanded = false;

  get sortedAttachments() {
    return this.args.attachments.sortBy('title');
  }

  @action
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
