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
  suite('px-vis-clip-path-complex-area does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-clip-path-complex-area basic setup works', function() {
    var baseScale,
        baseSVG,
        baseLine,
        baseClip;
    var eventObj;

    suiteSetup(function(done) {
      flush(function() {

        baseScale = document.getElementById('baseScale');
        baseSVG = document.getElementById('baseSVG');
        baseLine = document.getElementById('baseLine');
        baseClip = document.getElementById('baseClip');
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
            }
          },
          dim = ['y','y1','y2'],
          w = 500,
          h = 500,
          min = 480/2,
          offset = [250,250],
          m = {
            "top": 10,
            "right": 10,
            "bottom": 10,
            "left": 10
          };

          async.until(
            ()=> {
              baseScale = document.getElementById('baseScale');
              baseSVG = document.getElementById('baseSVG');
              baseLine = document.getElementById('baseLine');
              baseClip = document.getElementById('baseClip');
              return baseSVG && baseScale && baseLine && baseClip;
            },
            (callback)=> {
              setTimeout(callback, 50);
            },
            ()=> {

              baseSVG.set('width',w);
              baseSVG.set('height',h);
              baseSVG.set('margin',m);
              baseSVG.set('offset',offset);

              baseScale.set('_radius',min);
              baseScale.set('centerOffset',50);
              baseScale.set('margin',m);
              baseScale.set('chartData',d);
              baseScale.set('dimensions', dim)

              baseLine.set('completeSeriesConfig',completeSeriesConfig);
              baseLine.set('seriesId',"x");
              baseLine.set('chartData',d);

              baseClip.set('dimensions',dim);
              baseClip.set('chartData',d);

              done();
            }
          );
      });
    });

    test('baseClip fixture is created', function() {
      assert.isTrue(baseClip !== null);
    });
  });

  suite('px-vis-clip-path-complex-area baseClip works', function() {
    var baseSVG,
        baseClip;
    var clipPath, rect;

    suiteSetup(function(done){
      async.until(
        ()=> {
          baseSVG = document.getElementById('baseSVG');
          baseClip = document.getElementById('baseClip');
          clipPath = baseSVG.svg.select('clipPath');
          rect = baseClip._clipPathSvg;
          return baseSVG && clipPath.node() && baseClip;
        },
        (callback)=> {
          setTimeout(callback, 50);
        },
        ()=> {
          done();
        }
      );

    });

    test('baseClip ID is set', function() {
      assert.equal(clipPath.attr('id'),baseClip.clipPath);
    });

    test('mask for visual check', function() {
      baseSVG.svg.append('rect')
      .attr('x', -500)
      .attr('y', -300)
      .attr('width', 1000)
      .attr('height', 600)
      .attr('fill', '#000')
      .attr("clip-path", 'url(#' + clipPath.attr('id') + ')');
      assert.isTrue(true);
    });
  }); //suite
} //runTests
