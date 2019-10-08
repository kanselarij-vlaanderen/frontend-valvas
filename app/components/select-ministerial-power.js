import Component from '@ember/component';
import { inject as service } from '@ember/service';

const defaultOption = { label: 'Alle bevoegdheden' };

export default Component.extend({
  store: service(),

  tagName: '',

  async init() {
    this._super(...arguments);
    const ministerialPowers = await this.store.query('theme', {
      page: { size: 1000 }
    });
    const options = ministerialPowers.map( (m) => {
      return {
        id: m.id,
        label: m.label.charAt(0).toUpperCase() + m.label.slice(1),
        count: null
      };
    }).sortBy('label');
    this.set('options', [ defaultOption, ...options ]);
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
