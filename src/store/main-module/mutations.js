export const changeAppDisplay = (state, id) => {
  switch (id) {
    case 0:
      state.app.isSurvey = true;
      state.app.isTutorial = false;
      state.app.isPlaying = false;
      break;
    case 1:
      state.app.isSurvey = false;
      state.app.isTutorial = true;
      state.app.isPlaying = false;
      break;
    case 2:
      state.app.isSurvey = false;
      state.app.isTutorial = false;
      state.app.isPlaying = true;
      break;
    default:
      break;
  }
};

export const setUserKey = (state, key) => {
  state.key = key;
};
