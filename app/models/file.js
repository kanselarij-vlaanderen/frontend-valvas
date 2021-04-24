import Model, { attr, belongsTo } from '@ember-data/model';

export default class FileModel extends Model {
  @attr('string') filename;
  @attr('number') size;
  @attr('string') extension;

  @belongsTo('file', { inverse: null }) download;
}
