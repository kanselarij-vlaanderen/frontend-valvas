import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

export default class NewsItemInfoModel extends Model {
  @attr("string") title;
  @attr("string") subtitle;
  @attr("date") publicationDate;
  @attr("string") text;
  @attr("string") richtext;
  @attr("number") position;

  @hasMany("mandatee") mandatees;
  @hasMany("attachment") attachments;
  @belongsTo("calendar-item") calendarItem;
}
