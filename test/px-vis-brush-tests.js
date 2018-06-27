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

function componentFromStr(numStr, percent) {
    var num = Math.max(0, parseInt(numStr, 10));
    return percent ?
        Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
}

function rgbToHex(rgb) {
    var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
    var result, r, g, b, hex = "";
    if ( (result = rgbRegex.exec(rgb)) ) {
        r = componentFromStr(result[1], result[2]);
        g = componentFromStr(result[3], result[4]);
        b = componentFromStr(result[5], result[6]);

        hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return hex;
}


function runTests(){
  suite('px-vis-brush does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-brush basic setup works', function() {
    var baseScale,
        baseSVG,
        baseBrush;
    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    suiteSetup(function(done){
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      baseBrush = document.getElementById('baseBrush');
      var d = [{
            "x": 1397102460000,
            "y": 1
          },{
            "x": 1397131620000,
            "y": 6
          },{
            "x": 1397160780000,
            "y": 10
          },{
            "x": 1397189940000,
            "y": 4
          },{
            "x": 1397219100000,
            "y": 6
          }
        ],
        completeSeriesConfig = {"mySeries":{
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": colors[0]
        }},
        dataExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseScale.set('width',w);
      baseScale.set('height',h);
      baseScale.set('margin',m);
      baseScale.set('completeSeriesConfig',completeSeriesConfig);
      baseScale.set('dataExtents',dataExtents);
      baseScale.set('chartData',d);

      baseBrush.set('height',h);

      window.setTimeout(function() { done()}, 500);
    });

    test('baseBrush fixture is created', function() {
      assert.isTrue(baseBrush !== null);
    });

    test('baseBrush._brush fixture is created', function() {
      assert.isTrue(baseBrush._brush !== null);
    });
    test('baseBrush._brush extents are full', function() {
      var x1 = baseScale.x(baseScale.x.domain()[0]),
          x2 = baseScale.x(baseScale.x.domain()[1]);
      assert.deepEqual(Px.d3.brushSelection(baseBrush._brushGroup.node()),[x1,x2]);
    });

    test('baseBrush._brushGroup fixture is created', function() {
      assert.equal(baseBrush._brushGroup.node().tagName, 'g');
    });

    test('baseBrush._brushGroup.rect fixture is created', function() {
      assert.equal(baseBrush._brushGroup.select('rect.selection').node().tagName, 'rect');
    });
    test('baseBrush._brushGroup.rect attr y', function() {
      assert.equal(baseBrush._brushGroup.select('rect.selection').attr('y'), 0);
    });
    test('baseBrush._brushGroup.rect attr height', function() {
      assert.equal(baseBrush._brushGroup.select('rect.selection').attr('height'), 295);
    });
    test('baseBrush._brushGroup.rect attr stroke', function() {
      assert.equal(baseBrush._brushGroup.select('rect.selection').attr('stroke').split(" ").join(''), rgbToHex(colors['gray10']));
    });
    test('baseBrush._brushGroup.rect attr fill', function() {
      assert.equal(baseBrush._brushGroup.select('rect.selection').attr('fill').split(" ").join(''), rgbToHex(colors['gray10']));
    });
    test('baseBrush._brushGroup.rect attr fill-opacity', function() {
      assert.equal(baseBrush._brushGroup.select('rect.selection').attr('fill-opacity'), 0.2);
    });
    test('baseBrush._brushGroup.rect attr x', function() {
      assert.equal(baseBrush._brushGroup.select('rect.selection').attr('x'), 0);
    });
    test('baseBrush._brushGroup.rect attr width', function() {
      assert.equal(baseBrush._brushGroup.select('rect.selection').attr('width'), 480);
    });

    test('baseBrush._handleGroup is the rects', function() {
      assert.equal(baseBrush._handleGroup.node().tagName,'rect');
    });
    test('baseBrush._handleGroup has correct number of handles', function() {
      assert.equal(baseBrush._handleGroup.nodes().length,2);
    });

    // test('baseBrush._handleGroup.rect has correct x', function() {
    //   assert.equal(baseBrush._handleGroup.select('rect').attr('x'),-4.5);
    // });
    // test('baseBrush._handleGroup.rect has correct y', function() {
    //   assert.equal(baseBrush._handleGroup.select('rect').attr('y'),128);
    // });
    // test('baseBrush._handleGroup.rect has correct height', function() {
    //   assert.equal(baseBrush._handleGroup.select('rect').attr('height'),32);
    // });
    // test('baseBrush._handleGroup.rect has correct width', function() {
    //   assert.equal(baseBrush._handleGroup.select('rect').attr('width'),9);
    // });
    test('baseBrush._handleGroup.rect has correct stroke', function() {
      assert.equal(baseBrush._handleGroup.attr('stroke').split(" ").join(''), rgbToHex(colors['gray10']));
    });
    test('baseBrush._handleGroup.rect has correct fill', function() {
      assert.equal(baseBrush._handleGroup.attr('fill').split(" ").join(''), 'white');
    });

    // test('baseBrush._handleGroup.lines are created', function() {
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0].length,2);
    // });
    // test('baseBrush._handleGroup.lines[0] have correct x vals', function() {
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0][0].getAttribute('x1'),1.5);
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0][0].getAttribute('x2'),1.5);
    // });
    // test('baseBrush._handleGroup.lines[0] have correct y1 val', function() {
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0][0].getAttribute('y1'),137);
    // });
    // test('baseBrush._handleGroup.lines[0] have correct y2 val', function() {
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0][0].getAttribute('y2'),151);
    // });
    // test('baseBrush._handleGroup.lines[0] fill', function() {
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0][0].getAttribute('fill'),'none');
    // });
    // test('baseBrush._handleGroup.lines[0] stroke', function() {
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0][0].getAttribute('stroke').split(' ').join(''),colors.gray10);
    // });
    // test('baseBrush._handleGroup.lines[1] have correct x vals', function() {
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0][1].getAttribute('x1'),-1.5);
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0][1].getAttribute('x2'),-1.5);
    // });
    // test('baseBrush._handleGroup.lines[1] have correct y1 val', function() {
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0][1].getAttribute('y1'),137);
    // });
    // test('baseBrush._handleGroup.lines[1] have correct y2 val', function() {
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0][1].getAttribute('y2'),151);
    // });
    // test('baseBrush._handleGroup.lines[1] fill', function() {
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0][1].getAttribute('fill'),'none');
    // });
    // test('baseBrush._handleGroup.lines[1] stroke', function() {
    //   assert.equal(baseBrush._handleGroup.selectAll('line')[0][1].getAttribute('stroke').split(' ').join(''),colors.gray10);
    // });
  });

  suite('px-vis-brush brush resizes to the inputed domain', function() {
    var baseBrush;

    suiteSetup(function(done){
      baseBrush = document.getElementById('baseBrush');
      var d = [1397131620000,1397189940000];

      baseBrush.set('chartDomain',d);
       window.setTimeout(function() { done(); }, 200);
    });

    test('baseBrush._brush extents match', function() {
      var x1 = baseScale.x(1397131620000),
          x2 = baseScale.x(1397189940000);
      assert.deepEqual(Px.d3.brushSelection(baseBrush._brushGroup.node()),[x1,x2]);
    });
    test('baseBrush._brushGroup.rect attr x', function() {
      assert.equal(baseBrush._brushGroup.select('rect.selection').attr('x'), 120);
    });
    test('baseBrush._brushGroup.rect attr width', function() {
      assert.closeTo(Number(baseBrush._brushGroup.select('rect.selection').attr('width')), 240,1);
    });
  });

  suite('px-vis-brush click on navigator and the extent box should move to that point', function() {
    var baseBrush;
    suiteSetup(function(done){
      baseBrush = document.getElementById('baseBrush');
      var rect = baseBrush._brushGroup.select('rect.overlay').node(),
          box = rect.getBoundingClientRect();

      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mousedown",true,true,window,0,0,0,box.left,box.top + box.height/2,false,false,false,false,0,null);

      rect.dispatchEvent(e);

      window.setTimeout(function(){ done(); }, 2000);
    });

    test('baseBrush._brush extents match', function() {
      var ext = Px.d3.brushSelection(baseBrush._brushGroup.node()),
          x1 = baseScale.x(1397102460000),
          x2 = baseScale.x(1397160780000);

      assert.closeTo(ext[0],x1,5);
      assert.closeTo(ext[1],x2,5);
    });
    test('baseBrush._brushGroup.rect attr x', function() {
      assert.closeTo(parseInt(baseBrush._brushGroup.select('rect.selection').attr('x')), 0, 6);
    });
    test('baseBrush._brushGroup.rect attr width', function() {

      assert.closeTo(parseInt(baseBrush._brushGroup.select('rect.selection').attr('width')), 240,1);
    });
  });

  suite('px-vis-brush brush reset inputed domain', function() {
    var baseBrush;

    suiteSetup(function(done){
      baseBrush = document.getElementById('baseBrush');
      var d = [1397102460000,1397219100000];

      baseBrush.set('chartDomain', d);
      window.setTimeout(function() { done(); }, 500);

    });

    test('baseBrush._brush extents are full', function() {
      var x1 = baseScale.x(1397102460000),
          x2 = baseScale.x(1397219100000);
      assert.deepEqual(Px.d3.brushSelection(baseBrush._brushGroup.node()),[x1,x2]);
    });
    test('baseBrush._brushGroup.rect attr x', function() {
      assert.closeTo(Number(baseBrush._brushGroup.select('rect.selection').attr('x')), 0, 5);
    });
    test('baseBrush._brushGroup.rect attr width', function() {
      assert.equal(baseBrush._brushGroup.select('rect.selection').attr('width'), 480);
    });
  });

  suite('px-vis-brush handle mouseover ', function() {
    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    suiteSetup(function(done){
      var box = baseBrush._handleGroup.node().getBoundingClientRect();

      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mouseenter",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
      // For stupid MS Edge
      var e2 = document.createEvent("MouseEvent");
      e2.initMouseEvent("mouseover",true,true,window,0,0,0,0,0,false,false,false,false,0,null);

      baseBrush._handleGroup.node().dispatchEvent(e);
      baseBrush._handleGroup.node().dispatchEvent(e2);

      window.setTimeout(function(){done()},10);
    });

    test('baseBrush._handleGroup rect stroke changes', function() {
      assert.equal(baseBrush._handleGroup.attr('stroke').split(' ').join(''), rgbToHex(colors['gray12']));
    });
    test('baseBrush._handleGroup rect fill changes', function() {
      assert.equal(baseBrush._handleGroup.attr('fill').split(' ').join(''), rgbToHex(colors['gray10']));
    });
    // test('baseBrush._handleGroup lines stroke changes', function() {
    //   assert.equal(baseBrush._handleGroup.select('line.handleLine').attr('stroke').split(' ').join(''), colors.gray12);
    // });
  });

  suite('px-vis-brush handle mouseleave ', function() {
    var colors = PxColorsBehavior.baseColors.properties.colors.value;


    suiteSetup(function(done){
      var box = baseBrush._handleGroup.node().getBoundingClientRect();

      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mouseleave",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
      // For stupid MS Edge
      var e2 = document.createEvent("MouseEvent");
      e2.initMouseEvent("mouseout",true,true,window,0,0,0,0,0,false,false,false,false,0,null);

      baseBrush._handleGroup.node().dispatchEvent(e);
      baseBrush._handleGroup.node().dispatchEvent(e2);

      window.setTimeout(function(){done()},10);
      // done();
    });

    test('baseBrush. handle rect stroke changes', function() {
      assert.equal(baseBrush._handleGroup.attr('stroke').split(' ').join(''), rgbToHex(colors['gray10']));
    });
    test('baseBrush. handle rect fill changes', function() {
      assert.equal(baseBrush._handleGroup.attr('fill').split(' ').join(''), 'white');
    });
    // test('baseBrush. handle lines stroke changes', function() {
    //   assert.equal(baseBrush._handleGroup.select('line.handleLine').attr('stroke').split(' ').join(''), colors.gray10);
    // });
  });

  suite('px-vis-brush handle press ', function() {
    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    suiteSetup(function(done){
      var box = baseBrush._handleGroup.node().getBoundingClientRect();

      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mouseenter",true,true,window,0,0,0,box.left + box.width/2,box.top + box.height/2,false,false,false,false,0,null);
      // For stupid MS Edge
      var e2 = document.createEvent("MouseEvent");
      e2.initMouseEvent("mousedown",true,true,window,0,0,0,box.left + box.width/2,box.top + box.height/2,false,false,false,false,0,null);

      baseBrush._handleGroup.node().dispatchEvent(e);

      window.setTimeout(function(){
        baseBrush._handleGroup.node().dispatchEvent(e2);
      },10);

      window.setTimeout(function(){done()},10);
    });

    test('baseBrush._handleGroup rect stroke changes', function() {
      assert.equal(baseBrush._handleGroup.attr('stroke').split(' ').join(''), rgbToHex(colors['gray14']));
    });
    test('baseBrush._handleGroup rect fill changes', function() {
      assert.equal(baseBrush._handleGroup.attr('fill').split(' ').join(''), rgbToHex(colors['gray12']));
    });
    // test('baseBrush._handleGroup lines stroke changes', function() {
    //   assert.equal(baseBrush._handleGroup.select('line.handleLine').attr('stroke').split(' ').join(''), colors.gray14);
    // });
  });
// TODO figure out how to test the brush events...
  // suite('px-vis-brush handle move ', function() {
  //   suiteSetup(function(done){
  //     var box = baseBrush._handleGroup.node().getBoundingClientRect();
  //     var boxBg = baseBrush._brushGroup.select("rect.background").node().getBoundingClientRect();
  //
  //     var e = new MouseEvent('mousedown',{
  //       "clientX": box.left + box.width/2,
  //       "clientY": box.top + box.height/2,
  //     });
  //     var e2 = new MouseEvent('mousemove',{
  //       "clientX": boxBg.left + boxBg.width/4,
  //       "clientY": boxBg.top + boxBg.height/2,
  //     });
  //
  //     baseBrush._brushGroup.node().dispatchEvent(e);
  //
  //     window.setTimeout(function(){
  //       baseBrush._brushGroup.node().dispatchEvent(e2);
  //     },10);
  //
  //     window.setTimeout(function(){done()},3000);
  //     // done();
  //   });
  //
  //   test('baseBrush._brush extents match', function() {
  //     assert.deepEqual(baseBrush._brush.extent(),[1397131620000,1397189940000]);
  //   });
  //   test('baseBrush._brushGroup.rect attr x', function() {
  //     assert.equal(baseBrush._brushGroup.select('rect.extent').attr('x'), 240);
  //   });
  //   test('baseBrush._brushGroup.rect attr width', function() {
  //     assert.equal(baseBrush._brushGroup.select('rect.extent').attr('width'), 240);
  //   });
  // });

  suite('px-vis-brush gradient overlay', function() {
    var gradientScale,
        gradientSVG,
        gradientBrush;
    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    suiteSetup(function(done){
      gradientScale = document.getElementById('gradientScale');
      gradientSVG = document.getElementById('gradientSVG');
      gradientBrush = document.getElementById('gradientBrush');
      var d = [{
            "x": 1397102460000,
            "y": 1
          },{
            "x": 1397131620000,
            "y": 6
          },{
            "x": 1397160780000,
            "y": 10
          },{
            "x": 1397189940000,
            "y": 4
          },{
            "x": 1397219100000,
            "y": 6
          }
        ],
        completeSeriesConfig = {"mySeries":{
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)"
        }},
        dataExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      gradientSVG.set('width',w);
      gradientSVG.set('height',h);
      gradientSVG.set('margin',m);

      gradientScale.set('width',w);
      gradientScale.set('height',h);
      gradientScale.set('margin',m);
      gradientScale.set('completeSeriesConfig',completeSeriesConfig);
      gradientScale.set('dataExtents',dataExtents);
      gradientScale.set('chartData',d);

      gradientBrush.set('height',h);
      gradientBrush.set('gradientColors', ['red','blue']);

      done();
    });

    test('gradientBrush fixture is created', function() {
      assert.isTrue(gradientBrush !== null);
    });

    test('gradientBrush._brush fixture is created', function() {
      assert.isTrue(gradientBrush._brush !== null);
    });

    test('gradientBrush._brushGroup fixture is created', function() {
      assert.equal(gradientBrush._brushGroup.node().tagName, 'g');
    });

    test('gradientBrush._brushGroup.rect fixture is created', function() {
      assert.equal(gradientBrush._brushGroup.select('rect.selection').node().tagName, 'rect');
    });

    test('gradientBrush._brushGroup.rect attr stroke', function() {
      assert.equal(gradientBrush._brushGroup.select('rect.selection').attr('stroke').split(" ").join(''), rgbToHex(colors['gray10']));
    });
    // test('gradientBrush._brushGroup.rect attr fill', function() {
    //   assert.equal(gradientBrush._brushGroup.select('rect.selection').attr('fill'), "url(#overlayGradient)");
    // });
    // test('gradientBrush._brushGroup.rect attr fill-opacity', function() {
    //   assert.equal(gradientBrush._brushGroup.select('rect.selection').attr('fill-opacity'), 1);
    // });

    test('def is created', function() {
      assert.equal(gradientBrush.svg.select('defs').node().tagName, 'defs');
    });
    test('linearGradient is created', function() {
      assert.equal(gradientBrush.svg.select('defs').select('#overlayGradient').node().tagName, 'linearGradient');
    });
    test('linearGradient has correct id', function() {
      assert.equal(gradientBrush.svg.select('defs').select('#overlayGradient').attr('id'), 'overlayGradient');
    });
    test('linearGradient stops are created', function() {
      var stops = gradientBrush.svg.select('defs').select('#overlayGradient').selectAll('stop').nodes();
      assert.equal(stops.length, 101);
    });
    test('linearGradient stop[0] is correct', function() {
      var stop = d3.select(gradientBrush.svg.select('defs').select('#overlayGradient').selectAll('stop').nodes()[0]),
          stopColor = stop.attr('stop-color').split(" ").join('');
      assert.equal(stop.attr('offset'), '0%');
      if(stopColor[0] === 'r') {
        assert.equal(stopColor, 'rgb(255,0,0)');
      } else {
        assert.equal(stopColor, rgbToHex('rgb(255,0,0)'));
      }
    });
    test('linearGradient stop[49] is correct', function() {
      var stop = d3.select(gradientBrush.svg.select('defs').select('#overlayGradient').selectAll('stop').nodes()[49]),
          stopColor = stop.attr('stop-color').split(" ").join('');
      assert.equal(stop.attr('offset'), '49%');
      if(stopColor[0] === 'r') {
        assert.equal(stopColor, 'rgb(130,0,125)');
      } else {
        assert.equal(stopColor, rgbToHex('rgb(130,0,125)'));
      }
    });
    test('linearGradient stop[100] is correct', function() {
      var stop = d3.select(gradientBrush.svg.select('defs').select('#overlayGradient').selectAll('stop').nodes()[100]),
          stopColor = stop.attr('stop-color').split(" ").join('');
      assert.equal(stop.attr('offset'), '100%');
      if(stopColor[0] === 'r') {
        assert.equal(stopColor, 'rgb(0,0,255)');
      } else {
        assert.equal(stopColor, rgbToHex('rgb(0,0,255)'));
      }
    });
  });
} //runTests
