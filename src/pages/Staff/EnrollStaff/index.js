import React, { Component, Fragment } from 'react';

import { PageTitle } from '../../../layout-components';
import { Box, Button, CardActions, Divider, Grid } from '@material-ui/core';
import { ExampleWrapperSimple } from '../../../layout-components';
import { TextField,MenuItem } from '@material-ui/core';
import { makeRequest, handleError} from 'utils/axios-helper';
import { ContainerWithLoader } from 'components'
import qs from 'qs';
import {withSnackbar} from 'notistack';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setIsAuthenticatedStatus } from 'actions'
import withPermission from 'utils/permission'
import { setSelectedStaff } from 'actions'

const VIEW_PERMISSION_NAME = "can_add_staff";

class EnrollStaff extends Component{
    constructor(props){
        super(props)
        this.state = {
            form_input:{
                email:null,
                password:null,
                first_name: null,
                last_name: null,
                gender:null,
                phone_number:null,
                position:null,
            },
            isLoading:false,
        };
    }

    handleChange = event =>{
        this.setState({form_input: Object.assign({},
            this.state.form_input,
            {[event.target.name]:event.target.value}
        )})
    }
    
    handleClick = event =>{
        this.setState({isLoading:true});
        makeRequest(this.props).post('/staff/register', qs.stringify(this.state.form_input))
        .then(response => {
            this.props.enqueueSnackbar(response.data.message, {variant:'success'});
            this.props.dispatch(setSelectedStaff(response.data.data))
            this.props.history.push('/staff-permissions')
        })
        .catch(error => {
            handleError({
                error: error,
                callbacks: {
                400: response=>{ this.props.enqueueSnackbar(response.data.message, {variant: "error"}); }
                }
            }, this.props);
        })
        .finally(() => {
            this.setState({isLoading:false});
        })
    }

    render(){
        return(
            <Fragment>
                <PageTitle
                    titleHeading="Enroll Staff"
                    titleDescription="Enroll new staff and set permission"
                />
                <ExampleWrapperSimple sectionHeading="Staff Enrollment Form">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TextField 
                                fullWidth 
                                value={this.state.form_input.email}
                                name="email" 
                                variant="outlined" 
                                label="Email" 
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TextField 
                                fullWidth 
                                value={this.state.form_input.password}
                                name="password" 
                                variant="outlined" 
                                label="Password" 
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TextField 
                                fullWidth 
                                value={this.state.form_input.first_name}
                                name="first_name" 
                                variant="outlined" 
                                label="First Name" 
                                onChange={this.handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TextField 
                                fullWidth
                                value={this.state.form_input.last_name}
                                name="last_name" 
                                variant="outlined" 
                                label="Last Name" 
                                onChange={this.handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TextField 
                                fullWidth 
                                value={this.state.form_input.gender}
                                name="gender" 
                                variant="outlined" 
                                label="Gender" 
                                select 
                                onChange={this.handleChange}
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TextField 
                                fullWidth 
                                name="phone_number"
                                value={this.state.form_input.phone_number} 
                                variant="outlined" 
                                label="Phone Number" 
                                onChange={this.handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TextField 
                                fullWidth
                                value={this.state.form_input.position} 
                                name="position" 
                                variant="outlined" 
                                label="Position" 
                                onChange={this.handleChange} 
                            />
                        </Grid>
                    </Grid>
                    <Divider style={{marginTop: 20, marginBottom: 20}}/>
                    <CardActions style={{ justifyContent: "right" }}>
                        <ContainerWithLoader isLoading={this.state.isLoading}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                disableElevation 
                                onClick={this.handleClick}
                            >Save
                            </Button>
                        </ContainerWithLoader>
                    </CardActions>
                </ExampleWrapperSimple>
            </Fragment>
        )
    }
}
//Map state to props
const mapStateToProps = state => ({
    session_token: state.App.session_token,
    user_permissions: state.App.user_permissions
  });
  
export default connect(mapStateToProps)(
    withSnackbar(
        withPermission(VIEW_PERMISSION_NAME)(
            EnrollStaff)))