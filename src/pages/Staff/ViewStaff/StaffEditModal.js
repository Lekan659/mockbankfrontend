import React, { Component, Fragment } from 'react';
import { makeRequest, handleError} from 'utils/axios-helper';
import getInitials from 'utils/getInitials';
import { ExampleWrapperSimple, Profile } from '../../../layout-components';
import { ContainerWithLoader } from 'components'
import qs from 'qs';
import {withSnackbar} from 'notistack';
import { connect } from 'react-redux';
import { setIsAuthenticatedStatus } from 'actions'
import withPermission from 'utils/permission'
import { Close as CloseIcon } from '@material-ui/icons'
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    withStyles,
    Divider,
    createStyles,
    DialogActions,
    Button,
    CardActions,
    TextField,
    Grid,
    MenuItem,
    AppBar,
    Toolbar,
    IconButton,
    Typography
} from '@material-ui/core';

    const useStyles = createStyles(theme =>({
        appBar: {
            position: 'relative',
            backgroundColor: '#32a387',
            justifyContent: "space-between",
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        dialogContent: {
            paddingBottom: 40
        }
    }))
   
    class StaffEditModal extends Component{

        constructor(props){
            super(props)
            this.state = {
                form_input:{
                    ...this.props.data,
                    email: this.props.data.auth.email
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
            makeRequest(this.props).post('/staff/update', qs.stringify(this.state.form_input))
            .then(response => {
                this.props.enqueueSnackbar(response.data.message, {variant:'success'});
                this.props.updateRows(this.state.form_input,this.props.selectedIndex)
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
                <Dialog
                open={this.props.open}
                scroll={"paper"}
                fullWidth
                maxWidth={"lg"}
                >
                    <AppBar className={this.props.classes.appBar} elevation={0}>
                        <Toolbar>
                            <Typography variant="h4" className={this.props.classes.title}>
                                Edit Staff
                            </Typography>
                            <IconButton edge="start" color="inherit" onClick={this.props.onClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <DialogContent className={this.props.classes.dialogContent}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Profile user={this.props.data}/>
                                    <Divider style={{marginTop: 20, marginBottom: 20}}/>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={4}>
                                    <TextField 
                                        fullWidth 
                                        value={this.state.form_input.email}
                                        name="email" 
                                        variant="outlined" 
                                        label="Email" 
                                        disabled
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
                            <Divider style={{marginTop: 20, marginBottom: 20}}/>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={6} lg={4}>
                                    <TextField 
                                        fullWidth
                                        value="Upload Image"
                                        name="position" 
                                        variant="outlined" 
                                        label="Profile Image" 
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={4}>
                                    <ContainerWithLoader isLoading={false}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            disableElevation 
                                        >
                                            Upload
                                        </Button>
                                    </ContainerWithLoader>
                                </Grid>
                            </Grid>
                    </DialogContent>
                </Dialog>
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
            withStyles(useStyles)(StaffEditModal)))