import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  title: attr('string'),
  nickName: attr('string'),
  priority: attr('number'),
  start: attr('datetime'),
  end: attr('datetime'),

  person: belongsTo('person')
});
