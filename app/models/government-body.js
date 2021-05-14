import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class GovernmentBodyModel extends Model {
  @attr('string') name;

  @hasMany('mandate') mandates;
  @hasMany('mandatees') mandatees;
  @hasMany('government-body', { inverse: 'isTimespecializationOf' })
  governmentBodies;

  @belongsTo('government-body', { inverse: 'governmentBodies' })
  isTimespecializationOf;
  @belongsTo('version') startDate;
  @belongsTo('version') endDate;
  @belongsTo('concept') classification;
  @belongsTo('government-unit') governmentUnit;
}
