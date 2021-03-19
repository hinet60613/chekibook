import { Paper, Card, CardContent, makeStyles, Typography, Chip, CardMedia } from "@material-ui/core";
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
    const useStyles = makeStyles({
        root: {
            margin: 2,
            width: 176,
            height: 272,
        },
        cardContent: {
            padding: 0,
        },
        cardMedia: {
            width: 160,
            paddingLeft: 8,
            paddingRight: 8,
        },
        title: {
            fontSize: 14,
            textAlign: "center",
        },
        pos: {
            marginBottom: 12,
        },
        maidName: {
            marginTop: -32,
            marginRight: 12,
            textAlign: "right",
        }
    });
    const classes = useStyles();
    return (
        <Card className={classes.root} elevation={4}>
            <CardContent className={classes.cardContent}>
                <Typography className={classes.title} color="textSecondary">
                    {maid_cafe}
                </Typography>
                <CardMedia
                    className={classes.cardMedia}
                    component="img"
                    alt="mock cheki image"
                    width={160}
                    height={214}
                    image="https://dummyimage.com/160x214/aaaaaa/c1c1c1.jpg" />
                <Typography className={classes.maidName} variant="h5" component="h2">
                    {received ? <Chip color="primary" variant="outlined" label="Received" size="small" /> : ''}
                    {is_2shot ? <Chip label="2shot" size="small" /> : ''}
                    {maid.join(", ")}
                </Typography>
                <Typography className={classes.title}>
                    {date}
                </Typography>
            </CardContent>
        </Card>
    );
}

const ChekiList = ({ docs }) => {
    const useStyles = makeStyles({
        root: {
            display: "flex",
            flexWrap: "wrap",
        }
    });
    const classes = useStyles();
    return (
        <div className={classes.root}>
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
        </div>
    );
}

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
        <Paper>
            {loading ? 'loading...' : <ChekiList docs={docs} />}
        </Paper>
    )
}

const ChekiPage = withFirebase(ChekiPageBase);

export default ChekiPage;