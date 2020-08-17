import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import AppIcon from '../images/appIcon.jpg'
//MUI Stuff
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from "react-router-dom";

//redux stuff
import { connect } from 'react-redux';
import { signupUser } from "../redux/actions/userActions";

const styles=(theme)=>({
    ...theme.spreadIt,
    signUpFont:{
        fontFamily:'fantasy'
    }
});

class SignUp extends PureComponent {
    constructor(){
        super();
        this.state={
            email: '',
            password: '',
            confirmPassword:'',
            handle:'',
            errors: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.ui.errors){
            this.setState({errors: nextProps.ui.errors})
        }
    }

    handleSubmit=(event) =>{
        event.preventDefault();
        this.setState({
            loading: true
        });
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        };
        this.props.signupUser(newUserData, this.props.history)
    };

    handleChange=(event) =>{
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    render() {
        const { classes, ui: { loading }} = this.props;
        const { errors } = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm className={classes.title}>
                    <img src={AppIcon} alt="App Icon" className={classes.image}/>
                    <Typography
                        variant="h5"
                        color="textPrimary">
                        Sign Up for <span className={classes.signUpFont}>Trendy</span>
                    </Typography>

                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField
                            className={classes.textField}
                            id="email" name="email" type="email"
                            helperText={errors.email}
                            error={!!errors.email}
                            label="Email" value={this.state.email}
                            onChange={this.handleChange}
                            placeholder="ex: trendy@gmail.com"
                            fullWidth
                        />

                        <TextField
                            className={classes.textField}
                            id="password" name="password"
                            label="Password" type="password"
                            helperText={errors.password}
                            error={!!errors.password}
                            value={this.state.password}
                            placeholder="type your password"
                            onChange={this.handleChange}
                            fullWidth
                        />

                        <TextField
                            className={classes.textField}
                            id="confirmPassword" name="confirmPassword"
                            label="confirmPassword" type="password"
                            helperText={errors.confirmPassword}
                            error={!!errors.confirmPassword}
                            value={this.state.confirmPassword}
                            placeholder="as your password"
                            onChange={this.handleChange}
                            fullWidth
                        />

                        <TextField
                            className={classes.textField}
                            id="handle" name="handle"
                            label="Handle" type="text"
                            helperText={errors.handle}
                            error={!!errors.handle}
                            value={this.state.handle}
                            placeholder="ex: Trendy"
                            onChange={this.handleChange}
                            fullWidth
                        />

                        {errors.general && (
                            <Typography
                                variant="body1"
                                className={classes.customError}
                            >
                                {errors.general}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={loading}
                        >Signup
                            {loading &&(
                                <CircularProgress size={30} className={classes.progress}/>
                            )}
                        </Button>
                        <br/>
                        <small>
                            Already have an account? Login <Link to="/login" className={classes.link}>here
                        </Link>
                        </small>
                    </form>
                </Grid>
                <Grid item sm/>
            </Grid>
        );
    }
}

SignUp.propTypes = {
    classes: PropTypes.object.isRequired,
    email: PropTypes.string,
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
    handle: PropTypes.string,
    errors: PropTypes.object,
    loading: PropTypes.bool,
    user: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) =>({
    user: state.user,
    ui: state.ui
});

export default connect(mapStateToProps, { signupUser })(withStyles(styles)(SignUp));
