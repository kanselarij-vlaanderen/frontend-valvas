import Component from '@ember/component';

export default Component.extend({
  didReceiveAttrs() {
    // this._super(...arguments);
    this.set('searchInput', this.search);
    this.set('startDateInput', this.startDate);
    this.set('endDateInput', this.endDate);
    this.set('presentedByInput', this.presentedBy);
    this.set('ministerialPowerInput', this.ministerialPower);
  },

  actions: {
    search() {
      this.searchNewsletters(
        this.searchInput,
        this.startDateInput,
        this.endDateInput,
        this.presentedByInput,
        this.ministerialPowerInput
      );
    }
  }
});
