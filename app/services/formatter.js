import Service from '@ember/service';
import moment from 'moment';

export default class FormatterService extends Service {
  formatDate(date) {
    if (!date) {
      return moment().utc().toDate();
    } else {
      return moment(date).utc().toDate();
    }
  }
}
