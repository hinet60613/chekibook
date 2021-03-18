import { Paper } from '@material-ui/core';
import { useState } from "react";
import { withFirebase } from "../Firebase";


const INITIAL_STATE = {
    maid: '',
    maid_cafe: '',
    date: '',
    is_2shot: false,
    received: false,
}

const NewChekiFormBase = ({ firebase }) => {
    const [inputData, setInputData] = useState({ ...INITIAL_STATE });

    const handleChange = (event) => {
        setInputData({
            ...inputData,
            [event.target.name]: event.target.value,
        });
    }

    const handleMaidNameChange = (event) => {
        setInputData(prevData => ({
            ...prevData,
            maid: event.target.value.split(',')
        }));
    }

    const handleCheckboxToggle = (event) => {
        console.log({ target: event.target });
        setInputData({
            ...inputData,
            [event.target.name]: event.target.checked,
        })
    }

    const handleSubmit = (e) => {
        console.log('submit new cheki', { ...inputData });
        const checkiCollection = firebase.firestore.collection(firebase.auth.currentUser.uid);
        checkiCollection.add(inputData)
            .then((docRef) => {
                console.log("new data added.", { docRef });
            })
            .catch(console.log);
        e.preventDefault();
    }

    const { maid, maid_cafe, date } = inputData;
    const isInvalid = (maid === '' || maid_cafe === '' || date === '');

    return (
        <Paper elevation={1}>
            <h3>Add new cheki.</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        onChange={handleChange}
                        placeholder="Date"
                    />
                </div>
                <div>
                    <label>Maid Cafe</label>
                    <input
                        type="text"
                        name="maid_cafe"
                        onChange={handleChange}
                        placeholder="Maid Cafe"
                    />
                </div>
                <div>
                    <label>Maid Name</label>
                    <input
                        type="text"
                        name="maid"
                        onChange={handleMaidNameChange}
                        placeholder="Maid"
                    />
                </div>
                <div>
                    <input type="checkbox" name="is_2shot" onChange={handleCheckboxToggle} />
                    <label>This is a 2 shot.</label>
                </div>
                <div>
                    <input type="checkbox" name="received" onChange={handleCheckboxToggle} />
                    <label>I've received this cheki.</label>
                </div>
                <button type="submit" disabled={isInvalid}>
                    Add new cheki
                </button>
            </form>
        </Paper>
    );

}

const NewChekiForm = withFirebase(NewChekiFormBase);
export default NewChekiForm;