import Model, { attr, belongsTo } from '@ember-data/model';

export default class FileModel extends Model {
  @attr('string') filename;
  @attr('number') size;
  @attr('string') format;
  @attr('string') extension;

  @belongsTo('attachment') attachment;
  @belongsTo('file', { inverse: null }) download;

  get downloadLink() {
    return `/files/${this.id}/download`;
  }
}
