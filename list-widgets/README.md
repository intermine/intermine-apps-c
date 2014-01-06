# List Widgets

![image](https://raw.github.com/intermine/intermine-apps-c/master/list-widgets/example.png)

Either grab the `build/app.bundle.js` or just `build/app.js`, but then you need to include the libraries defined under `dependencies` of `bower.json` file.

Then, require the list widgets library:

```javascript
// Common.JS Modules 1.1
var ListWidgets = require('list-widgets');

// or Window property
var ListWidgets = window['list-widgets'];

// or Require.JS/AMD
requirejs([ 'list-widgets' ], function(ListWidgets) {
  // ...
});
```

The `build/app.bundle.css` file includes a copy of a [Bootstrap 2](http://getbootstrap.com/2.3.2/) CSS library.

##API

###Root

Will instantiate the app linking to a mine.

```javascript
var widgets = new ListWidgets({ 'root': 'http://beta.flymine.org/beta/service/', 'token': 'password1' });
```

<dl>
  <dt>root</dt>
  <dd>The service endpoint of a mine.</dd>

  <dt>token</dt>
  <dd>An optional token to use (when accessing a list you own).</dd>
</dl>

###All Widgets

Will show all widgets available for a list.

```javascript
widgets.all(type, list, target, options);
```

<dl>
  <dt>type</dt>
  <dd>Type of the list you are accessing.</dd>

  <dt>list</dt>
  <dd>List name, can be public or private, but make sure you have token set.</dd>

  <dt>target</dt>
  <dd>A jQuery selector where to display your widgets.</dd>

  <dt>options.title</dt>
  <dd>An optional boolean property switching title on/off.</dd>

  <dt>options.description</dt>
  <dd>An optional boolean property switching description on/off.</dd>

  <dt>options.matchCb</dt>
  <dd>An optional function property that defines what happens when one clicks on a match item. Is being passed an identifier and type of an item.</dd>

  <dt>options.resultsCb</dt>
  <dd>An optional function property that defines what happens when one clicks on the View Results buttons. Is being passed a PathQuery.</dd>

  <dt>options.listCb</dt>
  <dd>An optional function property that defines what happens when one clicks on the Show List buttons. Is being passed a PathQuery.</dd>
</dl>

###Chart Widget

Will show a chart/graph widget.

```javascript
widgets.chart(id, list, target, options);
```

<dl>
  <dt>id</dt>
  <dd>The id of a widget you are accessing.</dd>

  <dt>list</dt>
  <dd>List name, can be public or private, but make sure you have token set.</dd>

  <dt>target</dt>
  <dd>A jQuery selector where to display your widgets.</dd>

  <dt>options.title</dt>
  <dd>An optional boolean property switching title on/off.</dd>

  <dt>options.description</dt>
  <dd>An optional boolean property switching description on/off.</dd>

  <dt>options.matchCb</dt>
  <dd>An optional function property that defines what happens when one clicks on a match item. Is being passed an identifier and type of an item.</dd>

  <dt>options.resultsCb</dt>
  <dd>An optional function property that defines what happens when one clicks on the View Results buttons. Is being passed a PathQuery.</dd>

  <dt>options.listCb</dt>
  <dd>An optional function property that defines what happens when one clicks on the Show List buttons. Is being passed a PathQuery.</dd>
</dl>

###Enrichment Widget

Will show an enrichment widget.

```javascript
widgets.enrichment(id, list, target, options);
```

<dl>
  <dt>id</dt>
  <dd>The id of a widget you are accessing.</dd>

  <dt>list</dt>
  <dd>List name, can be public or private, but make sure you have token set.</dd>

  <dt>target</dt>
  <dd>A jQuery selector where to display your widgets.</dd>

  <dt>options.title</dt>
  <dd>An optional boolean property switching title on/off.</dd>

  <dt>options.description</dt>
  <dd>An optional boolean property switching description on/off.</dd>

  <dt>options.matchCb</dt>
  <dd>An optional function property that defines what happens when one clicks on a match item. Is being passed an identifier and type of an item.</dd>

  <dt>options.resultsCb</dt>
  <dd>An optional function property that defines what happens when one clicks on the View Results buttons. Is being passed a PathQuery.</dd>

  <dt>options.listCb</dt>
  <dd>An optional function property that defines what happens when one clicks on the Show List buttons. Is being passed a PathQuery.</dd>

  <dt>options.errorCorrection</dt>
  <dd>An optional property specifying the default error correction to be applied. Set to Holm-Bonferroni by default.</dd>

  <dt>options.pValue</dt>
  <dd>An optional (string/float) property specifying the default pValue to be applied. Set to 0.05 by default.</dd>
</dl>

###Table Widget

Will show a table widget.

```javascript
widgets.table(id, list, target, options);
```

<dl>
  <dt>id</dt>
  <dd>The id of a widget you are accessing.</dd>

  <dt>list</dt>
  <dd>List name, can be public or private, but make sure you have token set.</dd>

  <dt>target</dt>
  <dd>A jQuery selector where to display your widgets.</dd>

  <dt>options.title</dt>
  <dd>An optional boolean property switching title on/off.</dd>

  <dt>options.description</dt>
  <dd>An optional boolean property switching description on/off.</dd>

  <dt>options.matchCb</dt>
  <dd>An optional function property that defines what happens when one clicks on a match item. Is being passed an identifier and type of an item.</dd>

  <dt>options.resultsCb</dt>
  <dd>An optional function property that defines what happens when one clicks on the View Results buttons. Is being passed a PathQuery.</dd>

  <dt>options.listCb</dt>
  <dd>An optional function property that defines what happens when one clicks on the Show List buttons. Is being passed a PathQuery.</dd>
</dl>