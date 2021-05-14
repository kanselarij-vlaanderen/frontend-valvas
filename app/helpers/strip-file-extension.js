import { helper } from '@ember/component/helper';

export default helper(function stripFileExtension([filename]) {
  return filename ? filename.substring(0, filename.lastIndexOf('.')) : filename;
});
