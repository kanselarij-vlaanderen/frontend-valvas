import Model, { attr, belongsTo } from '@ember-data/model';

export default class VersionModel extends Model {
  @attr('date') time;

  @belongsTo('government-body', { inverse: 'startDate' }) governmentBodyStart;
  @belongsTo('government-body', { inverse: 'endDate' }) governmentBodyEnd;
}
