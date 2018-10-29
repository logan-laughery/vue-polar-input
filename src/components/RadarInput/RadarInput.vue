<template>
  <div
    class="radar-input"
    style="width: 100%"
    v-on:mousemove="drag"
    v-on:touchmove="touchMove"
  >
    Radar Input Magic Goes Here
    <svg width="100%" viewBox="-40 -40 80 80" ref="svg">
      <polygon
        class="radar-polygon"
        :points="interval"
        :key="interval"
        v-for="interval in intervals"
      />
      <line
        class="radar-line"
        x1="0"
        y1="0"
        :x2="line.x"
        :y2="line.y"
        :key="i"
        v-for="(line, i) in lines"
      />
      <polygon
        class="radar-highlight"
        :points="valuePolygonPoints"
      />
      <text
        class="radar-label"
        :x="label.x"
        :y="label.y"
        :text-anchor="label.anchor"
        :key="label.text"
        v-for="label in labels"
      >
        {{label.text}}
      </text>
      <circle
        class="radar-point"
        :cx="dragPoint.x"
        :cy="dragPoint.y"
        r="1.25"
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
  props: ['value', 'intervalCount'],
  data() {
    return {
      width: 20,
    };
  },
  computed: {
    pointCount() {
      return this.value.length;
    },
    degreeSeperation() {
      return 360 / this.pointCount;
    },
    polygons() {    
      const degreeSeperation = 360 / this.pointCount;
      const lineSeperation = this.width / this.intervalCount;
      const angleAdjustment = 90;
      const polygons = [...Array(this.intervalCount)]
        .map((_, i) => {
          const points = [...Array(this.pointCount)]
            .map((_, j) => {
              const degrees = ((degreeSeperation * j) - angleAdjustment) 
                * (Math.PI / 180);
              const hyp = this.width - (i*lineSeperation);

              return {
                key: j,
                value: this.intervalCount - i,
                text: this.value[j].key,
                x: Math.cos(degrees) * hyp,
                y: Math.sin(degrees) * hyp,
              };
            });

          return {
            points
          };
        });

      return polygons;
    },
    intervals() {
      const pointStrings = this.polygons
        .map((polygon) => {
          const points = polygon.points
            .map((point) => `${point.x},${point.y}`);
          
          return points.join(' ');
        });

      return pointStrings;
    },
    lines() {
      const outerPolygon = this.polygons[0];
      
      return outerPolygon.points;
    },
    points() {
      const valuePoints = this.polygons
        .map((polygon) => polygon.points);

      return valuePoints;
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
    valuePolygonPoints() {
      const points = this.dragPoints.map((point) => `${point.x},${point.y}`);

      return points.join(' ');
    },
    labels() {
      const outerPolygon = this.polygons[0];

      const labels = outerPolygon.points.map((point) => {
        const lineX = point.x;
        const lineY = point.y;

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
          text: point.text,
          x: x,
          y: y,
        }
      });

      return labels;
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
.radar-polygon {
  fill: rgba(0, 0, 0, 0);
  stroke: #0000008a;
  stroke-width: .25px;
}

.radar-line {
  stroke: #0000008a;
  stroke-width: .25px;
}

.radar-highlight {
  fill: #72a072bf;
  stroke: #72c772bf;
  stroke-width: .5px;
}

.radar-point {
  fill: #72a072;
}

.radar-label {
  user-select: none;
  font-size: 4px;
}
</style>
