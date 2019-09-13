import DS from 'ember-data';
const { Model, hasMany } = DS;

export default Model.extend({
  documentVersions: hasMany('document-version', { inverse: null })
});
