import Model, { attr, belongsTo } from '@ember-data/model';

export default class CalendarModel extends Model {
  @attr('string') title;
  @attr('date') created;
  @attr('date') modified;

  @belongsTo('meeting') meeting;
}
