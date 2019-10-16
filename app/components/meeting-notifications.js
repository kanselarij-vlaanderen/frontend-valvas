import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  meetingId: null,

  async didReceiveAttrs() {
    const meeting = this.store.findRecord('meeting', this.meetingId);
    this.set('meeting', meeting);
  }
});
