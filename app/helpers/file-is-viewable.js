import { helper } from '@ember/component/helper';

export default helper(async function fileIsViewable(file) {
  return (
    (file.format && file.format.toLowerCase().includes('application/pdf')) ||
    (file.extension && file.extension.toLowerCase() === 'pdf')
  );
});
