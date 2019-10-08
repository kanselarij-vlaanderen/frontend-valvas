import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';

const defaultOption = { label: 'Alle ministers' };
const mededelingOption = { id: 'vr', label: 'de Vlaamse Regering' };
const historicOption = { id: 'historic', label: 'Vorige ministers' };

export default Component.extend({
  store: service(),

  tagName: '',

  isEnabledHistoricOption: equal('selected.id', 'historic'),

  async init() {
    this._super(...arguments);
    const { options, historicOptions } = await this.loadOptions();
    this.set('options', [ defaultOption, ...options, mededelingOption, historicOption ]);
    this.set('historicOptions', historicOptions);
    this.setSelectedOptionForSelectedId();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.setSelectedOptionForSelectedId();
  },

  async loadOptions() {
    const mandatees = await this.store.query('mandatee', {
      page: { size: 100 },
      sort: '-start',
      include: 'person',
      'filter[:exact:active-status]': 'active'
    });
    const options = (await Promise.all(mandatees.map( async (m) => {
      const person = await m.person;
      return {
        id: person.id,
        priority: m.priority,
        firstName: person.firstName,
        lastName: person.lastName,
        label: `${person.firstName} ${person.lastName}`,
        count: null
      };
    }))).sortBy('priority');
    const activePersonIds = options.map(o => o.id);

    const allPersons = await this.store.query('person', {
      page: { size: 1000 }
    });
    const inactivePersons = allPersons.filter(p => !activePersonIds.includes(p.id));
    const historicOptions = (await Promise.all(inactivePersons.map( async (person) => {
      return {
        id: person.id,
        firstName: person.firstName,
        lastName: person.lastName,
        label: `${person.firstName} ${person.lastName}`,
        count: null
      };
    }))).sortBy('lastName');

    return { options, historicOptions };
  },

  /* Select correct option for ember-power-select if selectedId is changed by external component */
  setSelectedOptionForSelectedId() {
    if (this.options && this.historicOptions) {
      let selected = null;
      let selectedHistoric = null;
      if (this.selectedId) {
        selected = this.options.find(o => o.id == this.selectedId);
        if (!selected) {
          selected = historicOption;
          selectedHistoric = this.historicOptions.find(o => o.id == this.selectedId);
        }
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
      this.set('selectedHistoric', selectedHistoric);
    }
  },

  actions: {
    async onChange(selected) {
      this.set('selected', selected);
      if (selected && selected.id != 'historic') {
        if (this.selectedId != selected.id) {
          this.onChange(selected.id, selected.firstName, selected.lastName);
        }
      }
    },
    async onChangeHistoric(selected) {
      this.set('selectedHistoric', selected);
      if (this.selectedId != selected.id) {
        this.onChange(selected.id, selected.firstName, selected.lastName);
      }
    }
  }
});
