import React,{useEffect} from 'react';
import firebase from '../../config/firebaseConfig'
var provider = new firebase.auth.OAuthProvider('microsoft.com');

function Login() {


  useEffect(() => {
    localStorage.setItem('teacherID','PARINYA SEETAWAN')
  },[])


  const SignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then( result => {
      console.log(result.additionalUserInfo.profile.displayName);
    this.setState({
      displayName : result.additionalUserInfo.profile.displayName,
      givenName:result.additionalUserInfo.profile.givenName,
      surname:result.additionalUserInfo.profile.surname,
      id:result.additionalUserInfo.profile.id,
      mail:result.additionalUserInfo.profile.mail,
      jobTitle:result.additionalUserInfo.profile.jobTitle
    })
  })
  .catch(function(error) {
  });
  
  }
  const SignOut = async () => {
    await firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log('Sign-out successful.');
    }).catch(function(error) {
      // An error happened.
      console.error(error);
    });
  }

  return (
    <div className='logo'>
      <div className='container'>
        <div className='App-logo'>
          <h1><img src="/Chiang_Mai_University_Logo.png" width='400px'/></h1>
        </div>
        <button type="button" className="bt btn" href="#" onClick={() => SignIn()}>LOGIN WITH CMU ACCOUNT</button>
      </div>
    </div>
  );
}

export default Login;