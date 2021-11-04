import Model, { attr, belongsTo } from '@ember-data/model';
import mandateTypeFromTitle from 'frontend-valvas/utils/mandate-type-from-title';
import priorityFromMandateType from 'frontend-valvas/utils/priority-from-mandate-type';

export default class MandateeModel extends Model {
  @attr('number') position;
  @attr('date') startDate;
  @attr('date') endDate;
  @attr('string') title;
  @attr('string') valvasTitle;

  @belongsTo('person') person;
  @belongsTo('mandate') mandate;
  @belongsTo('government-body') governmentBody;

  get legacyTitle() {
    return mandateTypeFromTitle(this.title);
  }

  get legacyPosition() {
    return priorityFromMandateType(this.legacyTitle);
  }
}
