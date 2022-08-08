import React, { Component, Fragment } from 'react';

import { PageTitle } from '../../../layout-components';
import { 
  Typography, 
  Grid, 
  Checkbox, 
  FormControlLabel, 
  Card, 
  CardHeader, 
  createStyles, 
  withStyles,
  TextField,
  MenuItem,
  Paper, 
  Divider,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core';
import { ExampleWrapperSimple } from '../../../layout-components';
import { Category, SettingsApplications as AdminIcon, BarChart as ManagementIcon, Dashboard as BasicIcon } from '@material-ui/icons';
import { makeRequest, handleError} from 'utils/axios-helper';
import { ContainerWithLoader } from 'components'
import qs from 'qs';
import {withSnackbar} from 'notistack';
import { connect } from 'react-redux';
import { setIsAuthenticatedStatus } from 'actions'
import withPermission from 'utils/permission'
import { blue, blueGrey } from '@material-ui/core/colors';
import { Skeleton } from '@material-ui/lab';
import { setSelectedStaff } from 'actions'

const VIEW_PERMISSION_NAME = "can_edit_staff_permission";

const useStyles = createStyles(theme => ({
 cardRoot:{
  
 },
 gridRoot:{
   marginTop: 10, 
 },
 paperRoot: {
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: 400,
},
 formControlLabel:{
   fontSize: 12
 },
 permissionSubHead:{
   fontSize: 17,
   color: blueGrey[500]
 },
 cardActions:{
   justifyContent: "right"
 },
 officeLocationCard:{
   [theme.breakpoints.up("md")]:{
     maxHeight: 250
   }
 }
}))

class StaffPermission extends Component{

  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      permissions: {
        admin: [],
        management: [],
        basic: [],
      },
      staffs: [],
      staff_office_location: [],
      isLoadingStaffOffice: false,
      selectedStaff: this.props.selectedStaff,
      saveIsLoading: false,
      officeLocationSaveIsLoading: false
    }
  }

  componentDidMount(){
    if(this.props.selectedStaff){
      this.resetStaffOfficeLocation(this.props.selectedStaff.id)
    }
    makeRequest(this.props).get(this.props.selectedStaff ? '/staff/permission/'+this.props.selectedStaff.id : '/staff/permission')
        .then(response => {
           this.setState({
             permissions:response.data.data,
             staffs:response.data.data.staffs,
             isLoading:false
            })
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
          //Do nothing
        })
  }

  handleStaffChange = (event) =>{
    this.setState({isLoading:true, isLoadingStaffOffice:true})
    let selectedStaff = null
    for (let index = 0; index < this.state.staffs.length; index++) {
      if(this.state.staffs[index].id == event.target.value){
        selectedStaff = this.state.staffs[index];
        break;
      }
    }
    this.resetStaffOfficeLocation(event.target.value)
    
    makeRequest(this.props).get('/staff/permission/'+event.target.value)
        .then(response => {
           this.setState({
             permissions:response.data.data,
             selectedStaff:selectedStaff,
             isLoading:false
            })
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
          //Do nothing
        })
      event.preventDefault()
  }

  resetStaffOfficeLocation = async (staff_id)=>{
    this.setState({isLoadingStaffOffice:true})
    makeRequest(this.props).get('settings/office-location/staff/'+staff_id)
        .then(response => {
           this.setState({
             staff_office_location: response.data.data,
             isLoadingStaffOffice: false
            })
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
          //Do nothing
        })
  }

  isChecked = (location) =>{
    if(this.state.staff_office_location){
      for (let index = 0; index < this.state.staff_office_location.length; index++) {
        if(location.id == this.state.staff_office_location[index].id){
          return true
        }
      }
      return false
    }
    else{
      return false
    }
  }

  handleCheckOfficeLocation = (index) =>{
    if(this.state.selectedStaff){
      let addNew = true
      let staff_office_location = []
      for (let i = 0; i < this.state.staff_office_location.length; i++) {
        if(this.state.staff_office_location[i].id !== this.props.office_location[index].id){
          staff_office_location.push(this.state.staff_office_location[i])
        }
        else(
          addNew = false
        )
      }
      if(addNew){
        staff_office_location.push(this.props.office_location[index])
      }
      if(staff_office_location.length > 0){
        this.setState({staff_office_location})
      }
      else{
        this.props.enqueueSnackbar("At least one location must be selected", {variant: "default"});
      }
    }
    else{
      this.props.enqueueSnackbar("No staff selected!", {variant: "default"});
    }
  }

  handlePermissionCheck = (category,index,current_state) =>{
    if(this.state.selectedStaff){
      let updated_permission = this.state.permissions[category];
      updated_permission[index].is_assigned = !current_state;
      this.setState({form_input: Object.assign({},
        this.state.permissions,
        {[category]: updated_permission}
      )})
    }
    else{
      this.props.enqueueSnackbar("No staff selected!", {variant: "default"});
    }
  }

  handleSavePermission = event => {
    this.setState({saveIsLoading: true})
    //Serialize Permissions
    let permissions_list = []
    for (const category in this.state.permissions) {
      for (let index = 0; index < this.state.permissions[category].length; index++) {
       permissions_list.push({
         id: this.state.permissions[category][index].id,
         name: this.state.permissions[category][index].name,
         is_assigned: this.state.permissions[category][index].is_assigned
       })
        
      }
    }
    makeRequest(this.props).post('/staff/permission/save/'+this.state.selectedStaff.id, qs.stringify({permissions: permissions_list}))
        .then(response => {
          this.props.enqueueSnackbar(response.data.message, {variant: "success"});
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
          //Do nothing
          this.setState({saveIsLoading: false})
        })
  }

  handleSaveOfficeLocation = event =>{
    this.setState({officeLocationSaveIsLoading: true})
    makeRequest(this.props).post('settings/office-location/staff/save/'+this.state.selectedStaff.id, qs.stringify(
      {office_location: this.state.staff_office_location})
      )
        .then(response => {
          this.props.enqueueSnackbar(response.data.message, {variant: "success"});
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
          //Do nothing
          this.setState({officeLocationSaveIsLoading: false})
        })
  }

  componentWillUnmount(){
    this.props.dispatch(setSelectedStaff(null))
  }

  render(){
    return(
      <Fragment>
          <PageTitle
            titleHeading="Staff Management"
            titleDescription="Edit staff permissions"
          />
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8} >
              <Card >
                <CardHeader 
                  title={this.state.selectedStaff ? this.state.selectedStaff.first_name + " " + this.state.selectedStaff.last_name : "No Staff Selected"}
                  subheader="Staff Permissions"
                  action={
                    <Paper className={this.props.classes.paperRoot} elevation={0}>
                        <TextField 
                          fullWidth 
                          select 
                          label="Select Staff" 
                          variant="outlined"
                          value={this.state.selectedStaff ? this.state.selectedStaff.id : ""}
                          onChange={this.handleStaffChange}
                        >
                        {
                          this.state.staffs.map((staff, index) => (
                            <MenuItem value={staff.id}>{staff.first_name + " " + staff.last_name} ({staff.position})</MenuItem>
                          ))
                        }
                        </TextField>
                    </Paper>
                  }
                />
                <Divider style={{marginBottom:15}}/>

                  {this.state.isLoading ? (
                      <Skeleton variant="rect" width="100%" height="60vh" />
                  ) : (
                    <CardContent>
                      <Typography className={this.props.classes.permissionSubHead}><BasicIcon/> Basic Permissions</Typography>
                      <Grid container spacing={1}>
                            {
                              this.state.permissions.basic.map((permission, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4} className={this.props.classes.gridRoot}>
                                  <FormControlLabel
                                    className={this.props.classes.formControlLabel}
                                    control={
                                    <Checkbox 
                                      name={permission.name} 
                                      checked={permission.is_assigned}
                                      onChange={evt => this.handlePermissionCheck('basic',index, permission.is_assigned)}
                                    />
                                    }
                                    label={permission.display_name}
                                  />
                                </Grid>
                              ))
                            }
                      </Grid>
        
                      <Divider style={{marginBottom:10,marginTop:10}}/>
        
                      <Typography className={this.props.classes.permissionSubHead}><ManagementIcon/> Management Permissions</Typography>
                      <Grid container spacing={1}>
                            {
                              this.state.permissions.management.map((permission, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4} className={this.props.classes.gridRoot}>
                                  <FormControlLabel
                                    className={this.props.classes.formControlLabel}
                                    control={
                                    <Checkbox 
                                      name={permission.name} 
                                      checked={permission.is_assigned}
                                      onChange={evt => this.handlePermissionCheck('management',index, permission.is_assigned)}
                                    />
                                    }
                                    label={permission.display_name}
                                  />
                                </Grid>
                              ))
                            }
                      </Grid>
        
                      <Divider style={{marginBottom:10,marginTop:10}}/>
                      
                      <Typography className={this.props.classes.permissionSubHead}><AdminIcon/> Administrative Permissions</Typography>
                      <Grid container spacing={1}>
                            {
                              this.state.permissions.admin.map((permission, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4} className={this.props.classes.gridRoot}>
                                  <FormControlLabel
                                    className={this.props.classes.formControlLabel}
                                    control={
                                    <Checkbox 
                                      name={permission.name} 
                                      checked={permission.is_assigned}
                                      onChange={evt => this.handlePermissionCheck('admin',index, permission.is_assigned)}
                                    />
                                    }
                                    label={permission.display_name}
                                  />
                                </Grid>
                              ))
                            }
                      </Grid>
                      <Typography className={this.props.classes.permissionSubHead}><AdminIcon/> Administrative Permissions</Typography>
                      <Grid container spacing={1}>
                            {
                              this.state.permissions.teller.map((permission, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4} className={this.props.classes.gridRoot}>
                                  <FormControlLabel
                                    className={this.props.classes.formControlLabel}
                                    control={
                                    <Checkbox 
                                      name={permission.name} 
                                      checked={permission.is_assigned}
                                      onChange={evt => this.handlePermissionCheck('teller',index, permission.is_assigned)}
                                    />
                                    }
                                    label={permission.display_name}
                                  />
                                </Grid>
                              ))
                            }
                      </Grid>
                    </CardContent>
                  )}

                <Divider style={{marginBottom:10,marginTop:10}}/>
                <CardActions className={this.props.classes.cardActions}>
                  <ContainerWithLoader component="span" isLoading={this.state.saveIsLoading}>
                    <Button 
                      variant="contained"
                      disableElevation
                      color="primary"
                      disabled={!this.state.selectedStaff}
                      onClick={this.handleSavePermission}
                    >
                      Save
                    </Button>
                  </ContainerWithLoader>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
            <Card variant="outlined">
                <CardHeader 
                  title={this.state.selectedStaff ? this.state.selectedStaff.first_name + " " + this.state.selectedStaff.last_name : "No Staff Selected"}
                  subheader="Assigned Locations"
                />
                <Divider/>
                {this.state.isLoadingStaffOffice ? (
                      <Skeleton variant="rect" width="100%" height={250} animation="wave" />
                  ) : (
                    <CardContent className={this.props.classes.officeLocationCard}>
                      <List>
                        {
                          this.props.office_location.map((location, index) => (
                            <div>
                                <ListItem key={index}>
                                  <ListItemText id={`checkbox-list-secondary-label-${index}`} primary={location.name} secondary={location.state.name}/>
                                  <ListItemSecondaryAction>
                                    <Checkbox
                                      edge="end"
                                      checked={this.isChecked(location)}
                                      onChange={evt =>this.handleCheckOfficeLocation(index)}
                                      inputProps={{ 'aria-labelledby': `checkbox-list-secondary-label-${index}` }}
                                    />
                                  </ListItemSecondaryAction>
                                </ListItem>
                                {(this.props.office_location.length !== index+1) && 
                                  <Divider variant="fullWidth" />
                                }
                            </div>
                          ))
                        }
                      </List>
                    </CardContent>
                  )}
                <Divider style={{marginBottom:10,marginTop:10}}/>
                <CardActions className={this.props.classes.cardActions}>
                  <ContainerWithLoader component="span" isLoading={this.state.officeLocationSaveIsLoading}>
                    <Button 
                      variant="contained"
                      disableElevation
                      color="primary"
                      disabled={!this.state.selectedStaff}
                      onClick={this.handleSaveOfficeLocation}
                    >
                      Save
                    </Button>
                  </ContainerWithLoader>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          
      </Fragment>
    )
  }
}

//Map state to props
const mapStateToProps = state => ({
    session_token: state.App.session_token,
    user_permissions: state.App.user_permissions,
    selectedStaff: state.App.selectedStaff,
    office_location: state.App.office_location
  });
  
export default connect(mapStateToProps)(
  withSnackbar(
    withPermission(VIEW_PERMISSION_NAME)(
      withStyles(useStyles)(StaffPermission))))