import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
//MUI Stuff
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
//redux stuff
import {connect} from 'react-redux'
import {submitComment} from "../redux/actions/dataActions";
//icon stuff
import CircularProgress from "@material-ui/core/CircularProgress";


const styles = theme =>({
    ...theme.spreadIt,
    submitButton:{
        position:'relative',
    },
    progressSpinner: {
        position: 'absolute'
    }
});

class CommentForm extends Component {
    state={
        body:'',
        errors:{}
    };

    handleChange=(event)=>{
        this.setState({[event.target.name]: event.target.value})
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.ui.errors){
            this.setState({errors: nextProps.ui.errors})
        }
        if(!nextProps.ui.errors && !nextProps.ui.loading){
            this.setState({body:''})
        }
    }
    handleSubmit=(event)=>{
        event.preventDefault();
        this.props.submitComment(this.props.screamId, {body:this.state.body})
    };
    render() {
        const { classes, authenticated, ui:{ loading } } = this.props;
        const errors = this.state.errors;

        return authenticated ?(
            <Grid item sm={12} style={{textAlign: 'center'}}>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        name="body"
                        type="text"
                        label="Comment on scream"
                        error={!!errors.comment}
                        helperText={errors.comment}
                        value={this.state.body}
                        onChange={this.handleChange}
                        fullWidth
                        className={classes.textField}/>
                    <Button
                        type="Submit"
                        variant="contained"
                        color="primary"
                        className={classes.submitButton}>
                        Submit
                        {loading && (
                            <CircularProgress size={30} className={classes.progressSpinner}/>
                        )}
                    </Button>
                </form>
                <hr className={classes.visibleSeparator}/>
            </Grid>
        ) : null
    }
}

CommentForm.propTypes={
    submitComment: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired,
    authenticated: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired
};

const mapStateToProps = (state) =>({
    ui: state.ui,
    authenticated: state.user.authenticated
});


export default connect(mapStateToProps, { submitComment})(withStyles(styles)(CommentForm));
