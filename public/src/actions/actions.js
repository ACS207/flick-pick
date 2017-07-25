export const loginUser = (user) => {
  console.log('Setting logged in state with: ', user);
  return {
    type: 'USER_LOGIN',
    payload: { isLoggedIn: true, user }
  };
};

export const logoutUser = () => {
  return {
    type: 'USER_LOGOUT',
    payload: { isLoggedIn: false }
  };
};
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

export const clearMovie = () => {
  return {
    type: 'CLEAR_WATCHED_MOVIE',
    payload: {
      watchedMovieTitle: null,
      watchedMovieId: null
    }
  };
};
||||||| merged common ancestors
=======
<<<<<<< HEAD
>>>>>>> feat($launchpad): add route for new users
||||||| merged common ancestors
<<<<<<< HEAD
=======
>>>>>>> feat($launchpad $server): add api routes to update view and picks count

export const setUserReViewSetting = (userReViewSetting) => {
  return {
    type: 'SET_USER_REVIEW_SETTING',
    payload: { userReViewSetting: userReViewSetting }
  };
};

export const toggleUserReViewSetting = () => {
  return {
    type: 'TOGGLE_USER_REVIEW_SETTING'
  };
};

