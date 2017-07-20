import { toggleUserReviewSetting } from '../actions/actions.js';

const defaultSettingsState = {
  displayUserReviews: false
};

export default function userSettingsReducer(state = defaultSettingsState, action) {
  switch (action.type) {
    case 'TOGGLE_USER_REVIEW_SETTING':
      return Object.assign({}, state, {
        displayUserReviews: action.payload.displayUserReviews
      });
    case 'SET_USER_REVIEW_SETTING':
      return Object.assign({}, state, {
        setUserReviewSetting: action.payload.setUserReviewSetting
      });

    default:
      return state;
  }
};
