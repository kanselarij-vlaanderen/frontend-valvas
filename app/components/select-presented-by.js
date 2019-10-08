import Component from '@ember/component';
import { inject as service } from '@ember/service';

const defaultOption = { label: 'Alle ministers' };
const historicOption = { id: -1, label: 'Vorige ministers' };

export default Component.extend({
  store: service(),

  async init() {
    this._super(...arguments);
    const mandatees = await this.store.query('mandatee', {
      page: { size: 100 },
      sort: '-start',
      include: 'person',
      'filter[:exact:active-status]': 'active'
    });
    const options = (await Promise.all(mandatees.map( async (m) => {
      const person = await m.person;
      return {
        id: m.id,
        priority: m.priority,
        firstName: person.firstName,
        lastName: person.lastName,
        label: `${person.firstName} ${person.lastName}`,
        count: null
      };
    }))).sortBy('priority');
    this.set('options', [ defaultOption, ...options, historicOption ]);
    this.setSelectedOptionForSelectedId();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.setSelectedOptionForSelectedId();
  },

  /* Select correct option for ember-power-select if selectedId is changed by external component */
  setSelectedOptionForSelectedId() {
    if (this.options) {
      let selected = null;
      if (this.selectedId) {
        selected = this.options.find(o => o.id == this.selectedId);
      } else if (this.selectedFirstName || this.selectedLastName) {
        selected = {
          id: 'placeholder',
          firstName: this.selectedFirstName,
          lastName: this.selectedLastName,
          label: `${this.selectedFirstName} ${this.selectedLastName}`,
          count: null
        };
      } else {
        selected = defaultOption;
      }
      this.set('selected', selected);
    }
  },

  actions: {
    async onChange(selected) {
      this.set('selected', selected);
      if (this.selectedId != selected.id) {
        this.onChange(selected.id, selected.firstName, selected.lastName);
      }
    }
  }
});
