import DS from 'ember-data';
const { Model, hasMany, attr } = DS;

export default Model.extend({
  title: attr(),
  documentVersions: hasMany('document-version', { inverse: null }),
});
