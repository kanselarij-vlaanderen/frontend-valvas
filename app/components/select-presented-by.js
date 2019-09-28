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
        lastName: person.lastName,
        label: `${person.firstName} ${person.lastName}`,
        count: null
      };
    }))).sortBy('lastName');
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
      const selected = this.selectedId ? this.options.find(o => o.id == this.selectedId) : defaultOption;
      this.set('selected', selected);
    }
  },

  actions: {
    onChange(selected) {
      this.set('selected', selected);
      if (this.selectedId != selected.id)
        this.onChange(selected.id);
    }
  }
});
