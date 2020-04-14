import { helper } from '@ember/component/helper';

export default helper(function fileIsViewable([file]) {
  return (file.get('format') && file.get('format').toLowerCase().includes('application/pdf')) ||
    (file.get('extension') && (file.get('extension').toLowerCase() === 'pdf'));
});
