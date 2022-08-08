import React, { Component } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import clsx from 'clsx';
import {
    Grid, 
    Card, 
    withStyles,
    createStyles,
    FormControl,
    CardHeader,
    CardContent,
    CardActions,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Button,
    TextField,
    Divider} from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { validateEmail, validatePassword } from '../../utils/validate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeRequest, handleError} from 'utils/axios-helper';
import { ContainerWithLoader } from 'components'
import qs from 'qs';
import {withSnackbar} from 'notistack';
import { connect } from 'react-redux';
import {setIsAuthenticatedStatus,setSessionToken,setUserData,setOptions} from 'actions'
import { TrainOutlined } from '@material-ui/icons';

const useStyles = createStyles( theme => ({
    root: {
      paddingTop: theme.spacing(20),
      height: '100vh'
    },
    grid: {
        [theme.breakpoints.up('sm')]: {
          "min-height": 500
        }
    },
    card: {
        [theme.breakpoints.down('sm')]: {
          boxShadow: "0px 0px 0px 0px"
        },
        [theme.breakpoints.up('sm')]: {
          "max-width": '100%'
        },
    },
    margin: {
      margin: theme.spacing(1)
    },
    withoutLabel: {
      marginTop: theme.spacing(3)
    },
    textField: {
      width: '100%'
    }
  }));

class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
          email: null,
          isValidEmail: false,
          password: null,
          isValidPassword: false,
          showPassword: false,
          isLoading:false
        };
      }
    
    handleLogin = (event) => {
        this.setState({isLoading:true});
        makeRequest().post('/auth/login', qs.stringify({email:this.state.email,password:this.state.password}))
        .then(response => {
            this.props.setSessionToken(response.data.token)
            this.props.setIsAuthenticatedStatus(true)
            this.props.enqueueSnackbar(response.data.message, {variant:'success'});
            console.log(response.data.message)
            this.props.history.push('/dashboard')
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

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
        if(prop == 'email'){
          if(validateEmail(event.target.value)){
            this.setState({isValidEmail:true});
          }
          else{
            this.setState({isValidEmail:TrainOutlined});
          }
        }

        if(prop == 'password'){
          if(validatePassword(event.target.value)){
            this.setState({isValidPassword:true});
          }
          else{
            this.setState({isValidPassword:true});
          }
        }
    };

    handleClickShowPassword = () => {
        this.setState({showPassword: !this.state.showPassword });
    };
    
    render() {
        return (
            <div className={this.props.classes.root}>
              <Grid 
                container 
                className={this.props.classes.grid}
                direction="row"
                justify="center"
              >
                <Grid item xs={10} sm={6} md={5} lg={5} xl={5}>
                  <Card className={this.props.classes.card} elevation={0} variant="outlined" >
                    <form onSubmit={this.handleLogin}>
                      <CardHeader title="Login" subheader="Bethsaida Net" />
                      <CardContent>
                        <TextField
                            fullWidth
                            className="m-2"
                            id="standard-basic"
                            label="Email"
                            variant="outlined"
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                            
                        />
                        <FormControl
                            className={clsx(this.props.classes.margin, this.props.classes.textField)}
                            variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">
                                Password
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={this.state.showPassword ? 'text' : 'password'}
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                endAdornment={
                                    <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                        edge="end">
                                        {this.state.showPassword ? (
                                        <Visibility />
                                        ) : (
                                        <VisibilityOff />
                                        )}
                                    </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={70}
                            />
                        </FormControl>
                      </CardContent>
                      <CardActions style={{ justifyContent: "space-between" }}>
                        <Button>Forgot password</Button>
                        <ContainerWithLoader isLoading={this.state.isLoading}>
                          <Button 
                            variant="contained" 
                            color="secondary" 
                            className="m-2" 
                            onClick={this.handleLogin}
                            disabled={!(this.state.isValidEmail && this.state.isValidPassword)}
                          >
                            <span className="btn-wrapper--label">Sign In</span>
                            <span className="btn-wrapper--icon">
                              <FontAwesomeIcon icon={['far', 'sign-in']} />
                            </span>
                          </Button>
                        </ContainerWithLoader>
                      </CardActions>
                    </form>
                  </Card>
                </Grid>
              </Grid>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
  setSessionToken: token => (dispatch(setSessionToken(token))),
  setIsAuthenticatedStatus: status => (dispatch(setIsAuthenticatedStatus(status))),
  setUserData: user => (dispatch(setUserData(user))),
  setOptions: options => (dispatch(setOptions(options)))
})


export default connect(null, mapDispatchToProps)(withStyles(useStyles)(withSnackbar(withRouter(Login))));