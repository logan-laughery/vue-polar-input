<template>
  <div class="radar-input">
    Radar Input Magic Goes Here
    <svg width="300px" height="300px" viewBox="-40 -40 80 80">
      <polygon
        :points="interval"
        fill="rgba(0, 0, 0, 0)"
        stroke="#0000008a"
        stroke-width=".5px"
        :key="interval"
        v-for="interval in intervals"
      />
      <line
        x1="0"
        y1="0"
        :x2="line.x"
        :y2="line.y"
        stroke="#0000008a"
        stroke-width=".5px"
        :key="i"
        v-for="(line, i) in lines"
      />
      <polygon
        :points="valuePolygonPoints"
        fill="#72c772bf"
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
        font-size="4"
        :key="label.text"
        v-for="label in labels"
      >
        {{label.text}}
      </text>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'RadarInput',
  //props: ['intervalCount', 'width', 'pointCount'],
  data() {
    return {
      //pointCount: 8,
      width: 20,
      intervalCount: 5,
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
  },
}
</script>

<style>
</style>
