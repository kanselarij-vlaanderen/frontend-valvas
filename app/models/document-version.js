import DS from 'ember-data';
const { Model, hasMany } = DS;

export default Model.extend({
  newsItems: hasMany('newsletter-info', { inverse: null })
});
