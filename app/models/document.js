import DS from 'ember-data';
const { Model, hasMany, belongsTo, attr } = DS;

export default Model.extend({
  title: attr('string'),
  newsItems: hasMany('newsletter-info', { inverse: null }),
  document: belongsTo('document-container', { inverse: null }),
  file: belongsTo('file', { inverse: null }),
  convertedFile: belongsTo('file', { inverse: null }),
});