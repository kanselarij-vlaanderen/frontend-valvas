import Component from '@glimmer/component';

export default class MeetingNotificationsComponent extends Component {
  get showNotification() {
    // Meeting record is still a promise: use getter function
    return this.args.meeting.get('plannedPublicationDate') > Date.now();
  }
}
