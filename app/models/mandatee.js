import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class MandateeModel extends Model {
  @attr('number') position;
  @attr('date') startDate;
  @attr('date') endDate;
  @attr('string') title;

  @belongsTo('person') person;
}
