import DS from 'ember-data';
const { Model, hasMany } = DS;

export default Model.extend({
  documents: hasMany('document', { inverse: null })
});
