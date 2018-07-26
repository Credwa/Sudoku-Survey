// controls state for sudoku related items
import state from './state';
import * as getters from './getters';
import * as mutations from './mutations';

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
