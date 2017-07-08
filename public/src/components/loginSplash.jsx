import React from 'react';
import { connect } from 'react-redux';

let LoginSplash = ({ dispatch, onGoogleLoginClick, onFacebookLoginClick }) => {
  return (
    <div>
      <div>
        <div>
          <a href="/auth/facebook" >
            <img className="oauth-button" src="assets/facebookLogin.png" />
          </a>
          <a href="/auth/google" >
            <img className="oauth-button" src="assets/googleLogin.png" />
          </a>
        </div>
        <div>
          <button onClick={onGoogleLoginClick}>
            Log In With Google
          </button>
          <button onClick={onFacebookLoginClick}>
            Log In With Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

// Does not neet state, only needs dispatch, which is the return
// of an empty connect invocation
LoginSplash = connect()(LoginSplash);

export default LoginSplash;
