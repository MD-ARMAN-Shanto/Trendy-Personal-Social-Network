import React, { Component } from 'react';
import './App.css'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Navbar from "./components/Navbar";
import User from './pages/user'
import jwtDecoded from 'jwt-decode';
import AuthRoute from './util/AuthRoute'
import axios from 'axios'
//redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED} from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";
//MUI stuff
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./util/theme";

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL =
    'https://us-central1-social-app-ebcf3.cloudfunctions.net/api';


const token = localStorage.FBIdToken;
if(token){
    const decodedToken = jwtDecoded(token);
    if (decodedToken.exp * 1001 < Date.now()){
        store.dispatch(logoutUser());
        window.location.href = '/login';

    }else {
        store.dispatch({type: SET_AUTHENTICATED});
        axios.defaults.headers.common['Authorization']= token;
        store.dispatch(getUserData())
    }
}

class App extends Component {
  render() {
    return (
        <MuiThemeProvider theme={theme}>
            <Provider store={store}>
                <Router>
                    <Navbar/>
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <AuthRoute exact path="/login" component={Login} />
                            <AuthRoute exact path="/signup" component={Signup} />
                            <Route exact path ="/users/:handle" component={User}/>
                            <Route exact path ="/users/:handle/scream/:screamId" component={User}/>
                        </Switch>
                    </div>
                </Router>
            </Provider>
        </MuiThemeProvider>
    );
  }
}

App.propTypes = {
};

export default App;
