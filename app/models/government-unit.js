import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class GovernmentUnitModel extends Model {
  @attr('string') name;

  @hasMany('government-body') governmentBodies;

  @belongsTo('concept') classification;
}
