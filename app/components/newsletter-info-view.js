import Component from '@ember/component';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  isLongText: false,
  showGeenDocumenten: false,

  didReceiveAttrs() {
    if (this.newsletterInfo.htmlContent) {
      this.set('textToDisplay', htmlSafe(this.newsletterInfo.htmlContent));
    } else {
      this.set('textToDisplay', this.newsletterInfo.text);
    }

    if (this.textToDisplay.length > 500) {
      this.set('shortenText', this.textToDisplay.substr(0, 501) + "...");
      this.set('isLongText', true);
    }
  },

  actions: {
    readMore() {
      this.set('isLongText', false);
    }
  }
});
