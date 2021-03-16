import { Component } from "react";
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

const ChekiListItem = ({ maid, maid_cafe, date }) => (
    <li>{maid.join(", ")} @ {maid_cafe} -- {date}</li>
);

class ChekiListBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    _render() {
        return (<h2>Cheki List</h2>);
    }

    componentDidMount() {
        const query = this.props.firebase.db.collection("test_user").orderBy("date", "desc").limit(this.state.limit);
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