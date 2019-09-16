import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;
import { computed } from '@ember/object';

export default Model.extend({
  documentVersion: belongsTo('document-version'),

  filename: attr('string'),
  filenameWithoutExtension: computed('filename', {
    get() {
      const ext = this.get('extension');
      const regex = new RegExp('\\.' + ext + '$');
      return this.get('filename').replace(regex, '');
    },
    set(key, value) {
      const filename = `${value}.${this.get('extension')}`;
      this.set('filename', filename);
      return value;
    }
  }),
  format: attr('string'),
  size: attr('number'),
  humanReadableSize: computed('size', function(){
    const bytes = this.size;
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }),
  extension: attr('string'),
  created: attr('date'),
  contentType: attr('string'),
});
