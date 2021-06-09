import { helper } from '@ember/component/helper';

const byteUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const base = 1024;

export default helper(function readableFileSize([filesize]) {
  let log = Math.floor(Math.log(filesize) / Math.log(base));
  let readableFileSize = Math.round(filesize / base ** log);
  return `${readableFileSize} ${byteUnits[log]}`;
});
