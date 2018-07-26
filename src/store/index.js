import Vue from 'vue';
import Vuex from 'vuex';

import sudoku from './sudoku-module';
import main from './main-module';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    main,
    sudoku,
  },
});

export default store;
