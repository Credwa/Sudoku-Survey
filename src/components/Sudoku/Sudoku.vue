<template>
    <div class="wrap">
      <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="290">
          <v-card class="hintDialog">
            <v-card-title class="headline">Would you like a hint?</v-card-title>
            <v-card-text>
              <CountDown :time="20 * 1000" ref="hintTimer">
                <template slot-scope="props">
                  <div class="timer">
                    <p>{{ props.seconds }} seconds </p>
                  </div>
                </template>
              </CountDown>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click.native="showHint">Show Hint</v-btn>
              <v-btn color="red darken-1" flat @click.native="ignoreHint">Ignore</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
      <CountDown :time="10 * 60 * 1000" ref="puzzleTimer">
        <template slot-scope="props">
          <div class="timer">
            {{ props.minutes }} minutes, {{ props.seconds }} seconds.
          </div>
        </template>
      </CountDown>
      <h1>SudokuJS simple demo</h1>
      <!--the only required html-->
      <div id="sudoku" class="sudoku-board">
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import CountDown from '@/components/countdown';

const board = [,  
  5,,  ,
  ,
  
  2,
  3,
  8,,
  ,
  
  1,,  ,
  ,
  
  4,,
  ,
  
  5,,  
  2,,
  ,
  
  5,,  ,
  ,
  ,
  
  5,,  
  7,
  8,,
  ,
  
  2,
  1,,  
  4,
  6,,  
  2,
  3,
  7,,  
  5,
  8,,  
  9,
  8,,
  ,
  
  5,
  4,,  
  7,,  ,
  ,
  ,
  
  6,,
  ,
  
  4,,  
  1,,
  ,
  
  9,,  ,
  ,
  
  6,,
  ,
  
  7,
  3,
  4,,  ,
  ,
  
  9,
  undefined,
];
export default {
  components: {
    CountDown,
  },
  data() {
    return {
      dialog: false,
      shownHints: 0,
      ignoredHints: 0,
    };
  },
  watch: {
    dialog(val) {
      if (val) {
        this.$refs.puzzleTimer.pause();
        this.$refs.hintTimer.restart();
      }
      if (!val) {
        this.$refs.puzzleTimer.start();
      }
    },
  },
  computed: {
    ...mapState('main', ['key']),
    ...mapState('sudoku', ['userControlGroup']),
  },
  methods: {
    showHint() {
      this.dialog = false;
      this.shownHints = this.shownHints + 1;
    },
    ignoreHint() {
      this.dialog = false;
      this.ignoredHints = this.ignoredHints + 1;
    },
  },
  mounted() {
    require('./sudokuJS.js');
    const mySudokuJS = $('#sudoku').sudokuJS({
      board,
    });
    $('.js-solve-step-btn').on('click', mySudokuJS.solveStep);
    $('.js-solve-all-btn').on('click', mySudokuJS.solveAll);
  },
  created() {
    setInterval(() => {
      this.dialog = true;
      setTimeout(() => {
        this.dialog = false;
        this.ignoredHints = this.ignoredHints + 1;
      }, 20000);
    }, this.userControlGroup * 1000);
  },
};
</script>

<style scoped>
@import "./sudokuJS.css";
* {
  margin: 0;
  padding: 0;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.wrap {
  padding: 2em 1em;
  width: 400px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 30em) {
  .wrap {
    width: 490px;
  }
  .sudoku-board input {
    font-size: 24px;
    font-size: 1.5rem;
  }
  .sudoku-board .candidates {
    font-size: 0.8em;
  }
}

.hintDialog {
  height: 50vh;
  display: flex;
  justify-content: space-around;
  align-content: center;
  align-items: center;
  flex-direction: column;
}

.timer {
  font-size: 1.4em;
  height: 50px;
  color: white;
  background: #114357; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #f29492,
    #114357
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #f29492,
    #114357
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>

