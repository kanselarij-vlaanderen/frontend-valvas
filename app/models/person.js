import Model, { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';

export default class PersonModel extends Model {
  @attr('string') lastName;
  @attr('string') firstName;
  @attr('string') alternativeName;

  @hasMany('mandatee') mandatees;

  @computed('firstName', 'lastName', 'alternativeName')
  get fullName() {
    if (!!this.alternativeName) {
      return this.alternativeName;
    } else if (!!this.firstName) {
      return `${this.firstName} ${this.lastName}`;
    } else {
      return this.lastName;
    }
  }
}
