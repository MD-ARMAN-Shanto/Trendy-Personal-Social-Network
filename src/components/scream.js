import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import MyButton from "../util/MyButton";
import DeleteScream  from '../components/deleteScream'
import ScreamDialog from '../components/screamDialog'
import LikeButton from "./likeButton";

//icon stuff
import ChatIcon from '@material-ui/icons/Chat';

//redux stuff
import { connect } from 'react-redux'

const styles = {
    card: {
        position:'relative',
        display: 'flex'
    },
    image: {
        minWidth: 130,
    },
    content: {
        padding: 20,
        objectFit: 'cover'
    }
};

class Scream extends PureComponent {
    render() {
        dayjs.extend(relativeTime);
        const {
            classes,
            scream:
                {
                screamId,
                body,
                userHandle,
                likeCount,
                commentCount,
                userImage,
                createdAt},
            user:{
                authenticated,
                credentials:{ handle}
            }
        } = this.props;

        let deleteButton = authenticated && userHandle === handle ?
            (
                <DeleteScream screamId={screamId}/>
            ):null;
        return (
            <Card className={classes.card}>
                <CardMedia
                    image={userImage}
                    title="Profile image"
                    className={classes.image}/>
                <CardContent className={classes.content} >
                    <Typography variant="h6"
                                component={Link}
                                to={`/users/${userHandle}`}
                                color="primary">
                        {userHandle}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    <LikeButton screamId={screamId}/>

                    <span>{likeCount > 1 ?
                        (<span>{likeCount} likes</span>) :
                        (<span>{likeCount} like</span>)}
                    </span>

                    <MyButton tip="comment">
                        <ChatIcon color="primary"/>
                    </MyButton>

                    <span>{commentCount > 1 ?
                        (<span>{commentCount} comments</span>) :
                        (<span>{commentCount} comment</span>)}
                    </span>

                    <ScreamDialog
                        screamId={screamId}
                        userHandle={userHandle}
                        openDialog={this.props.openDialog}
                    />
                </CardContent>
            </Card>
        );
    }
}

Scream.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
};

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Scream));
