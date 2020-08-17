import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import MyButton from "../util/MyButton";
//icon
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
//Redux stuff
import {connect} from 'react-redux';
import {likeScream, unLikeScream} from "../redux/actions/dataActions";


class LikeButton extends Component {
    likedScream =()=>{
        return !!(this.props.user.likes && this.props.user.likes
            .find(like => like.screamId === this.props.screamId));
    };

    likeScream = () => {
        this.props.likeScream(this.props.screamId)
    };

    unlikeScream = () =>{
        this.props.unLikeScream(this.props.screamId)
    };
    render() {
        const { authenticated } = this.props.user;

        return !authenticated ? (
            <Link to="/login">
                <MyButton tip="like">
                        <FavoriteBorder color="primary"/>
                </MyButton>
            </Link>
        ) : (
            this.likedScream() ? (
                <MyButton tip="Undo like" onClick={this.unlikeScream}>
                    <FavoriteIcon color="primary"/>
                </MyButton>
            ) : (
                <MyButton tip="Like" onClick={this.likeScream}>
                    <FavoriteBorder color="primary"/>
                </MyButton>
            )
        )
    }
}

LikeButton.propTypes ={
    user: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    likeScream: PropTypes.func.isRequired,
    unLikeScream: PropTypes.func.isRequired
};

const mapStateToProps = (state) =>({
    user: state.user
});

const mapActionsToProps ={
    likeScream,
    unLikeScream
};


export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
