import DS from 'ember-data';
let { Model, attr, hasMany, belongsTo } = DS;

export default Model.extend({
  plannedStart: attr('date'),
  startedOn: attr('date'),
  endedOn: attr('date'),
  location: attr('string'),
  number: attr('number'),
  isFinal: attr('boolean'),
  extraInfo: attr('string'),

  notifications: hasMany('notification'),
  type: belongsTo('meeting-type')
});
