import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const defaultOption = { label: 'Alle bevoegdheden' };

export default class SelectMinisterialPowerComponent extends Component {
  @service store;

  tagName = '';
  @tracked options = [defaultOption];
  @tracked selected = null;

  async init() {
    super.init(...arguments);
    const options = await this.loadOptions();
    this.options = [defaultOption, ...options];
    this.setSelectedOptionForSelectedId();
  }

  didReceiveAttrs() {
    super.init(...arguments);
    this.setSelectedOptionForSelectedId();
  }

  async loadOptions() {
    let themes = await this.store.query('concept', {
      page: { size: 1000 },
      filter: {
        'in-scheme': {
          ':exact:label': `Thema's`,
        },
      },
    });
    const options = themes.map((theme) => ({
      id: theme.id,
      label: theme.label,
      count: null,
    })).sort((a, b) => (a.label > b.label));
    return options;
  }

  setSelectedOptionForSelectedId() {
    if (this.options) this.selected = this.selectedId ? this.options.find((option) => (option.id === this.selectedId)) : defaultOption;
  }

  @action
  onChangeOption(selected) {
    this.selected = selected;
    if (this.selectedId !== selected.id) {
      this.onChange(selected.id);
    }
  }
}
