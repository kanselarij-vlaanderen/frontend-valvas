import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const defaultOption = { label: 'Alle ministers' };
const mededelingOption = { id: 'vr', label: 'de Vlaamse Regering' };
const historicOption = { id: 'historic', label: 'Vorige ministers' };

export default class SelectPresentedByComponent extends Component {
  @service store;

  @tracked tagName = '';
  @tracked options = [defaultOption, mededelingOption, historicOption];
  @tracked historicOptions = [];
  @tracked selected = null;
  @tracked selectedHistoric = null;

  async init() {
    super.init(...arguments);
    const { options, historicOptions } = await this.loadOptions();
    this.options = [defaultOption, ...options, mededelingOption, historicOption];
    this.historicOptions = historicOptions;
    this.setSelectedOptionForSelectedId();
  }

  didReceiveAttrs() {
    super.init(...arguments);
    this.setSelectedOptionForSelectedId();
  }

  @computed('selected')
  get isEnabledHistoricOption() {
    return !!this.selected ? this.selected.id === 'historic' : false;
  }

  async loadOptions() {
    // Obtain unique list of current mandatees
    const currentGovernmentBodyArray = await this.store.query('government-body', {
      page: { size: 1 },
      filter: {
        ':has:start-date': true,
        ':has-no:end-date': true,
        ':has:mandatees': true,
      },
      include: 'mandatees.person',
    });
    const currentGovernmentBody = currentGovernmentBodyArray.firstObject;
    const currentMandatees = !!currentGovernmentBody ? await currentGovernmentBody.mandatees : [];
    const currentMandateesAndPersons = await Promise.all(currentMandatees.map(async (mandatee) => ({
      mandatee,
      person: await mandatee.person,
    })));
    let options = [];
    for await (const { mandatee, person } of currentMandateesAndPersons) {
      let option = options.find((option) => (option.id === person.id));
      if (!option) {
        options.push({
          id: person.id,
          position: mandatee.position,
          firstName: person.firstName,
          lastName: person.lastName,
          label: person.fullName,
        });
      }
    }
    options = options.sort((a, b) => (a.position - b.position));

    const activePersonIds = options.map((option) => (option.id));
    const allPersons = await this.store.query('person', {
      page: { size: 1000 }
    });
    const inactivePersons = allPersons.filter((person) => (!activePersonIds.includes(person.id)));
    let historicOptions = inactivePersons.map((person) => ({
      id: person.id,
      position: null,
      firstName: person.firstName,
      lastName: person.lastName,
      label: person.fullName,
    })).sort((a, b) => (a.lastName > b.lastName));

    return { options, historicOptions }
  }

  setSelectedOptionForSelectedId() {
    if (!!this.options && !!this.historicOptions) {
      let selected = null;
      let selectedHistoric = null;
      let id = this.selectedId;
      if (!!id) {
        selected = this.options.find((option) => (option.id === id));
        if (!selected) {
          selected = historicOption;
          selectedHistoric = this.historicOptions.find((option) => (option.id === id));
        }
      } else {
        selected = defaultOption;
      }
      this.selected = selected;
      this.selectedHistoric = selectedHistoric;
    }
  }

  @action
  async onChangeOption(selected) {
    this.selected = selected;
    if (!!selected && selected.id !== 'historic' && this.selectedId !== selected.id) {
      this.onChange(selected.id, selected.firstName, selected.lastName);
    }
    return;
  }

  @action
  async onChangeHistoricOption(selected) {
    this.selectedHistoric = selected;
    if (!!selected && this.selecteddId !== selected.id) {
      this.onChange(selected.id, selected.firstName, selected.lastName);
    }
    return;
  }
}
