import Component from '@ember/component';

export default Component.extend({
  actions: {
    selectSessionDate(dateOption, startDate, endDate) {
      if(endDate) {
        endDate.setHours(23, 59, 59);
      }
      this.set('searchParams.dateOption', dateOption);
      this.set('searchParams.startDate', startDate ? startDate.toISOString() : null);
      this.set('searchParams.endDate', endDate ? endDate.toISOString() : null);
    },
    selectMinister(id, firstName, lastName) {
      this.set('searchParams.ministerId', id);
      this.set('searchParams.ministerFirstName', firstName);
      this.set('searchParams.ministerLastName', lastName);
    }
  }
});
