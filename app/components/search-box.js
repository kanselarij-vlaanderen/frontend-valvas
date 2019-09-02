import Component from '@ember/component';

export default Component.extend({
  didReceiveAttrs() {
    // this._super(...arguments);
    this.set('searchInput', this.search);
    this.set('startDateInput', this.startDate);
    this.set('endDateInput', this.endDate);
    this.set('presentedByIdInput', this.presentedById);
    this.set('ministerialPowerIdInput', this.ministerialPowerId);
  },

  actions: {
    search() {
      this.searchNewsletters(
        this.searchInput,
        this.startDateInput,
        this.endDateInput,
        this.presentedByIdInput,
        this.ministerialPowerIdInput
      );
    }
  }
});
