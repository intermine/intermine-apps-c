angular.module('myApp.services', []).
    factory('Mine', function ($q) {
        return new intermine.Service({root: 'www.flymine.org/query'});        
    }).
    service('Activities', function($http, $q) {
        this.get = function(from, to){
            var deferred = $q.defer();
            var url = 'user/activities?from='+from+'&to='+to;
            $http.get(url).success(function(data, status) {
                // Some extra manipulation on data if you want...
                deferred.resolve(data);
            }).error(function(data, status) {
                deferred.reject(data);
            });

            return deferred.promise;
        }
    }
);



angular.module('myApp.myFilters', []).filter('object2Array', function() {
    return function(input) {
      var out = []; 
      for(i in input){
        out.push(input[i]);
      }
      return out;
    }
 });



angular.module('myApp.modules', []).
factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});



var myApp = angular.module('myApp', ['myApp.services', 'myApp.modules', 'myApp.myFilters']);

myApp.directive('donutChart', function() {
    function link(scope, el) {

        var dataset = {
          apples: [53245, 28479, 19697, 24037, 40245],
        };

        var el = el[0]

        var width = el.clientWidth;
        var height = el.clientHeight;
        var radius = (width, height) / 2;

        var color = d3.scale.category20();

        var pie = d3.layout.pie()
            .sort(null);

        var arc = d3.svg.arc()
            .innerRadius(radius - 100)
            .outerRadius(radius - 50);

        var svg = d3.select(el).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var path = svg.selectAll("path")
            .data(pie(dataset.apples))
          .enter().append("path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", arc);

    }
    return {
        link: link,
        restrict: 'E'
    }
});


myApp.directive('networkChart', function() {
    function link(scope, el) {

        var el = el[0];
        // get the data
        d3.csv("force.csv", function(error, links) {



            

        var nodes = {};

        // Compute the distinct nodes from the links.
        links.forEach(function(link) {
            link.source = nodes[link.source] || 
                (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || 
                (nodes[link.target] = {name: link.target});
            link.value = +link.value;
        });






        var width = 500,
            height = 400;

        //     var width = el.clientWidth;
        // var height = el.clientHeight;

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(100)
            .charge(-300)
            .on("tick", tick)
            .start();

        var svg = d3.select(el).append("svg")
            .attr("width", width)
            .attr("height", height);

        



        // build the arrow.
        var marker = svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
          .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 18)
            .attr("refY", -1.5)
            .attr("markerWidth", 8)
            .attr("markerHeight", 8)
            .attr("orient", "auto")
            .attr("class", "link")
          .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        // // add the links and the arrows
        // var path = svg.append("svg:g").selectAll("path")
        //     .data(force.links())
        //   .enter().append("svg:path")
        //     .attr("class", "link")
        //     .attr("marker-end", "url(#end)");

            // add the links and the arrows
        var link = svg.append("svg:g").selectAll("path")
            .data(force.links())
          .enter().append("svg:path")
            .attr("class", "link")
            .attr("marker-end", "url(#end)");

        // define the nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
          .enter().append("g")
            .attr("class", "node")
            .on("click", click)
            .call(force.drag)
            .on("mouseover", fade(.15))
            .on("mouseout", fade(1));
            

        // add the nodes
        node.append("circle")
            .attr("r", 6)
            .attr("class", isParent);
            

        // add the text 
        node.append("text")
            .attr("x", 12)
            .attr("dy", "1em")
            .text(function(d) { return d.name; });

        

        var linkedByIndex = {};
        links.forEach(function(d) {
            linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });

        links.forEach(function(link) {
            console.log("link: ", link);
            var source = link.source;
            console.log("-- source:", source);
        });

        function click(d) {
            console.log("clicked: ", d);
        }

        function isParent(d) {
            sourceNames = [];
            console.log("isParent: ", d.name);
            // build an array of source genes
            links.forEach(function(o) {
                sourceNames.push(o.source.name);
            });

            if (_.contains(sourceNames, d.name)) {
                console.log("parent");
                return "parent";
            } else {
                console.log("child");
                return "child";
            }

        }

        




        function fade(opacity) {
        return function(d) {


            node.style("stroke-opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });

            node.style("stroke-opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                this.setAttribute('fill-opacity', thisOpacity);
                return thisOpacity;
            });


            link.style("opacity", function(o) {
                console.log("inside link style: ", o);
                return o.source === d || o.target === d ? 1 : opacity;
            });



        };
        }

        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        }







          // Toggle children on click.
        // function click(d) {
        //   // if (d.children) {
        //   //   d._children = d.children;
        //   //   d.children = null;
        //   // } else {
        //   //   d.children = d._children;
        //   //   d._children = null;
        //   // }
        //   console.log(d);
        // }

        // add the curvy lines
        function tick() {
            link.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + 
                    d.source.x + "," + 
                    d.source.y + "A" + 
                    dr + "," + dr + " 0 0,1 " + 
                    d.target.x + "," + 
                    d.target.y;
            });

            node
                .attr("transform", function(d) { 
                return "translate(" + d.x + "," + d.y + ")"; });
    }

});



    }
    return {
        link: link,
        restrict: 'E'
    }
});



myApp.filter('orderObjectBy', function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseFloat(a[attribute]);
        b = parseFloat(b[attribute]);
        return a - b;
    });
    return array;
 }
});



myApp.controller('controller', ['$scope', '$http', function ($scope, $http) {

    $scope.orderByAttribute = '';


}]).controller('appController', function ($scope, $http, $q, $log, $timeout, Mine, _) {

    // $scope.commonItems = {commonitems: []};

    $scope.imObjects = [];
    $scope.orgSearch;

    $scope.$on('LOAD',function(){$scope.loading=true});
    $scope.$on('UNLOAD',function(){$scope.loading=false});

    var flymine = Mine
    // oids = [19071979, 19071980, 19071987];
      , oids = [19012567, 19071979, 19071980, 19071987, 19072022, 86000919, 35000020, 35000003, 86000156, 86000153, 86000160, 86000157, 86000178, 86000161, 86000268, 86000190, 86000271, 86000269, 86000272, 86000273, 86000275, 86000277, 86000278, 86000407, 86000409, 86000414, 86000557, 86000575, 86000659, 86000890, 86000902, 86000906, 86000907, 86000916, 86000505, 86000191];

    convertObjs = function(ids, scopeVariable) {

        var types = ['ProteinDomain', 'Pathway'];
        // var promises = new Array();

        //////////////////
        var deferred = $q.defer();

        var arrPromise = [];

        for (type in types) {
            var q = getQuery(types[type], ids);
            var nextPromise = convertOneSet(ids, types[type]);
            arrPromise.push(nextPromise);

        }

        $q.all(arrPromise).then(function(all) {

            var emptyArray = [];

            for (var i = 0; i < all.length; i++) {
                emptyArray = emptyArray.concat(all[i]);

            }

            deferred.resolve(emptyArray);

        });



       // // if (!$scope.commonItems) return;
       //  $log.info("Making request in convertOjbs");
       //  //var q = getQuery('ProteinDomain', $scope.commonItems.commonitems),
       //  var q = getQuery('Pathway', ids);
       //  flymine.records(q).then(function (rs) {

       //      console.log("RS: ", rs);
       //     // $scope.imObjects = rs;
       //     deferred.resolve(rs);
       //      $scope.$apply();
       //      return rs;
       //  });

        return deferred.promise;

    };

    $scope.warn = function(id) {
            var value = $scope.dataMap[id];
            return value.symbol;
    };

    $scope.getClass = function(id) {
            // // var value = $scope.dataMap[id];
            // if (id == $scope.selectedSourceGene.symbol) {
            //     return "selected";
            
            // } else {
            //     return null;
            // }
    };

    $scope.isSelectedSource = function(id) {
            // var value = $scope.dataMap[id];
            console.log("isSelectedSource called with ", id);


            if (id == $scope.selectedSourceGene.objectId) {
                return "selectedsources";
            } else {
                return "unselectedsources";
            }


    };

    $scope.isCommonTarget = function(id) {
            // var value = $scope.dataMap[id];
            console.log("isCommonTarget called with ", id);
            var me = $scope.resolvedResultsArr[id];

            var myResolution = _.findWhere($scope.resolvedResultsArr, {objectId: id});
            var myCommonItems = myResolution.commonitems;

            if (myCommonItems.hasOwnProperty($scope.selectedSourceGene.objectId)) {
                return "selectedtargets";
            } else {
                return "unselectedtargets"
            }

    };

    $scope.setSelectedSourceGene = function(id) {
            $scope.selectedSourceGene = $scope.dataMap[id];
            console.log("selectedSourceGene",  $scope.selectedSourceGene);
    };

    $scope.setCommonGene = function(item) {

        console.log("resolvedResultArra", $scope.resolvedResultsArr);

        $scope.common = $scope.dataMap[item];

        var split = _.findWhere($scope.resolvedResultsArr, {objectId: item});
        $scope.commonItems = split.commonitems;
        console.log("splitcommonitems", $scope.commonItems);

        // var ids = [];

        var idsInSelf = [];
        for (var nextItem in split.commonitems[item]) {
            console.log("NEXT ITEM", nextItem);
        }

        // for (nextItem in split.commonitems) {
        //     if (item != nextItem)  {
        //         console.log("FOUND ME");
        //         var array1 = split.commonitems[item];
        //         var array2 = split.commonitems[nextItem];
        //         console.log("arary1" + item, array1);
        //         console.log("arary2" + nextItem, array2);
        //         var inter = _.intersection(array1, array2);
        //         console.log("intersection, ", inter);
        //     }
        // }

        // console.log(values);

        var intersection = _.intersection(values);
        console.log("intersection", intersection);


    };

    $scope.fetchMap = function(id) {
        alert($scope.dataMap[id]);
        return $scope.dataMap[id];

    };







    buildMap = function(results) {

   //      {
   // "1025450":{
   //    "score:":25,
   //    "commonitems":{
   //       "1005555":[
   //          35000010
   //       ],
   //       "1010602":[
   //          19001462,
   //          19001463,
   //          19001464,
   //          35000011,
   //          35000010
   //       ],
   //       "1025450":[
   //          19001464,
   //          19001463,
   //          19001462,
   //          35000011,
   //          35000010
   //       ]

        var allObjIds = [];
      

        console.log("buildMap called with", results);

        // Get all of the unique Object IDs from our results:
        for (var key in results) {

          

            // First push our key
            allObjIds.push(parseInt(key));

            // Now walk through the key(similar gene)'s common items and get those ids
            var nextSimilarGene = results[key];


            for (var commonKey in nextSimilarGene.commonitems) {



                allObjIds.push(parseInt(commonKey));

                arrValue = nextSimilarGene.commonitems[commonKey];
                for (var x = 0; x < arrValue.length; x++) {
                    allObjIds.push(arrValue[x]);
                }

            }
            
        }



        for (item in $scope.orgSearch) {
            allObjIds.push($scope.orgSearch[item]);
        }

        var uniqueObjIds = _.uniq(allObjIds);


        var types = ['ProteinDomain', 'Pathway', 'Gene'];
        // var promises = new Array();

        //////////////////
        var deferred = $q.defer();

        var arrPromise = [];

        for (type in types) {
            var q = getQuery(types[type], uniqueObjIds);
            var nextPromise = convertOneSet(uniqueObjIds, types[type]);
            arrPromise.push(nextPromise);

        }

        $q.all(arrPromise).then(function(all) {

            var emptyArray = [];

            for (var i = 0; i < all.length; i++) {
                emptyArray = emptyArray.concat(all[i]);

            }



            

            // Now build our our objectmap:

            var geneMap = {};

            for (item in emptyArray) {
                var nextItem = emptyArray[item];
                var id = nextItem.objectId;
                geneMap[id] = nextItem;

            }

            deferred.resolve(geneMap);

        });

        return deferred.promise;

    };


    $scope.talk = function(test) {
        $scope.filterItem = test;
        console.log("filter set to ", $scope.filterItem);
    };

    $scope.clearFilter = function() {
        $scope.filterItem = "";
    };

    convertOneSet = function(ids, scopeVariable) {

        var deferred = $q.defer();

        var q = getQuery(scopeVariable, ids);
        flymine.records(q).then(function (rs) {


           // $scope.imObjects = rs;
           deferred.resolve(rs);
            $scope.$apply();
            return rs;
        });

        return deferred.promise;

    };

    // convertObjs = function(ids, scopeVariable) {

    //     var types = ['ProteinDomain'];
    //     // var promises = new Array();

    //     //////////////////
    //     var deferred = $q.defer();

    //    // if (!$scope.commonItems) return;
    //     $log.info("Making request in convertOjbs");
    //     //var q = getQuery('ProteinDomain', $scope.commonItems.commonitems),
    //     var q = getQuery('Pathway', ids);
    //     flymine.records(q).then(function (rs) {

    //         console.log("RS: ", rs);
    //        // $scope.imObjects = rs;
    //        deferred.resolve(rs);
    //         $scope.$apply();
    //         return rs;
    //     });

    //     return deferred.promise;

    // };

    getGeneInfo = function(ids, scopeVariable) {

        // var types = ['ProteinDomain'];
        // var promises = new Array();

        //////////////////
        var deferred = $q.defer();

        // if (!$scope.commonItems) return;
        $log.info("Making request");
        //var q = getQuery('ProteinDomain', $scope.commonItems.commonitems),
        var q = getQuery('Gene', ids);
        flymine.records(q).then(function (rs) {
            $scope[scopeVariable] = rs;
            deferred.resolve(rs);
            $scope.$apply();

        });

        return deferred.promise;

    };

    function success(data) {

       masterArray = new Array();
        for (var i = 0; i < data.length; i++) {
            var nextDataSet = data[i];
            for (x = 0; x < nextDataSet.length; x++) {
                masterArray.push(nextDataSet[x]);
            }
        }
        $scope.finalResults = masterArray;
        $scope.commonItems = masterArray;
    };
        

    // for (var i = 0; i < 5; i++) {
    //     $scope.imObjects.push("test");
    // }



    function getQuery(root, ids) {

        var query = {
        "from": root,
        "select":["*"],
        "where":
            [
                {"path":root,"op":"IN","ids":ids.slice()}
            ]
        }
        return query;
    }

    function getQuery(root, ids) {

        var query = {
        "from": root,
        "select":["*"],
        "where":
            [
                {"path":root,"op":"IN","ids":ids.slice()}
            ]
        }
        return query;
    }







    $scope.getSimilarGenes = function(gene) {

        //gene = gene.replace(/^\s+|\s+$/g,"").split(/\s*,\s*/);
        gene =["Act88F","ade3","Arr2","ap","CG2650","Dll"];
        //var gene =["Act88F"];
        $scope.getCommonItems();


        $scope.$emit("LOAD");

        $scope.searchTerms = gene;

        var config = {
            params: {
                'callback': "json_callback"
            }
        }

        $http.get("testdata/mostsimilar.json", config, {}).success(function (data) {



            ids = [];

            for (item in data) {
               ids.push(data[item].name);
            }

            console.log("using gene list ", ids);

            // Get a promise to resolve our genes as InterMine Objects
            var rs = getGeneInfo(ids, "commonGenes");

            // Resolve the promise and reattach the scores to the objects
            $q.when(rs).then(
                function(values){
                    // Re attach the score to the objects
                    for (nextResult in values) {

                        var originalMatch = _.findWhere(data, {"name": values[nextResult].objectId.toString()});
                        _.extend(values[nextResult], {score: originalMatch.score});

                    }

                    $scope.commonGenes = values;
                }


            );

            $scope.testData = data
            $scope.$emit("UNLOAD");
        });

    };

    $scope.getCommonItems = function() {



        $scope.$emit("LOAD");

        //console.log("getCommonItems called with ", searchValue);

        var config = {
            params: {
                'callback': "json_callback"
            }
        }


        $http.get("testdata/commonitems.json", config, {}).success(function (rawResults) {

            // Now convert out list of IDs to items:

            // {
            // "1025450": {
            //     "1005555": [35000010],
            //     "1010602": [19001462, 19001463, 19001464, 35000011, 35000010],
            //     "1025450": [19001464, 19001463, 19001462, 35000011, 35000010]
            //     }
            // }

            // var commmonItems2 = data[value];

            // console.log("commonitems", commmonItems2);

            // if(!commmonItems2) {

            //     $scope.selectedCommonGene = _.findWhere($scope.commonGenes, {"objectId": parseInt(value)});
            //     console.log("selectedCommonGene", $scope.selectedCommonGene);


            //     $scope.commonItems = null;
            //     $scope.$emit("UNLOAD");
            //     return;
            // }

            // ids = [];


            // for (item in commmonItems2.commonitems) {
            //     var nextItem = commmonItems2.commonitems[item];
            //     ids.push(nextItem);
            // }

            // console.log("DATA", data);

             var search = [1010602,1095690,1005555,1005289,1503950,1032942];
            $scope.orgSearch = search;
            

            var rs = buildMap(rawResults);

            // Now that we have our data map

            // We will need this to map our data.

            $q.when(rs).then(
                function(dataMap){

                    console.log("dataMap: ", dataMap);
                    $scope.dataMap = dataMap;
                    // console.log("rawResults:", rawResults);

                    //["Act88F","ade3","Arr2","ap","CG2650","Dll"];
                   


                    $scope.searchTerms = [];

                    for (item in search) {

                        $scope.searchTerms.push(dataMap[search[item]]);
                    }



                    

                    // Set up our search terms for DEMO
                    // Restructure our rawResults using our dataMap
                    for (item in rawResults) {

                        nextResult = rawResults[item];
                        var mapped = dataMap[item];
                        // console.log("MAPPED", mapped); 
                        // Extend this property with the data from the dataMap
                        _.extend(nextResult, mapped);

                        // Now do our common items
                        for (commonItem in nextResult.commonitems) {

                            //console.log("COMMON ITEM", commonItem);
                            var foundMap = dataMap[commonItem];
                            //console.log("foundMap", foundMap);

                            //_.extend(nextResult.commonitems[commonItem], dataMap[commonItem]);

                            // convert our arrays to objects

                            var tempArray = [];

                            for (var i = 0; i < nextResult.commonitems[commonItem].length; i++) {
                                //console.log("anItem", nextResult.commonitems[commonItem][i]);
                                tempArray.push(dataMap[nextResult.commonitems[commonItem][i]]);
                            }

                            nextResult.commonitems[commonItem] = tempArray;



                            // Now walk through each array in the common items
                        }
                    }

                    console.log("finalResults:", rawResults);

                    $scope.resolvedResultsArr = [];

                    $scope.resolvedResults = rawResults;

                    for ( item in rawResults) {
                        $scope.resolvedResultsArr.push(rawResults[item]);
                    }

                    console.log("resolvedResultsArr: ", $scope.resolvedResultsArr);




                    // Re attach the score to the objects
                    // for (nextResult in values) {

                    //     var originalMatch = _.findWhere(data, {"name": values[nextResult].objectId.toString()});
                    //     _.extend(values[nextResult], {score: originalMatch.score});

                    // }

                    // Pluck our classes:
                    var classes = _.pluck(dataMap, 'class');
                    var uniqueClasses = _.uniq(classes);

                    $scope.countBy = _.countBy(dataMap, function(item) {
                        return item.class;
                    });


                    $scope.filterItem = "";
                    $scope.commonItems = dataMap;


                    //////////// CSV

                    var csv = "";

    
                    for (item in $scope.resolvedResultsArr) {
                        var nextItem = $scope.resolvedResultsArr[item];
                        // console.log("nextItem", nextItem.symbol);

                        var commonItems = nextItem.commonitems;
                        for (key in commonItems) {
                            if (key != nextItem.objectId) {
                                var fromMap = dataMap[key];
                                // console.log("looking for ", key);
                                // console.log("fromMap", fromMap);
                                csv += fromMap.symbol + "," + nextItem.symbol + ",0\n";
                            }
                        }
                        console.log("---commonitems", commonItems);

                    }

                    console.log(csv);

                    //$scope.commonItems = values

                    //var foundValue = rawResults[searchValue];
                    //console.log("foundValue", foundValue);

                    //console.log("similar genes", $scope.commonGenes)

                    //$scope.selectedCommonGene = _.findWhere($scope.commonGenes, {"objectId": parseInt(searchValue)});
                    //console.log("selectedCommonGene", $scope.selectedCommonGene);

                }


            );

            //var all = convertObjs(data[value]);
           // all.then(success)

            // Show our array of promises:
            //console.log("everything", conversionPromise);



            // $q.when(conversionPromise).then(function(values){soundoff()});

            $scope.$emit("UNLOAD");

        });

    };







    




    $scope.hideLoading = function() {
        $scope.$emit("UNLOAD");
    };

    $scope.soundoff = function() {
        alert("soundoff");
    };



    
});


