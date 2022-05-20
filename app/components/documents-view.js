import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DocumentsViewComponent extends Component {
  @tracked isExpanded = false;

  get sortedAttachments() {
    return this.args.attachments.sortBy('title');
  }

  get hasReleasedDocuments() {
    const hasDocuments = this.args.attachments.length;
    if (this.args.plannedPublicationDate) {
      return this.args.plannedPublicationDate < Date.now() && hasDocuments;
    } else {
      return hasDocuments;
    }
  }

  @action
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }
}
