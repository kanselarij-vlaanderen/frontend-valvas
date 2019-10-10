import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;
import { computed } from '@ember/object';
import mandateTypeFromTitle from 'frontend-valvas/utils/mandate-type-from-title';
import priorityFromMandateType from 'frontend-valvas/utils/priority-from-mandate-type';

export default Model.extend({
  title: attr('string'),
  nickName: attr('string'),
  priority: attr('number'),
  start: attr('date'),
  end: attr('date'),
  legacyMandateType: computed('title', function() {
    return mandateTypeFromTitle(this.title);
  }),
  legacyNickName: computed('person.fullName', 'legacyMandateType', function() {
    if (this.get('legacyMandateType')) {
      return `${this.get('legacyMandateType')} ${this.get('person.fullName')}`;
    } else {
      return this.get('person.fullName');
    }
  }),
  legacyPriority: computed('legacyMandateType', function() {
    return priorityFromMandateType(this.get('legacyMandateType'));
  }),

  person: belongsTo('person')
});
