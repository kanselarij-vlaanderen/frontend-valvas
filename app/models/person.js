import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';

export default class PersonModel extends Model {
  @attr('string') lastName;
  @attr('string') firstName;
  @attr('string') alternativeName;

  @belongsTo('mandatee') mandatee;

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
