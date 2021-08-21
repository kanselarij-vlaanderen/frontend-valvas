import { modifier } from 'ember-modifier';

export default modifier((element, [url]) => {
  vl.widget.client.bootstrap(url).then(function(widget) {
    return widget.setMountElement(element).mount();
  });
});
