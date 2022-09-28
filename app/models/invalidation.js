import Model, { attr, belongsTo } from '@ember-data/model';

export default class InvalidationModel extends Model {
  @attr('date') time;

  @belongsTo('government-body', { inverse: 'endDate' }) governmentBodyEnd;
}
