import Model, { attr, hasMany } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') lastName;
  @attr('string') firstName;
  @attr('string') alternativeName;

  @hasMany('mandatee') mandatees;

  get fullName() {
    if (this.alternativeName) {
      return this.alternativeName;
    } else if (this.firstName) {
      return `${this.firstName} ${this.lastName}`;
    } else {
      return this.lastName;
    }
  }
}
