import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import searchNewsItems from '../services/search-news-items';

export default class AttachmentModel extends Model {
  @attr('string') title;
  @attr('date') created;

  @belongsTo('file') file;
  @hasMany('news-item-info') newsItems;
}
