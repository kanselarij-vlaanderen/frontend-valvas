import DS from 'ember-data';
const { Model, hasMany, belongsTo } = DS;

export default Model.extend({
  newsItems: hasMany('newsletter-info', { inverse: null }),
  document: belongsTo('document', { inverse: null }),
  file: belongsTo('file', { inverse: null }),
  convertedFile: belongsTo('file', { inverse: null }),
});
