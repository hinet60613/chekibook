import { Component, useEffect, useState } from "react";
import { withFirebase } from "../Firebase/context";

const INITIAL_STATE = {
    docs: [],
    limit: 10,
    nextQuery: null,
    error: null,
};

const TEST_DATA = [
    { maid: ["Miru"], maid_cafe: "Crescendo", date: "2021-02-16" },
    { maid: ["Ririka"], maid_cafe: "Crescendo", date: "2021-02-16" },
];

const ChekiListItem = (props) => {
    console.log('render cheki list item', props)
    const { maid, maid_cafe, date, is_2shot, received } = props;
    const _ITEM = () => (
        <span>
            {(is_2shot) ? '[2shot]' : ''}
            {maid.join(", ")} @ {maid_cafe} -- {date}
        </span>
    );

    return (
        <li>
            {received ?
                <del><_ITEM /></del> : <_ITEM />}
        </li>
    );
}

const ChekiListBase = ({ firebase }) => {
    const LIMIT = 10;
    const initQuery = firebase.firestore.collection("test_user").orderBy("date", "desc").limit(LIMIT);
    const [query, setQuery] = useState(initQuery);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('querying...');
        setLoading(true);
        query.get().then(snapshots => {
            //console.log({docs: snapshots.docs.map(doc => doc.data())});
            setDocs(snapshots.docs.map(doc => doc.data()));
            setLoading(false);
        });
    }, [query]);

    return (
        <div>
            {
                loading ? 'loading...' :
                    (
                        <ul>
                            {
                                docs.map(({ maid, maid_cafe, date, is_2shot, received }) => (
                                    <ChekiListItem
                                        maid={maid}
                                        maid_cafe={maid_cafe}
                                        date={date}
                                        is_2shot={is_2shot}
                                        received={received}
                                    />
                                ))
                            }
                        </ul>
                    )
            }
        </div>
    )
}

class _ChekiListBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        const query = this.props.firebase.firestore.collection("test_user").orderBy("date", "desc").limit(this.state.limit);
        query.get().then((snapshots) => {
            this.setState({ docs: snapshots.docs.map(doc => doc.data()) });
        })
            .catch(error => {
                this.setState({
                    error,
                    //docs: TEST_DATA,
                });
            });
    }

    renderRows() {
        return this.state.docs.length == 0 ? <p>Loading...</p> :
            this.state.docs.map(
                ({ maid, maid_cafe, date }) =>
                    <ChekiListItem
                        maid={maid}
                        maid_cafe={maid_cafe}
                        date={date}
                    />
            );
    }

    render() {
        const { error } = this.state;
        return (
            <div>
                <h2>Cheki List</h2>
                <div>Count: {this.state.docs.length}</div>
                <ul>
                    {this.renderRows()}
                </ul>
                {error && <p>{error.message}</p>}
            </div>
        );
    }
}

const ChekiList = withFirebase(ChekiListBase);

export default ChekiList;
export { ChekiListBase };