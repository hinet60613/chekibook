import { Component, useState } from "react";
import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
    maid: '',
    maid_cafe: '',
    date: '',
}

const NewChekiFormBase = () => {
    const [inputData, setInputData] = useState({ ...INITIAL_STATE });

    const isInvalid = () => {
        const { maid, maid_cafe, date } = inputData;
        return maid === '' || maid_cafe === '' || date === '';
    }

    const handleChange = (event) => {
        setInputData({
            ...inputData,
            [event.target.name]: event.target.value,
        })
    }
    const handleSubmit = (event) => {
        console.log('submit new cheki', { ...inputData });
        event.preventDefault();
    }

    return (
        <div>
            <h3>Add new cheki.</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    name="date"
                    onChange={handleChange}
                    placeholder="Date"
                />
                <input
                    type="text"
                    name="maid_cafe"
                    onChange={handleChange}
                    placeholder="Maid Cafe"
                />
                <input
                    type="text"
                    name="maid"
                    onChange={handleChange}
                    placeholder="Maid"
                />
                <button disabled={isInvalid} type="submit">
                    Add new cheki
                    </button>
            </form>
        </div>
    );

}

const NewChekiForm = withFirebase(NewChekiFormBase);
export default NewChekiForm;