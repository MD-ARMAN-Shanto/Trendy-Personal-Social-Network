import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import MyButton from "../util/MyButton";
import withStyles from "@material-ui/core/styles/withStyles";

//MUI Stuff
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
//icon stuff
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
import CloseIcon from "@material-ui/icons/Close";

//redux stuff
import { connect } from 'react-redux';
import { logoutUser } from "../redux/actions/userActions";


const styles = theme =>({
    ...theme.spreadIt,
    dialogTitle:{
        left:'30%'
    }
});

class LogOut extends Component {
    state={
        open: false
    };

    handleOpen =()=>{
        this.setState({open: true})
    };

    handleClose =()=>{
        this.setState({open: false})
    };

    handleLogout= () =>{
        this.props.logoutUser()
    };
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Logout" onClick={this.handleOpen}>
                    <KeyboardReturn color="primary"/>
                </MyButton>
                    <Dialog
                        open={this.state.open}
                        fullWidth
                        maxWidth="sm"
                    >
                        <DialogTitle className={classes.dialogTitle}>Do you want to log out ?</DialogTitle>
                            <DialogActions>
                                <Button className={classes.button} variant="outlined" onClick={this.handleLogout} color="secondary">Yes</Button>
                                <Button className={classes.button} variant="outlined" onClick={this.handleClose} color="primary">No</Button>
                            </DialogActions>
                    </Dialog>

            </Fragment>
        );
    }
}

LogOut.propTypes = {
    logoutUser: PropTypes.func.isRequired
};

export default connect(null, {logoutUser} ) (withStyles(styles)(LogOut));
