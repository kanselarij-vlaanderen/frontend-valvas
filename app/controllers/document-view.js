import Controller from '@ember/controller';

const PDF_MIME = 'application/pdf';
const PDF_EXTENSION = 'pdf';

export default class DocumentViewController extends Controller {
  get isPdfDocument() {
    if (this.model.file) {
      return (
        this.model.file.get('format').toLowerCase().includes(PDF_MIME) ||
        this.model.file.get('extension').toLowerCase() == PDF_EXTENSION
      );
    } else {
      return false;
    }
  }
}
