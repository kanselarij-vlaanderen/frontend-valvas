import Model, { attr, belongsTo } from '@ember-data/model';
import sanitize from 'sanitize-filename';

export default class FileModel extends Model {
  @attr('string') filename;
  @attr('number') size;
  @attr('string') format;
  @attr('string') extension;

  @belongsTo('attachment') attachment;
  @belongsTo('file', { inverse: null }) download;

  get downloadFilename() {
    return sanitize(this.filename, { replacement: '_' });
  }

  get downloadLink() {
    return `/files/${this.id}/download?name=${encodeURIComponent(
      this.downloadFilename
    )}`;
  }
}
