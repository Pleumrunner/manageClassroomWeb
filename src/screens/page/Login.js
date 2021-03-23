import React, { useEffect } from "react";
import firebase from "../../config/firebaseConfig";
var provider = new firebase.auth.OAuthProvider("microsoft.com");

function Login() {

  const SignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result.additionalUserInfo.profile.displayName);
        localStorage.setItem(
          "teacherID",
          result.additionalUserInfo.profile.displayName
        );
        

        this.setState({
          displayName: result.additionalUserInfo.profile.displayName,
          givenName: result.additionalUserInfo.profile.givenName,
          surname: result.additionalUserInfo.profile.surname,
          id: result.additionalUserInfo.profile.id,
          mail: result.additionalUserInfo.profile.mail,
          jobTitle: result.additionalUserInfo.profile.jobTitle,
        });
        
      })
      .catch(function (error) {});
      
      // window.location.reload(false);
  };
  const SignOut = async () => {
    await firebase
      .auth()
      .signOut()
      .then(function (re) {
        // Sign-out successful.
        console.log(re)
        console.log("Sign-out successful.");
      })
      .catch(function (error) {
        // An error happened.
        console.error(error);
      });
  };

  return (
    <div className="logo">
      <div className="container">
        <div className="App-logo">
          <h1>
            <img src={require( "../../image/006.png")} width="400px" />
          </h1>
          <h3 className="text">CMU ATTENDANCE</h3>
        </div>
        <button
          type="button"
          className="bt btn"
          href="#"
          onClick={async() => {
            await SignIn()
            
          }}
        >
          LOGIN WITH CMU ACCOUNT
        </button>
        <button
          type="button"
          className="bt btn mt-3"
          href="#"
          onClick={() => SignOut()}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Login;
