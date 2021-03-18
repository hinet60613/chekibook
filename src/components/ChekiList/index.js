import { useEffect, useState } from "react";
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
    const { maid, maid_cafe, date, is_2shot, received } = props;
    return (
        <li>
            {
                received ?
                    <span>
                        <del>
                            {(is_2shot) ? '[2shot]' : ''}
                            {maid.join(", ")} @ {maid_cafe} -- {date}
                        </del>
                    </span>
                    :
                    <span>
                        {(is_2shot) ? '[2shot]' : ''}
                        {maid.join(", ")} @ {maid_cafe} -- {date}
                    </span>
            }
        </li >
    );
}

const ChekiList = ({ docs }) => (
    <ul>
        {
            docs.map(doc => {
                const { id, maid, maid_cafe, date, is_2shot, received } = doc;
                return (
                    <ChekiListItem
                        key={id}
                        maid={maid}
                        maid_cafe={maid_cafe}
                        date={date}
                        is_2shot={is_2shot}
                        received={received}
                    />
                );
            })
        }
    </ul>
)

const ChekiPageBase = ({ firebase }) => {
    const LIMIT = 10;
    const uid = firebase.auth.currentUser.uid;
    const initQuery = firebase.firestore.collection(uid).orderBy("date", "desc").limit(LIMIT);
    const [query, setQuery] = useState(initQuery);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        query.get().then(snapshots => {
            setDocs(snapshots.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
    }, [loading, query]);

    return (
        <div>
            {loading ? 'loading...' : <ChekiList docs={docs} />}
        </div>
    )
}

const ChekiPage = withFirebase(ChekiPageBase);

export default ChekiPage;