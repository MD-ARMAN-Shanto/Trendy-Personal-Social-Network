import React, { Fragment } from 'react'
import Proptypes from 'prop-types'
import withStyles from "@material-ui/core/styles/withStyles";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

//MUI Stuff
import MuiLink from '@material-ui/core/Link';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
//icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';



const styles = (theme)=>({
    ...theme.spreadIt,
    paper: {
        padding: 20
    },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
        },
        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle'
            },
            '& a': {
                color: '#00bcd4',
            }
        },
        '& hr': {
            border: 'none',
            margin: '0 0 10px 0'
        },
        '& svg.button': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    },
    buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    }
});

const StaticProfile = (props) =>{
    const { classes,
        profile:
            {
            handle,
            createdAt,
            imageUrl,
            website,
            bio,
            location}} = props;

    return(
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={imageUrl} alt="profile" className="profile-image"/>
                </div>
                <hr/>
                <div className="profile-details">
                    <MuiLink
                        component={Link}
                        to={`/users/${handle}`}
                        color="primary"
                        variant="h5"
                    >
                        @{handle}
                    </MuiLink>
                    <hr/>
                    {bio && <Typography variant="body2">{bio}</Typography>}
                    <hr/>
                    {location && (
                        <Fragment>
                            <LocationOn color="primary"/> <span>{location}</span>
                            <hr/>
                        </Fragment>
                    )}
                    {website && (
                        <Fragment>
                            <LinkIcon color="primary"/>
                            <a href={website} target="_blank" rel="noopener noreferrer">
                                {' '}
                                {website}
                            </a>
                            <hr/>
                        </Fragment>
                    )}
                    <CalendarToday color="primary"/>{' '}
                    <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                </div>
            </div>
        </Paper>
    )
};

StaticProfile.propTypes ={
    profile: Proptypes.object.isRequired,
    classes: Proptypes.object.isRequired
};

export default withStyles(styles)(StaticProfile)
