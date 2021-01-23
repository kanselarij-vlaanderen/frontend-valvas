import DS from 'ember-data';
let { Model, attr, hasMany } = DS;

export default Model.extend({
  label: attr('string'),
  altLabel: attr('string'),

  meetings: hasMany('meeting')
});
