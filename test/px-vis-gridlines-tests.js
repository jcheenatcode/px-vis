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
  suite('px-vis-gridlines does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-gridlines basic setup works', function() {
    var baseScale,
        baseSVG,
        baseXGrid,
        baseYGrid;

    suiteSetup(function(done){
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      baseXGrid = document.getElementById('baseXGrid');
      baseYGrid = document.getElementById('baseYGrid');
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
          "right": 5,
          "bottom": 50,
          "left": 50
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

      baseXGrid.set('margin',m);
      baseXGrid.set('length',h);

      baseYGrid.set('margin',m);
      baseYGrid.set('length',w);
      window.setTimeout(function(){ done() },100);
    });

    test('baseXGrid fixture is created', function() {
      assert.isTrue(baseXGrid !== null);
    });
    test('baseYGrid fixture is created', function() {
      assert.isTrue(baseYGrid !== null);
    });
  });

  suite('px-vis-gridlines basicXGrid works', function() {
    var baseScale,
        baseSVG,
        baseXGrid;

    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    suiteSetup(function() {
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      baseXGrid = document.getElementById('baseXGrid');
    });
test('baseXGrid ID is random', function() {
      assert.equal(baseXGrid.gridId.length,15);
      assert.equal(baseXGrid.gridId.split('_')[0],'grid');
    });

    // test('baseXGrid _grid orientation', function() {
    //   assert.equal(baseXGrid._grid.orient(),'bottom');
    // });
    test('baseXGrid _grid tickSizeInner', function() {
      assert.equal(baseXGrid._grid.tickSizeInner(),-240);
    });

    test('baseXGrid _translateAmt', function() {
      assert.equal(JSON.stringify(baseXGrid._translateAmt),'[0,240]');
    });

    test('baseXGrid _gridGroup created', function() {
      assert.equal(baseXGrid._gridGroup.node().tagName,'g');
    });
    test('baseXGrid _gridGroup translation', function() {
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          s = baseXGrid._gridGroup.attr('transform'),
          arr = re.exec(s);
      assert.equal(arr[1],'translate');
      assert.equal(parseFloat(arr[2]),0);
      assert.equal(parseFloat(arr[3]),240);
    });

    suite('_gridGroup lines and path styles', function() {
      var lines,path;
      suiteSetup(function(done){

        window.setTimeout(function() {
          lines = baseXGrid._gridGroup.selectAll('line');
          path = baseXGrid._gridGroup.selectAll('path');
          done();
        }, 200);
      });

      // test('correct number of lines', function() {
      //   assert.equal(lines[0].length,11);
      // });
      test('correct number of paths', function() {
        assert.equal(path.nodes().length,0);
      });

      test('line0 has correct fill', function() {
        assert.equal(lines.nodes()[0].getAttribute('fill'),'none');
      });
      test('line0 has correct stroke', function() {
        assert.equal(lines.nodes()[0].getAttribute('stroke').split(' ').join(''),rgbToHex(colors['grey3']));
      });

      test('line3 has correct fill', function() {
        assert.equal(lines.nodes()[3].getAttribute('fill'),'none');
      });
      test('line3 has correct stroke', function() {
        assert.equal(lines.nodes()[3].getAttribute('stroke').split(' ').join(''),rgbToHex(colors['grey3']));
      });

      test('line9 has correct fill', function() {
        assert.equal(lines.nodes()[9].getAttribute('fill'),'none');
      });
      test('line3 has correct stroke', function() {
        assert.equal(lines.nodes()[9].getAttribute('stroke').split(' ').join(''),rgbToHex(colors['grey3']));
      });
    });
  }); //suite

  suite('px-vis-gridlines basicYGrid works', function() {
    var baseScale,
        baseSVG,
        baseYGrid;

    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    suiteSetup(function() {
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      baseYGrid = document.getElementById('baseYGrid');
    });
test('baseYGrid ID is random', function() {
      assert.equal(baseYGrid.gridId.length,15);
      assert.equal(baseYGrid.gridId.split('_')[0],'grid');
    });

    // test('baseYGrid _grid orientation', function() {
    //   assert.equal(baseYGrid._grid.orient(),'left');
    // });
    test('baseYGrid _grid tickSizeInner', function() {
      assert.equal(baseYGrid._grid.tickSizeInner(),-445);
    });

    test('baseYGrid _translateAmt', function() {
      assert.equal(JSON.stringify(baseYGrid._translateAmt),'[0,0]');
    });

    test('baseYGrid _gridGroup created', function() {
      assert.equal(baseYGrid._gridGroup.node().tagName,'g');
    });
    test('baseYGrid _gridGroup translation', function() {
      assert.isTrue(baseYGrid._gridGroup.attr('transform') === 'translate(0,0)' || baseYGrid._gridGroup.attr('transform') === 'translate(0)');
    });

    suite('_gridGroup lines and path styles', function() {
      var lines,path;
      suiteSetup(function(){
        lines = baseYGrid._gridGroup.selectAll('line');
        path = baseYGrid._gridGroup.selectAll('path');
      })

      // test('correct number of lines', function() {
      //   assert.equal(lines[0].length,11);
      // });
      test('correct number of paths', function() {
        assert.equal(path.nodes().length,0);
      });

      test('line0 has correct fill', function() {
        assert.equal(lines.nodes()[0].getAttribute('fill'),'none');
      });
      test('line0 has correct stroke', function() {
        assert.equal(lines.nodes()[0].getAttribute('stroke').split(' ').join(''),rgbToHex(colors['grey3']));
      });

      test('line3 has correct fill', function() {
        assert.equal(lines.nodes()[3].getAttribute('fill'),'none');
      });
      test('line3 has correct stroke', function() {
        assert.equal(lines.nodes()[3].getAttribute('stroke').split(' ').join(''),rgbToHex(colors['grey3']));
      });

      test('line9 has correct fill', function() {
        assert.equal(lines.nodes()[9].getAttribute('fill'),'none');
      });
      test('line3 has correct stroke', function() {
        assert.equal(lines.nodes()[9].getAttribute('stroke').split(' ').join(''),rgbToHex(colors['grey3']));
      });
    });
  }); //suite
} //runTests
