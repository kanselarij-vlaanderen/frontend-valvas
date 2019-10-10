import DS from 'ember-data';
const { Model, attr, hasMany } = DS;
import { computed } from '@ember/object';

export default Model.extend({
  lastName: attr('string'),
  alternativeName: attr('string'),
  firstName: attr('string'),
  fullName: computed('firstName', 'lastName', 'alternativeName', function() {
    // We assume to only be sure of 'lastName' to exist.
    if (this.alternativeName) {
      return this.alternativeName;
    } else {
      if (this.firstName) {
        return `${this.firstName} ${this.lastName}`;
      } else {
        return this.lastName;
      }
    }
  }),

  mandatees: hasMany('mandatee', { inverse: null })
});
