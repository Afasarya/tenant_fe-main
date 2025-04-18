import { createStore } from "vuex";

// Define the types for the state
interface State {
  projectId: any;
}

// Define mutation types
const SET_DEFAULT_PROJECT = "SET_DEFAULT_PROJECT";

const store = createStore<State>({
  state: {
    projectId: null,
  },
  mutations: {
    [SET_DEFAULT_PROJECT](state, payload: any) {
      state.projectId = payload;
    },
  },
  actions: {
    set_project_id({ commit }, projectId: any) {
      commit(SET_DEFAULT_PROJECT, projectId);
    },
  },
  getters: {
    projectId: (state): any => state.projectId,
  },
});

export default store;
