import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Link, withRouter} from 'react-router-dom'
import { connect } from 'react-redux';

import { Sidebar, Header, Footer } from '../../layout-components';
import {makeRequest,handleError} from 'utils/axios-helper';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  withStyles,
  createStyles,
  Divider,
  CircularProgress,
  Box
} from '@material-ui/core';
import {
  setSessionToken,
  setIsAuthenticatedStatus, 
  setUserData, 
  setUserPermissions, 
  setOfficeLocation, 
  setUserOfficeLocation,
  setOptions
} from 'actions';
import {withSnackbar} from 'notistack'
import qs from 'qs'
import { ContainerWithLoader} from 'components'

const useStyles = createStyles(theme => ({
  preloader:{
    width:'100%',
    height:'100vh',
    position:'fixed',
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: '45vh'
  },
  textField:{
    marginBottom: theme.spacing(3)
  }
}))

class LeftSidebar extends Component{

  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: "---------------",
      isLoading:false,
      windowIsLoading: true
    }
  }

  handleContinue = event => {
    this.setState({isLoading:true});
        makeRequest().post('/auth/login', qs.stringify({email:this.state.email,password:this.state.password}))
        .then(response => {
            this.props.dispatch(setSessionToken(response.data.token))
            this.props.dispatch(setUserData(response.data.user))
            this.props.dispatch(setIsAuthenticatedStatus(true))
            this.props.enqueueSnackbar("Welcome Back! You can pick up your work from where you stopped", {variant:'success'});
            this.setState({password:'---------------'})
        })
        .catch(error => {
            handleError({
                error: error,
                callbacks: {
                400: response=>{ this.props.enqueueSnackbar(response.data.message, {variant: "error"}); },
                404: response=>{ this.props.enqueueSnackbar(response.data.message, {variant: "error"}); }
                }
            }, this.props);
        })
        .finally(() => {
            this.setState({isLoading:false});
        })
        event.preventDefault();
  }

  componentDidMount(){
    //check if token is valid
      makeRequest(this.props).get('/auth/validate')
        .then(response => {
            this.props.dispatch(setUserData(response.data.user))
            this.props.dispatch(setIsAuthenticatedStatus(true))
            this.props.dispatch(setUserPermissions(response.data.permissions))
            this.props.dispatch(setOfficeLocation(response.data.office_location))
            this.props.dispatch(setUserOfficeLocation(response.data.staff_office_location))
            this.props.dispatch(setOptions(response.data.options))
            this.setState({email:response.data.user.auth.email})
        })
        .catch(error => {
            handleError({
                error: error,
                callbacks: {
                  400: response=>{
                    this.props.enqueueSnackbar('Invalid or expired session token', {variant: "error"});
                    this.props.history.push('/login')
                  },
                  401: response=>{
                    this.props.enqueueSnackbar('Invalid or expired session token', {variant: "error"});
                    this.props.history.push('/login')
                  },
                  403: response=>{
                    this.props.enqueueSnackbar('Invalid or expired session token', {variant: "error"});
                    this.props.history.push('/login')
                  },
                  500: response=>{
                    this.props.enqueueSnackbar('Could not verify session token from server', {variant: "error"});
                    this.props.history.push('/login')
                  },
                }
            }, this.props);
        })
        .finally(() => {
            //do nothing
            this.setState({windowIsLoading:false});
        })
  }

  render(){
    return (
      (this.state.windowIsLoading) ? (
          <Fragment>
            <Box className={this.props.classes.preloader}>
              <CircularProgress />
              <p>Loading</p>
            </Box>
          </Fragment>
      ):(
          <Fragment>
            <Dialog open={!this.props.isAuthenticated} aria-labelledby="form-dialog-title">
                <Card variant="outlined">
                  <CardHeader 
                    title="Session Expired!" 
                    subheader="Password is required to continue"
                  />
                  <CardContent>
                    <TextField
                      fullWidth
                      className={this.props.classes.textField}
                      variant="outlined"
                      label="Email"
                      type="email"
                      value={this.state.email}
                      disabled
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Password"
                      type="password"
                      value={this.state.password}
                      onChange={evt => {this.setState({password:evt.target.value})}}
                    />
                  </CardContent>
                  <Divider/>
                  <DialogActions>
                    <ContainerWithLoader isLoading={this.state.isLoading}>
                      <Link to="/login">
                        <Button variant="outlined" color="secondary" style={{marginRight:10}} color="primary" >
                          Restart
                        </Button>
                      </Link>
                      <Button variant="contained" color="primary" disableElevation onClick={this.handleContinue}>
                        Continue
                      </Button>
                    </ContainerWithLoader>
                  </DialogActions>
                </Card>
          </Dialog>
          <div className={clsx('app-wrapper', this.props.contentBackground)}>
            <Header />
            <div
              className={clsx('app-main', {
                'app-main-sidebar-static': !this.props.sidebarFixed
              })}>
              <Sidebar />
              <div
                className={clsx('app-content', {
                  'app-content-sidebar-collapsed': this.props.sidebarToggle,
                  'app-content-sidebar-fixed': this.props.sidebarFixed,
                  'app-content-footer-fixed': this.props.footerFixed
                })}>
                <div className="app-content--inner">
                  <div className="app-content--inner__wrapper">
                    {this.props.children}
                  </div>
                </div>
                <Footer />
              </div>
            </div>
          </div>
        </Fragment>
      )
    );
  }
}

LeftSidebar.propTypes = {
  children: PropTypes.node
};


const mapStateToProps = state => ({
  sidebarToggle: state.ThemeOptions.sidebarToggle,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile,
  sidebarFixed: state.ThemeOptions.sidebarFixed,

  headerFixed: state.ThemeOptions.headerFixed,
  headerSearchHover: state.ThemeOptions.headerSearchHover,
  headerDrawerToggle: state.ThemeOptions.headerDrawerToggle,

  footerFixed: state.ThemeOptions.footerFixed,

  contentBackground: state.ThemeOptions.contentBackground,

  isAuthenticated: state.App.isAuthenticated,
  session_token: state.App.session_token,
  user: state.App.user_data,
  office_location: state.App.office_location
});


export default connect(mapStateToProps,null)(
  withStyles(useStyles)(
    withSnackbar(
      withRouter(LeftSidebar))));
