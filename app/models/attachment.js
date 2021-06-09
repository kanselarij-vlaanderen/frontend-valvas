import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class AttachmentModel extends Model {
  @attr('string') title;
  @attr('date') created;

  @belongsTo('file') file;
  @hasMany('news-item-info') newsItems;
}
