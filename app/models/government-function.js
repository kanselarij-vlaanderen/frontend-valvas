import Model, { attr } from '@ember-data/model';

export default class GovernmentFunctionModel extends Model {
  @attr('string') label;
}
