import Component from '@ember/component';

export default Component.extend({
  actions: {
    selectSessionDate(dateOption, startDate, endDate) {
      this.set('searchParams.dateOption', dateOption);
      this.set('searchParams.startDate', startDate ? startDate.toISOString() : null);
      this.set('searchParams.endDate', endDate ? endDate.toISOString() : null);
    }
  }
});
