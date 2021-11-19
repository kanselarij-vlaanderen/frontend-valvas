import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class MandateModel extends Model {
  @hasMany('mandatee') mandatees;

  @belongsTo('government-function') governmentFunction;
  @belongsTo('government-body') governmentBody;
}
