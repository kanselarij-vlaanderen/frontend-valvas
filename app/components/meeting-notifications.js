import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MeetingNotificationsComponent extends Component {
  @service store;

  @tracked meeting = null;

  constructor() {
    super(...arguments);
    this.meeting = this.store.findRecord('meeting', this.args.meetingId);
  }

  get showNotification() {
    return this.meeting
      ? this.meeting.get('plannedPublicationDate') > Date.now()
      : false;
  }
}
