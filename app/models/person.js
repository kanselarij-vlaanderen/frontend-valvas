import DS from 'ember-data';
const { Model, attr, hasMany } = DS;

export default Model.extend({
	lastName: attr('string'),
	alternativeName: attr('string'),
	firstName: attr('string'),

	mandatees: hasMany('mandatee', { inverse: null })
});
