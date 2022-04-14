import Component from '@glimmer/component';

export default class MeetingNotificationsComponent extends Component {
  get showNotification() {
    return this.args.meeting.plannedPublicationDate > Date.now();
  }
}
