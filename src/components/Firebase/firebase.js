import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import config from '../../constants/config';

class Firebase {
    constructor(props) {
        app.initializeApp(config);
        this.GoogleAuthProvider = new app.auth.GoogleAuthProvider();
        this.auth = app.auth();
        this.firestore = app.firestore();
        this.FieldValue = app.firestore.FieldValue;
    }
}

export default Firebase;
