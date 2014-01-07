# Pathways Displayer

A cross-mine Pathways Displayer.

### DESCRIPTION

The Pathways Displayer reveals genetic pathways from different organisms and mines that are linked by homologous genes. The following logic is used:

1) Build a list of homologues from a mine for a given identifier ignoring paralogues when possible.
2) Query that mine for pathways that contain homologues from step 1.
3) Repeat for all known mines.

Clicking on a circle in an organism column reveals more detailed information including the data source and links to the homologous gene(s) in their respective mines.

### INSTALLATION

The Pathways Displayer is embedded into the InterMine Reports Displayer by default and requires the following configurations:

1) Define the following properties in global.web.properties 

/intermine/webapp/main/resources/webapp/WEB-INF/global.web.properties

```properties
# Pathways Displayer on a Report Page.
head.js.pathways-displayer.PathwaysDisplayer = CDN/js/intermine/apps-c/pathways-displayer/0.0.1/app.js
head.js.pathways-displayer.Q = CDN/js/q/0.9.7/q.min.js
head.js.pathways-displayer.jQuery = CDN/js/jquery/2.0.3/jquery.min.js
head.js.pathways-displayer._ = CDN/js/underscore.js/1.5.2/underscore-min.js
head.js.pathways-displayer.Backbone = CDN/js/backbone.js/1.1.0/backbone-min.js
head.css.pathways-displayer.pathwaysDisplayerCSS = CDN/js/intermine/apps-c/pathways-displayer/0.0.1/pathways-displayer.css
```

2) Define the following HTML elements on a JSP that is displayed on the Reports Page.

```html
<div id="minepathwaysdisplayer-wrapper" class="wrapper" style="display: block;">

  <div id="mine-pathway-displayer" class="collection-table column-border">

    <div class="header">
      <h3>Pathways from Other Mines</h3>
      <p>Pathway data from other Mines for homologues of this gene.</p>
    </div>

    <div id="pathwaysappcontainer"></div>


  </div>
</div>
```

3) Include the following script using the InterMine API Loader

```js
<script>

(function(){

  var $ = jQuery;

  var paths = {js: {}, css: {}};

  <c:set var="section" value="pathways-displayer"/>

  <c:forEach var="res" items="${imf:getHeadResources(section, PROFILE.preferences)}">
    
      paths["${res.type}"]["${res.key}".split(".").pop()] = "${res.url}";
  </c:forEach>

  var imload = function(){
    intermine.load({
      'js': {
          'Q': {
            'path': paths.js.Q
          },
          'jQuery': {
            'path': paths.js.jQuery,
            'test': function(){
              if (+($.fn.jquery.split(".")[0]) < 2) {
                throw "Version error.";
              }
            }
          },
          'Backbone': {
            'path': paths.js.Backbone,
            'depends': ['_', 'jQuery']
          },
          '_': {
            'path': paths.js._
          },
          'PathwaysDisplayer': {
            'path': paths.js.PathwaysDisplayer,
            'depends': ['Q', 'Backbone']
          }
      },
      'css': {
        'pathwaysDisplayerCSS': {
          'path': paths.css.pathwaysDisplayerCSS
        }
      }
    }, function(err) {

      if (err) throw err;

      friendlyMines = {};

      <c:forEach items="${minesForPathways}" var="entry">
        friendlyMines["${entry.key.name}"] = "${entry.key.url}";
      </c:forEach>

        friendlyMines['${localMine.name}'] = "${localMine.url}";

        require('PathwaysDisplayer')(
        {
          friendlyMines: friendlyMines,                        
          gene: "${gene.primaryIdentifier}",
          target: "#pathwaysappcontainer",
          themeColor: "${localMine.bgcolor}"
        });

    });
  };

  try {

    imload();

  } catch (error) {
    $('#pathwaysappcontainer').html(
      $('<div/>', {'text': 'This app requires jQuery 2.x.x', 'style': 'padding-left: 14px; font-weight: bold'})
    );

    $('#mine-pathway-displayer').addClass("warning");
  }
})();

</script>
```


