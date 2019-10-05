import { helper } from '@ember/component/helper';

export default helper(function formatNumber([number]) {
  return `${number}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
});
