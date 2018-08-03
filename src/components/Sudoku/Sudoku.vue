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
      <CountDown :time="countdownTimer" ref="puzzleTimer">
        <template slot-scope="props">
          <div class="timer">
            {{ props.minutes }} minutes, {{ props.seconds }} seconds.
          </div>
        </template>
      </CountDown>
      <br><h1>Complete before time up!</h1> <br>
      <!--sudoku board-->
      <div id="sudoku" class="sudoku-board">

      </div>
    <!-- <div>
      Solve: <button type="button" class="js-solve-step-btn">One Step</button>
      <button type="button" class="js-solve-all-btn">All</button>
    </div> -->
    </div>
</template>

<script>
import CountDown from '@/components/countdown.vue';
import { mapMutations, mapState } from 'vuex';
import firebase from '../../config/firebaseinit';

const board = [
  ,
  ,
  7,
  9,
  ,
  1,
  ,
  4,
  ,
  2,
  ,
  ,
  ,
  ,
  5,
  1,
  ,
  ,
  8,
  9,
  ,
  ,
  ,
  ,
  ,
  ,
  5,
  ,
  4,
  2,
  ,
  3,
  ,
  ,
  6,
  ,
  1,
  ,
  3,
  ,
  9,
  ,
  4,
  ,
  7,
  ,
  8,
  ,
  ,
  1,
  ,
  2,
  5,
  ,
  9,
  ,
  ,
  ,
  ,
  ,
  ,
  3,
  2,
  ,
  ,
  8,
  7,
  ,
  ,
  ,
  ,
  4,
  ,
  1,
  ,
  3,
  ,
  2,
  6,
  ,
  ,
];

const correctBoard = [
  5,
  6,
  7,
  9,
  2,
  1,
  3,
  4,
  8,
  2,
  3,
  4,
  8,
  7,
  5,
  1,
  9,
  6,
  8,
  9,
  1,
  6,
  4,
  3,
  7,
  2,
  5,
  7,
  4,
  2,
  5,
  3,
  8,
  9,
  6,
  1,
  1,
  5,
  3,
  2,
  9,
  6,
  4,
  8,
  7,
  6,
  8,
  9,
  4,
  1,
  7,
  2,
  5,
  3,
  9,
  7,
  6,
  1,
  5,
  4,
  8,
  3,
  2,
  3,
  2,
  8,
  7,
  6,
  9,
  5,
  1,
  4,
  4,
  1,
  5,
  3,
  8,
  2,
  6,
  7,
  9,
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
      mySudoku: null,
      countdownTimer: 600000,
      indicesOfNonePreFilledCells: [],
      ip: null,
    };
  },
  watch: {
    dialog(val) {
      if (val) {
        this.$refs.puzzleTimer.pause();
        this.$refs.hintTimer.restart();
        // console.log(this.calculateBoardCompletionPerc());
      }
      if (!val) {
        this.$refs.puzzleTimer.start();
      }
    },
  },
  computed: {
    ...mapState('main', ['key']),
    ...mapState('sudoku', ['userControlGroup', 'user']),
  },
  methods: {
    ...mapMutations('main', ['changeAppDisplay']),
    showHint() {
      this.dialog = false;
      this.shownHints = this.shownHints + 1;
      this.mySudoku.solveStep();
    },
    ignoreHint() {
      this.dialog = false;
      this.ignoredHints = this.ignoredHints + 1;
    },
    calculateBoardCompletionPerc() {
      let correctAnswers = 0;
      const totalInitialBlankCells = this.indicesOfNonePreFilledCells.length;
      const currentBoard = Object.values(this.mySudoku.getBoard());
      this.indicesOfNonePreFilledCells.forEach((val, index) => {
        if (currentBoard[val].val === correctBoard[val]) {
          correctAnswers++;
        }
      });
      return (correctAnswers / totalInitialBlankCells * 100).toFixed(2);
    },
    async getUserIP() {
      const response = await fetch('https://api.ipify.org?format=json');
      const json = await response.json();
      this.ip = json.ip;
    },
    saveDataOnPuzzleEnd(message) {
      const date = new Date();
      firebase
        .database()
        .ref('/surveys')
        .push({
          userSurveyInfo: this.user,
          shownHints: this.shownHints,
          ignoredHints: this.ignoredHints,
          completedAt: `${date.toDateString()} ${date.getUTCHours()}:${date.getUTCMinutes()}`,
          timeElapsed:
            message === 'time up'
              ? this.$refs.puzzleTimer.getTimeElapsed(this.countdownTimer)
              : this.$refs.puzzleTimer.getTimeElapsed(),
          completion:
            message === 'solved' ? 100 : this.calculateBoardCompletionPerc(),
          userIPAddress: this.ip,
        });
      firebase
        .database()
        .ref('user-ip-list/')
        .push({
          IP: this.ip,
        })
        .then((res) => {
          console.log('ip saved');
        })
        .catch((err) => {
          console.log(err);
        });
    },
    timeUpOrPuzzleSolved(message) {
      console.log(message);
      this.saveDataOnPuzzleEnd(message);
      this.changeAppDisplay(-1);
    },
  },
  mounted() {
    // Generate board
    require('./sudokuJS.js');
    const self = this;
    const mySudokuJS = $('#sudoku').sudokuJS({
      board,
      boardFinishedFn(data) {
        self.timeUpOrPuzzleSolved('solved');
      },
    });
    this.mySudoku = mySudokuJS;
    $('.js-solve-step-btn').on('click', mySudokuJS.solveStep);
    $('.js-solve-all-btn').on('click', mySudokuJS.solveAll);
  },
  created() {
    const self = this;
    firebase
      .database()
      .ref('/admin-data')
      .once('value')
      .then((snapshot) => {
        self.countdownTimer = snapshot.val().timer;
      });
    this.getUserIP();
    // interval for pop ups
    if (this.userControlGroup !== 0) {
      setInterval(() => {
        this.dialog = true;
        setTimeout(() => {
          if (self.dialog) {
            self.ignoredHints++;
            self.dialog = false;
          }
        }, 20000);
      }, this.userControlGroup * 1000);
    }

    // End puzzle on time up
    setTimeout(() => {
      self.timeUpOrPuzzleSolved('time up');
    }, this.countdownTimer);

    // Save
    for (let i = 0; i < board.length; i++) {
      if (board[i]) {
        // console.log(i)
      } else {
        this.indicesOfNonePreFilledCells.push(i);
      }
    }
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

