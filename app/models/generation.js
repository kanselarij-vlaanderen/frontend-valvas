import Model, { attr, belongsTo } from '@ember-data/model';

export default class GenerationModel extends Model {
  @attr('date') time;

  @belongsTo('government-body', { inverse: 'startDate' }) governmentBodyStart;
}
