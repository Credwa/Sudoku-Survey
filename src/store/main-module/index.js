// controls applications components shown
// alternate to routing since we only use 1 route and recycle components
import state from './state';
import * as getters from './getters';
import * as mutations from './mutations';

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
