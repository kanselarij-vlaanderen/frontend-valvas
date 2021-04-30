import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import mandateTypeFromTitle from 'frontend-valvas/utils/mandate-type-from-title';
import priorityFromMandateType from 'frontend-valvas/utils/priority-from-mandate-type';

export default class MandateeModel extends Model {
  @attr('number') position;
  @attr('date') startDate;
  @attr('date') endDate;
  @attr('string') title;
  @attr('string') alternativeTitle;

  @belongsTo('person') person;
  @belongsTo('mandate') mandate;
  @belongsTo('government-body') governmentBody;

  @computed('title')
  get legacyTitle() {
    return mandateTypeFromTitle(this.title);
  }

  @computed('legacyTitle')
  get legacyPosition() {
    return priorityFromMandateType(this.legacyTitle);
  }
}
