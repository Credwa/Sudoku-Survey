<template>
  <div class="main">
    <survey v-if="app.isSurvey"></survey>
    <tutorial v-if="app.isTutorial"></tutorial>
    <sudoku v-if="app.isPlaying"></sudoku>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Sudoku from '@/components/Sudoku/Sudoku.vue';
import Survey from '@/components/Survey.vue';
import Tutorial from '@/components/Tutorial.vue';

export default {
  name: 'home',
  components: {
    Sudoku,
    Survey,
    Tutorial,
  },
  computed: {
    ...mapState('main', ['app']),
  },
  created() {},
};
</script>
