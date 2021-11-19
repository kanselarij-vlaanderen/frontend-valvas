import Model, { attr, belongsTo } from '@ember-data/model';

export default class MeetingModel extends Model {
  @attr('date') plannedStart;
  @attr('string') location;
  @attr('string') identifier;
  @attr('date') plannedPublicationDate;

  @belongsTo('concept') type;
}
