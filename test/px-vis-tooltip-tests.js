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
  suite('px-vis-tooltip does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-tooltip baseTooltip setup works', function() {
    var baseSVG,
        baseTooltip;

    suiteSetup(function(){
      baseSVG = document.getElementById('baseSVG');
      baseTooltip = document.getElementById('baseTooltip');
      var w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        },
        d = [{
          "series": [
            [1397102460000, 1],
            [1397131620000, 6],
            [1397160780000, 10],
            [1397189940000, 4],
            [1397219100000, 6]
          ],
          "seriesNumber":0,
          "name":"mySeries1"
        },{
          "series": [
            [1397102460000, 1],
            [1397131620000, 21],
            [1397160780000, 3],
            [1397189940000, 10],
            [1397219100000, 27]
          ],
          "seriesNumber":1,
          "name":"mySeries2"
        }];

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseTooltip.set('margin',m);
      baseTooltip.set('chartData',d);

    });
    test('baseTooltip _rect is set', function() {
      assert.isNotNull(baseTooltip._rect);
    });

    test('baseTooltip fixture is created', function() {
      assert.isTrue(baseTooltip !== null);
    });

    test('baseTooltip is hidden', function() {
      assert.isTrue(baseTooltip.$.tooltip.classList.contains('hidden'));
    });
  }); //suite

  suite('px-vis-tooltip baseTooltip tooltipData is added', function() {
    var baseSVG,
        baseTooltip;

    suiteSetup(function(done){
      baseSVG = document.getElementById('baseSVG');
      baseTooltip = document.getElementById('baseTooltip');
      var d = {
        'time': 1397160780000,
        'series': [
          {'name':'mySeries1','coord': [240,170] },
          {'name':'mySeries2','coord': [240,240] },
        ],
        'mouse': [260,150],
        'xArr': [240,240],
        'yArr': [170,240]
      };

      baseTooltip.set('tooltipData',d);
      // window.setTimeout(function(){ done(); },1000);
      done();
    });

    test('baseTooltip is show', function() {
      assert.isFalse(baseTooltip.$.tooltip.classList.contains('hidden'));
    });
    test('baseTooltip style left', function() {
      var num = parseInt(baseTooltip.$.tooltip.style.left),
          expected = Number(baseTooltip.margin.left) + 15 + baseTooltip.tooltipData.mouse[0];
      assert.equal(num,expected);
    });
    test('baseTooltip style top', function() {
      var num = parseInt(baseTooltip.$.tooltip.style.top),
          expected = Number(baseTooltip.margin.top) + 5 + baseTooltip.tooltipData.mouse[1];
      assert.closeTo(num,expected,1);
    });
  }); //suite

  suite('px-vis-tooltip baseTooltip tooltipData is removed', function() {
    var baseSVG,
        baseTooltip;

    suiteSetup(function(done){
      baseSVG = document.getElementById('baseSVG');
      baseTooltip = document.getElementById('baseTooltip');
      var d = {
        'time': null,
        'series': [
          {'name':0,'coord': null },
          {'name':1,'coord': null },
        ],
        'mouse': null,
        'xArr': null,
        'yArr': null
      };

      baseTooltip.set('tooltipData',d);
      baseTooltip.set('seriesConfig', {
        "0":{
          name:'mySeries1',
          color: 'red'
        },
        "1":{
          name:'mySeries2',
          color: 'red'
        }}
      );
      // window.setTimeout(function(){ done(); },1000);
      done();
    });

    test('baseTooltip is hidden', function() {
      assert.isTrue(baseTooltip.$.tooltip.classList.contains('hidden'));
    });
  }); //suite
} //runTests
