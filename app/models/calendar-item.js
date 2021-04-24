import Model, { attr, belongsTo } from '@ember-data/model';

export default class CalendarItemModel extends Model {
  @attr('string') title;
  @attr('string') shortTitle;
  @attr('date') created;
  @attr('date') modified;
  @attr('number') position;

  @belongsTo('concept') type;
  @belongsTo('calendar') calendar;
}
