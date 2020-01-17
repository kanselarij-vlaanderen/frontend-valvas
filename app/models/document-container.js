import DS from 'ember-data';
const { Model, hasMany } = DS;
import { deprecatingAlias } from '@ember/object/computed';

export default Model.extend({
  documents: hasMany('document', { inverse: null }),
  documentVersions: deprecatingAlias('documentVersions', {
    id: 'model-refactor.documents',
    until: '?'
  }),
});
