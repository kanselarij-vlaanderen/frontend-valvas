import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class NewsitemsIndexController extends Controller {
  @service store;
  @service searchNewsItems;
  @service plausible;

  queryParams = [
    'search',
    'dateOption',
    'startDate',
    'endDate',
    'ministerId',
    'ministerFirstName',
    'ministerLastName',
    'themeId',
  ];

  @tracked search = null;
  @tracked dateOption = null;
  @tracked startDate = null;
  @tracked endDate = null;
  @tracked ministerId = null;
  @tracked ministerFirstName = null;
  @tracked ministerLastName = null;
  @tracked themeId = null;
  @tracked meetings = [];

  async groupNewsItemsByMeeting() {
    // Order all news items by the meeting they belong to
    let meetings = [];
    for (let newsItem of this.searchNewsItems.cache) {
      let meeting = meetings.find(
        (meeting) => meeting.id === newsItem.meetingId
      );
      // Add each meeting to the meetings array
      if (!meeting) {
        const meetingRecord = await this.store.findRecord(
          'meeting',
          newsItem.meetingId,
          { include: 'type' }
        );
        meeting = {
          id: newsItem.meetingId,
          date: newsItem.meetingDate,
          record: meetingRecord,
          news: [],
          announcements: [],
        };
        meetings.push(meeting);
      }
      // Add all news items to their meeting
      if (newsItem.agendaitemType.toLowerCase() === 'mededeling') {
        meeting.announcements.push(newsItem);
      } else {
        meeting.news.push(newsItem);
      }
    }
    this.meetings = meetings;
  }

  get searchParams() {
    let searchParams = {};
    this.queryParams.forEach((key) => (searchParams[key] = this[key]));
    return searchParams;
  }

  setParams(params) {
    this.queryParams.forEach((key) => {
      this[key] = params[key];
    });
  }

  @action
  async resetParams() {
    this.queryParams.forEach((key) => (this[key] = null));
    await this.searchNewsItems.search({});
    this.groupNewsItemsByMeeting();
  }

  @action
  async searchNews(searchParams) {
    this.setParams(searchParams);
    await this.searchNewsItems.search(this.searchParams);
    this.groupNewsItemsByMeeting();
  }

  @action
  async loadMore() {
    await this.searchNewsItems.loadMore();
    this.groupNewsItemsByMeeting();
    this.plausible.trackEvent('Laad meer');
  }
}
