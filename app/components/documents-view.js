import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DocumentsViewComponent extends Component {
  @tracked isExpanded = false;

  get sortedAttachments() {
    return this.args.attachments.sortBy('title');
  }

  get hasReleasedDocuments() {
    return this.args.plannedPublicationDate < Date.now() && this.args.attachments.length;
  }

  @action
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
