import DS from 'ember-data';
let { Model, attr, hasMany } = DS;
import { equal } from '@ember/object/computed';

export default Model.extend({
  plannedStart: attr('date'),
  startedOn: attr('date'),
  endedOn: attr('date'),
  location: attr('string'),
  number: attr('number'),
  isFinal: attr('boolean'),
  extraInfo: attr('string'),
  type: attr('string'),

  notifications: hasMany('notification'),

  isElectronic: equal('type', 'http://kanselarij.vo.data.gift/id/concept/ministerraad-type-codes/406F2ECA-524D-47DC-B889-651893135456')
});
