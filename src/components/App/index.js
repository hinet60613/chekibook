import React from 'react';
import ChekiList, { ChekiListBase } from '../ChekiList';
import NewChekiForm from '../NewCheki';
const App = () => (
    <div>
        <h1>Hello World!</h1>
        <NewChekiForm />
        <ChekiList />
    </div>
)

export default App;