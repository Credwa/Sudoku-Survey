<template>
  <v-layout align-center justify-center column fill-height>
    <h1>Tutorial</h1>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/38SrCEj9rsc" frameborder="0" allow="encrypted-media" allowfullscreen>
    </iframe>
    <h3 style="margin-top: 5vh">You will have 10 minutes to complete the puzzle</h3>
    <v-btn color="green" style="margin-top: 5vh" @click="beginPuzzle">Begin</v-btn>
  </v-layout>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import firebase from '../config/firebaseinit';

export default {
  data() {
    return {
      intervals: [20, 34, 48, 62, 76, 90, 0],
    };
  },
  computed: {
    ...mapState('main', ['key']),
    ...mapState('sudoku', ['key', 'user']),
  },
  methods: {
    ...mapMutations('main', ['changeAppDisplay']),
    ...mapMutations('sudoku', ['newControlGroup', 'newUser']),
    getControlGroup() {
      const num = Math.random() * (this.intervals.length - 1);
      return Math.round(num);
    },
    beginPuzzle() {
      const group = this.intervals[this.getControlGroup()];

      // add group to user variable in store
      const user = { ...this.user, group };
      this.newUser(user);

      this.newControlGroup(group);

      this.changeAppDisplay(2);
    },
  },
  created() {
    // get control values from firebase and store them in a variable
    // any 0 means no hints shown
    // overwrites the default intervals value
    firebase
      .database()
      .ref('/admin-data/intervals')
      .once('value')
      .then((snapshot) => {
        this.intervals = snapshot.val();
      });
  },
};
</script>

