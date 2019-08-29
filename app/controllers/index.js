import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['search', 'startDate', 'endDate'],
  search: null,
  startDate: null,
  endDate: null
});
