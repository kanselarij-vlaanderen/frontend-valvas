import Model, { attr, hasMany } from '@ember-data/model';

export default class ConceptSchemeModel extends Model {
  @attr('string') label;

  @hasMany('concept') concepts;
}
