<template>
  <div
    class="radar-input"
    v-on:mouseup="stopDrag"
    v-on:mousemove="drag"
  >
    Radar Input Magic Goes Here
    <svg width="300px" height="300px" viewBox="-40 -40 80 80" ref="svg">
      <polygon
        :points="interval"
        fill="rgba(0, 0, 0, 0)"
        stroke="#0000008a"
        stroke-width=".25px"
        :key="interval"
        v-for="interval in intervals"
      />
      <line
        x1="0"
        y1="0"
        :x2="line.x"
        :y2="line.y"
        stroke="#0000008a"
        stroke-width=".25px"
        :key="i"
        v-for="(line, i) in lines"
      />
      <polygon
        :points="valuePolygonPoints"
        fill="#72a072bf"
        stroke="#72c772bf"
        stroke-width=".5px"
      />
      <!-- <foreignObject
        :x="label.x"
        :y="label.y"
        width="20"
        height="20"
        :key="label.text"
        v-for="label in labels"
      >
        <div style="font-size: 4px;">
          {{label.text}}
        </div>
      </foreignObject> -->
      <text
        :x="label.x"
        :y="label.y"
        :text-anchor="label.anchor"
        style="user-select: none"
        font-size="4"
        :key="label.text"
        v-for="label in labels"
      >
        {{label.text}}
      </text>
      <!-- clickable points -->
      <!-- <template
        v-for="valuePoints in points"
      > -->
        <!-- <circle
          :cx="valuePoint.x"
          :cy="valuePoint.y"
          r="3"
          fill="#00000000"
          v-on:click="changeValue(valuePoint.key, valuePoint.value)"
          :key="valuePoint.key + ' ' + valuePoint.value"
          v-for="valuePoint in valuePoints"
        /> -->
        <!-- <circle
          :cx="valuePoint.x"
          :cy="valuePoint.y"
          r="3"
          fill="#00000000"
          :key="valuePoint.key + ' ' + valuePoint.value"
          v-for="valuePoint in valuePoints"
        /> -->
      <!-- </template> -->
      <!-- test line -->
      <!-- <line
        :x1="testLine.x1"
        :y1="testLine.y1"
        :x2="testLine.x2"
        :y2="testLine.y2"
        stroke="blue"
        stroke-width=".5px"
      /> -->
      <line
        x1="0"
        y1="0"
        :x2="line.x"
        :y2="line.y"
        stroke="#00000000"
        stroke-width="6px"
        :key="'clickable' + i"
        v-for="(line, i) in lines"
        v-on:mousedown="startDrag($event, i)"
      />
      <circle
        :cx="dragPoint.x"
        :cy="dragPoint.y"
        r="1.25"
        fill="#72a072"
        :key="'color point' + dragPoint.x + ' ' + dragPoint.y"
        v-for="dragPoint in dragPoints"
      />
      <circle
        :cx="dragPoint.x"
        :cy="dragPoint.y"
        r="3"
        fill="#00000000"
        v-on:mousedown="startDrag($event, dragPoint.key)"
        :key="dragPoint.x + ' ' + dragPoint.y"
        v-for="dragPoint in dragPoints"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'RadarInput',
  //props: ['intervalCount', 'width', 'pointCount'],
  data() {
    return {
      testLine: {
        x1: 0,
        y1: 0,
        x2: 10,
        y2: 10,
      },
      width: 20,
      intervalCount: 3,
      values: [
        {
          key: 'FIRST',
          value: 1,
        },
        {
          key: 'SECOND',
          value: 4,
        },
        {
          key: 'THIRD',
          value: 3,
        },
        {
          key: 'FOURTH',
          value: 2,
        },
        {
          key: 'FIFTH',
          value: 5,
        },
        {
          key: 'SIXTH',
          value: 3,
        },
        {
          key: 'SEVENTH',
          value: 4,
        },
      ],
    };
  },
  computed: {
    pointCount() {
      return this.values.length;
    },
    intervals() {
      const degreeSeperation = 360 / this.pointCount;
      const lineSeperation = this.width / this.intervalCount;
      const angleAdjustment = 90;
      const pointStrings = [...Array(this.intervalCount)]
        .map((_, i) => {
          const points = [...Array(this.pointCount)]
            .map((_, j) => {
              const degrees = ((degreeSeperation * j) - angleAdjustment) 
                * (Math.PI / 180);
              const hyp = this.width - (i*lineSeperation);

              return `${Math.cos(degrees) * hyp},${Math.sin(degrees) * hyp}`;
            });
          return points.join(' ');
        });
      // debugger;
      return pointStrings;
    },
    lines() {
      const degreeSeperation = 360 / this.pointCount;
      const angleAdjustment = 90;
      const linePoints = [...Array(this.pointCount)]
        .map((_, i) => {
          const degrees = ((degreeSeperation * i) - angleAdjustment) 
            * (Math.PI / 180);
          const hyp = this.width;
          return {
            x: Math.cos(degrees) * hyp,
            y: Math.sin(degrees) * hyp,
          }
        });

      return linePoints;
    },
    points() {
      const degreeSeperation = 360 / this.pointCount;
      const lineSeperation = this.width / this.intervalCount;
      const angleAdjustment = 90;
      const valuePoints = [...Array(this.intervalCount)]
        .map((_, i) => {
          const points = [...Array(this.pointCount)]
            .map((_, j) => {
              const degrees = ((degreeSeperation * j) - angleAdjustment) 
                * (Math.PI / 180);
              const hyp = this.width - (i*lineSeperation);

              return {
                key: j,
                value: this.intervalCount - i,
                x: Math.cos(degrees) * hyp,
                y: Math.sin(degrees) * hyp
              };
            });
          return points;
        });

      return valuePoints;
    },
    valuePolygonPoints() {
      const degreeSeperation = 360 / this.pointCount;
      const lineSeperation = this.width / this.intervalCount;
      const angleAdjustment = 90;
      const points = this.values.map((value, i) => {
        const degrees = ((degreeSeperation * i) - angleAdjustment) 
          * (Math.PI / 180);
        const hyp = value.value * lineSeperation;

        return `${Math.cos(degrees) * hyp},${Math.sin(degrees) * hyp}`;
      });

      return points.join(' ');
    },
    labels() {
      const degreeSeperation = 360 / this.pointCount;
      const angleAdjustment = 90;
      const labels = this.values.map((value, i) => {
        const degrees = ((degreeSeperation * i) - angleAdjustment) 
          * (Math.PI / 180);
        const hyp = this.width;

        const lineX = Math.cos(degrees) * hyp;
        const lineY = Math.sin(degrees) * hyp
        let anchor = 'middle';
        let y = lineY;
        let x = lineX;
        if (Math.round(lineX) < 0) {
          anchor = 'end';
          x = lineX - .5;
        } else if (Math.round(lineX) > 0) {
          anchor = 'start';
          x = lineX + .5;
        }

        if (Math.round(lineY) > 0) {
          y = lineY + 4;
        } else if (Math.round(lineY) < 0) {
          y = lineY - .5;
        } else {
          y = lineY + 2;
        }

        return {
          anchor: anchor,
          text: value.key,
          x: x,
          y: y,
        }
      });

      return labels;
    },
    dragPoints() {
      const degreeSeperation = 360 / this.pointCount;
      const lineSeperation = this.width / this.intervalCount;
      const angleAdjustment = 90;
      const points = this.values.map((value, i) => {
        const degrees = ((degreeSeperation * i) - angleAdjustment) 
          * (Math.PI / 180);
        const hyp = value.value * lineSeperation;

        return {
          key: i,
          x: Math.cos(degrees) * hyp,
          y: Math.sin(degrees) * hyp
        };
      });

      return points;
    },
  },
  methods: {
    changeValue(key, value) {
      this.values[key].value = value;
    },
    drag(evt) {
      if (this.dragging === undefined) {
        return;
      }

      this.pt.x = evt.clientX;
      this.pt.y = evt.clientY;
      // console.log({x: evt.clientX, y: evt.clientY});
      // The cursor point, translated into svg coordinates
      var cursorPt =  this.pt.matrixTransform(this.$refs.svg.getScreenCTM().inverse());
      console.log("(" + cursorPt.x + ", " + cursorPt.y + ")");

      // https://math.stackexchange.com/questions/717746/closest-point-on-a-line-to-another-point
      // Measurement line
      const targetMeasurement = this.lines[this.dragging];
      const slope = (targetMeasurement.y) / (targetMeasurement.x);
      
      // Perpendicular line
      const recipricalSlope = 1 / slope * -1;
      const perpendicularYInt = cursorPt.y - (cursorPt.x * recipricalSlope);

      // Intercept
      const xInt = perpendicularYInt / (slope - recipricalSlope);
      const YInt = slope * xInt;


      // Nearest value point
      const nearest = this.points
        .map((interval) => interval[this.dragging])
        .reduce((acc, cur) => {
          const a = cur.x - xInt;
          const b = cur.y - YInt;
          const distance = Math.sqrt(a*a + b*b);

          if (distance < acc.distance) {
            return {
              distance,
              value: cur.value,
              x: cur.x,
              y: cur.y
            }
          }

          return acc;
        }, {
          distance: Number.MAX_SAFE_INTEGER
        });

      this.testLine.x1 = nearest.x;      
      this.testLine.y1 = nearest.y;
      this.testLine.x2 = 0;
      this.testLine.y2 = perpendicularYInt;
      this.values[this.dragging].value = nearest.value;
      // console.log({x: 0, y: perpendicularYInt});
    },
    dragStart(evt, valuePoint) {
      // https://stackoverflow.com/questions/29261304/how-to-get-the-click-coordinates-relative-to-svg-element-holding-the-onclick-lis
      this.pt.x = evt.clientX;
      this.pt.y = evt.clientY;
      // console.log({x: evt.clientX, y: evt.clientY});
      // The cursor point, translated into svg coordinates
      var cursorPt =  this.pt.matrixTransform(this.$refs.svg.getScreenCTM().inverse());
      // console.log("(" + cursorPt.x + ", " + cursorPt.y + ")");
    },
    startDrag(evt, key) {
      // console.log('start drag: ' + key);
      this.dragging = key;
      this.drag(evt);
    },
    stopDrag() {
      // console.log('stop drag: ' + this.dragging);
      this.dragging = undefined;
    },
  },
  mounted() {
    this.pt = this.$refs.svg.createSVGPoint();
  },
}
</script>

<style>
</style>
