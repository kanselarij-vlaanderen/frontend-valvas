import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @service store;
  @service searchNewsItems;

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

  get meetings() {
    // Order all news items by the meeting they belong to
    let meetings = [];
    this.searchNewsItems.cache.forEach((newsItem) => {
      let meeting = meetings.find(
        (meeting) => meeting.id === newsItem.meetingId
      );
      // Add each meeting to the meetings array
      if (!meeting) {
        const meetingRecord = this.store.findRecord(
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
    });
    return meetings;
  }

  get searchParams() {
    let searchParams = {};
    this.queryParams.forEach((key) => (searchParams[key] = this[key]));
    return searchParams;
  }

  @action
  setParams(params) {
    this.queryParams.forEach((key) => {
      this[key] = params[key];
    });
  }

  @action
  resetParams() {
    this.queryParams.forEach((key) => (this[key] = null));
    this.searchNewsItems.search({});
  }

  @action
  searchNews() {
    let searchParams = {};
    this.queryParams.forEach((key) => (searchParams[key] = this[key]));
    this.searchNewsItems.search(searchParams);
  }

  @action
  loadMore() {
    this.searchNewsItems.loadMore();
  }
}
