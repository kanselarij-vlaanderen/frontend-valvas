import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MeetingNotificationsComponent extends Component {
  @service store;

  @tracked meeting = null;
  @tracked showNotification = true;

  async didReceiveAttrs() {
    const meeting = await this.store.findRecord('meeting', this.meetingId);
    this.showNotification = meeting.plannedPublicationDate > Date.now();
    this.meeting = meeting;
  }
}
