/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-axis does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-interactive-axis basic setup works', function() {
    var multiScale,
        multiSVG,
        multiAxis;

    suiteSetup(function(done){
      multiScale = document.getElementById('multiScale');
      multiSVG = document.getElementById('multiSVG');
      multiAxis = document.getElementById('multiAxis');
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2'],
            "y":['y','y1','y2'],
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y','y1','y2'],
        w = 500,
        h = 500,
        ext = {'x': dim, 'y':[1,10], 'y1':[1,20], 'y2':[1,27]},
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      var scaleSet = function() {
        multiAxis.set('y',multiScale.y.y);
        multiScale.removeEventListener('px-vis-y-updated', scaleSet);
      };

      var axisDone = function() {
        multiAxis.removeEventListener('px-axis-done', axisDone);
        done();
      };

      multiAxis.addEventListener('px-axis-done', axisDone);
      multiScale.addEventListener('px-vis-y-updated', scaleSet);

      multiSVG.set('width',w);
      multiSVG.set('height',h);
      multiSVG.set('margin',m);

      multiScale.set('commonAxis',false);
      multiScale.set('width',w);
      multiScale.set('height',h);
      multiScale.set('margin',m);
      multiScale.set('completeSeriesConfig',completeSeriesConfig);
      multiScale.set('chartData',d);
      multiScale.set('axes',dim);
      multiScale.set('dimensions',dim);
      multiScale.set('chartExtents',ext);

      multiAxis.set('preventInitialDrawing',false);
      multiAxis.set('margin',m);
      multiAxis.set('width',w);
      multiAxis.set('height',h);
      multiAxis.set('seriesKey','x');
      multiAxis.set('completeSeriesConfig',completeSeriesConfig);
      multiAxis.set('dimensions',dim);
      multiAxis.set('axes',dim);
      multiAxis.set('dimension','y1');
      multiAxis.set('chartData',d);

    });

    test('multiAxis fixture is created', function() {
      assert.isTrue(multiAxis !== null);
    });

    test('multiAxis created its group', function() {
      assert.equal(multiAxis._interactiveGroup.attr('dimension'), 'y1');
    });

    test('multiAxis groups transformed', function() {
      var t = multiAxis._interactiveGroup.attr('transform').replace(',',' '),
          test = t === 'translate(240 0)' || t === 'translate(240)';
      assert.isTrue(test);
    });
  });


  suite('commonAxis ticks styles', function() {
    var multiScale,
        multiSVG,
        multiAxis;

    suiteSetup(function(done) {
      multiScale = document.getElementById('multiScale');
      multiSVG = document.getElementById('multiSVG');
      multiAxis = document.getElementById('multiAxis');
      var scaleSet = function() {
        multiAxis.set('y',multiScale.y.y);
        multiScale.removeEventListener('px-vis-y-updated', scaleSet);
      };
      var axisDone = function() {
        multiAxis.removeEventListener('px-axis-done', axisDone);
        done();
      };

      multiAxis.addEventListener('px-axis-done', axisDone);
      multiScale.addEventListener('px-vis-y-updated', scaleSet);

      multiAxis.set('hideAndShowOnHover',true);
      multiScale.set('commonAxis',true);
    });

    test('commonAxis boolean is flipped', function() {
      assert.isTrue(multiAxis._commonAxisRanAtLeastOnce);
    });

    test('commonAxis styles', function() {
      assert.isTrue(multiAxis._interactiveGroup.selectAll('g.tick text').node().classList.contains('hideCommon'));
    });
  });

  suite('px-vis-interactive-axis radial setup works', function() {
    var radialScale,
        radialSVG,
        radialAxis;

    suiteSetup(function(done){
      radialScale = document.getElementById('radialScale');
      radialSVG = document.getElementById('radialSVG');
      radialAxis = document.getElementById('radialAxis');
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2'],
            "y":['y','y1','y2'],
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y','y1','y2'],
        w = 500,
        h = 500,
        min = 460/2,
        offset = [220,240],
        ext = {'x': dim, 'y':[1,27]},
        m = {
          "top": 20,
          "right": 20,
          "bottom": 20,
          "left": 20
        };

      var scaleSet = function() {
        multiAxis.set('y',multiScale.y.y);
        multiScale.removeEventListener('px-vis-y-updated', scaleSet);
      };

      var axisDone = function() {
        multiAxis.removeEventListener('px-axis-done', axisDone);
        done();
      };

      radialAxis.addEventListener('px-axis-done', axisDone);
      radialScale.addEventListener('px-vis-y-updated', scaleSet);

      radialSVG.set('width',w);
      radialSVG.set('height',h);
      radialSVG.set('offset',offset);
      radialSVG.set('margin',m);

      radialScale.set('_radius',min);
      radialScale.set('centerOffset',20);
      radialScale.set('margin',m);
      radialScale.set('dimensions',dim);
      radialScale.set('completeSeriesConfig',completeSeriesConfig);
      radialScale.set('chartExtents',ext);
      radialScale.set('chartData',d);

      radialAxis.set('margin',m);
      radialAxis.set('width',w);
      radialAxis.set('height',h);
      radialAxis.set('offset',offset);
      radialAxis.set('length',min);
      radialAxis.set('centerOffset',20);
      radialAxis.set('seriesKey','x');
      radialAxis.set('completeSeriesConfig',completeSeriesConfig);
      radialAxis.set('dimensions',dim);
      radialAxis.set('dimension','y');
      radialAxis.set('axes',dim);
      radialAxis.set('chartData',d);
    });

    test('radialAxis fixture is created', function() {
      assert.isTrue(radialAxis !== null);
    });

    test('radialAxis created its group', function() {
      assert.equal(radialAxis._interactiveGroup.attr('dimension'), 'y');
    });

    test('radialAxis groups transformed', function() {
      assert.equal(radialAxis._interactiveGroup.attr('transform'), 'rotate(180)');
    });

  });
} //runTests
