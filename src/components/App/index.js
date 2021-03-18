import React, { useEffect, useState } from 'react';
import ChekiList from '../ChekiList';
import { withFirebase } from '../Firebase';
import NewChekiForm from '../NewCheki';
import Protected from '../Protected';


const AppWithAuthBase = ({ firebase }) => {
    const handleSignOutClick = () => {
        firebase.auth.signOut()
            .then(() => {
                window.location.href = "/";
            }).catch(console.log)
    }

    return (
        <div>
            <h2>Hello {firebase.auth.currentUser.displayName}!</h2>
            <button onClick={handleSignOutClick}>Sign Out</button>
            <NewChekiForm />
            <ChekiList />
        </div>
    );
}

const AppWithAuth = withFirebase(AppWithAuthBase);

const AppWithNoAuthBase = ({ firebase }) => {
    const handleSignInClick = () => {
        firebase.auth.signInWithPopup(firebase.GoogleAuthProvider)
            .then(result => result.user.getIdToken(true))
            .then((idToken) => {
                if (idToken) {
                    window.location.href = '/';
                }
            });
    }
    return (

        <div>
            <h1>Hello!</h1>
        Please <button onClick={handleSignInClick}>sign in.</button>

        </div>
    );
}

const AppWithNoAuth = withFirebase(AppWithNoAuthBase);

const AppBase = ({ firebase }) => {
    const [currentUser, setCurrentUser] = useState(firebase.auth.currentUser);
    useEffect(() => {
        const unListen = firebase.auth.onAuthStateChanged(
            authUser => {
                authUser ?
                    setCurrentUser(authUser) :
                    setCurrentUser(null)
            }
        );
        return () => { unListen(); }
    }, [firebase.auth.currentUser]);
    //return ((currentUser) ? <AppWithAuth /> : <AppWithNoAuth />);
    return <Protected user={currentUser} render={AppWithAuth} fail={AppWithNoAuth} />;
}

const App = withFirebase(AppBase);

export default App;