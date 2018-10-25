<template>
  <div
    class="radar-input"
    style="width: 100%"
    v-on:mousemove="drag"
    v-on:touchmove="touchMove"
  >
    Radar Input Magic Goes Here
    <svg width="100%" height="300px" viewBox="-40 -40 80 80" ref="svg">
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
      <!-- test line -->
      <!-- <line
        :x1="testLine.x1"
        :y1="testLine.y1"
        :x2="testLine.x2"
        :y2="testLine.y2"
        stroke="blue"
        stroke-width=".5px"
      /> -->
      <circle
        :cx="dragPoint.x"
        :cy="dragPoint.y"
        r="1.25"
        fill="#72a072"
        :key="'color point' + dragPoint.x + ' ' + dragPoint.y"
        v-for="dragPoint in dragPoints"
      />
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
        v-on:touchstart.prevent="startTouchDrag($event, i)"
      />
      <!-- clickable points -->
      <template
        v-for="valuePoints in points"
      >
        <circle
          :cx="valuePoint.x"
          :cy="valuePoint.y"
          r="3"
          fill="#00000000"
          :key="valuePoint.key + ' ' + valuePoint.value"
          v-for="valuePoint in valuePoints"
          v-on:mousedown="startDrag($event, valuePoint.key)"
          v-on:touchstart.prevent="startTouchDrag($event, valuePoint.key)"
        />
      </template>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'RadarInput',
  //props: ['intervalCount', 'width', 'pointCount'],
  props: ['value'],
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
    };
  },
  computed: {
    pointCount() {
      return this.value.length;
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
      const points = this.value.map((value, i) => {
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
      const labels = this.value.map((value, i) => {
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
          x = lineX - 1.5;
        } else if (Math.round(lineX) > 0) {
          anchor = 'start';
          x = lineX + 1.5;
        }

        if (Math.round(lineX) === 0 && Math.round(lineY) > 0) {
          y = lineY + 5;
        } else if (Math.round(lineY) > 0) {
          y = lineY + 4;
        } else if (Math.round(lineY) < 0) {
          y = lineY - 1.5;
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
      const points = this.value.map((value, i) => {
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
      this.value[key].value = value;
    },
    drag(evt) {
      if (this.dragging === undefined) {
        return;
      }

      this.pt.x = evt.clientX;
      this.pt.y = evt.clientY;

      // The cursor point, translated into svg coordinates
      var cursorPt =  this.pt.matrixTransform(this.$refs.svg.getScreenCTM().inverse());
      console.log("(" + cursorPt.x + ", " + cursorPt.y + ")");

      // https://math.stackexchange.com/questions/717746/closest-point-on-a-line-to-another-point
      // Measurement line
      const targetMeasurement = this.lines[this.dragging];
      const slope = (targetMeasurement.y) / (targetMeasurement.x);
      
      // Perpendicular line
      const recipricalSlope = Math.round(slope) === 0 ? 1 : 1 / slope * -1;
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
      this.value[this.dragging].value = nearest.value;
    },
    startTouchDrag(evt, key) {
      this.startDrag(evt.touches[0], key);
    },
    touchMove(evt) {
      this.drag(evt.touches[0]);
    },
    startDrag(evt, key) {
      this.dragging = key;
      this.drag(evt);
    },
    stopDrag() {
      this.dragging = undefined;
    },
  },
  mounted() {
    window.addEventListener("mouseup", this.stopDrag);
    window.addEventListener("touchend", this.stopDrag);
    this.pt = this.$refs.svg.createSVGPoint();
  },
}
</script>

<style>
</style>
