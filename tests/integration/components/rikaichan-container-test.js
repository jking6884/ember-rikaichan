import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('rikaichan-container', 'Integration | Component | rikaichan container', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{rikaichan-container}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#rikaichan-container}}
      template block text
    {{/rikaichan-container}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
