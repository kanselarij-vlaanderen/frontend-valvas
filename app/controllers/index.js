import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
  @service store;
  @service searchNewsItems;

  queryParams = ['search', 'dateOption', 'startDate', 'endDate', 'ministerId', 'ministerFirstName', 'ministerLastName', 'ministerialPowerId'];
  search = null;
  dateOption = null;
  startDate = null;
  endDate = null;
  ministerId = null;
  ministerFirstName = null;
  ministerLastName = null;
  ministerialPowerId = null;

  @alias('searchNewsItems.cache') data;
  @alias('searchNewsItems.count') count;
  @tracked pageNumber = null;

  @computed('search', 'dateOption', 'startDate', 'endDate', 'ministerId', 'ministerFirstName', 'ministerLastName', 'ministerialPowerId')
  get showBackLink() {
    return this.search || this.date || this.startDate || this.endDate || this.ministerId || this.ministerFirstName || this.ministerLastName || this.ministerialPowerId;
  }

  @computed('searchNewsItems.cache{,.[]}', 'searchNewsItems.count')
  get hasMoreResults() {
    return this.data.length < this.count;
  }

  @computed('searchNewsItems.cache{,.[]}')
  get meetings() {
    // Order all news items by the meeting they belong to
    let meetings = [];
    this.data.forEach((newsItem) => {
      let meeting = meetings.find((meeting) => (meeting.id === newsItem.meetingId));
      // Add each meeting to the meetings array
      if (!meeting) {
        const meetingRecord = this.store.findRecord('meeting', newsItem.meetingId, { include: 'type' });
        meeting = {
          id: newsItem.meetingId,
          date: newsItem.meetingDate,
          record: meetingRecord,
          news: [],
          announcements: [],
        }
        meetings.push(meeting);
      }
      // Add all news items to their meeting
      if (newsItem.agendaitemType === 'mededeling') {
        meeting.announcements.push(newsItem);
      } else {
        meeting.news.push(newsItem);
      }
    });
    return meetings;
  }

  @action
  searchNews(params) {
    console.log("Searching")
    this.queryParams.forEach((key) => this.set(key, params[key]));
    this.searchNewsItems.search(params);
  }

  @action
  loadMore() {
    this.searchNewsItems.loadMore();
  }

  @action
  clearParams() {
    this.queryParams.forEach((key) => this.set(key, null));
    this.searchNewsItems.search({});
  }
}
