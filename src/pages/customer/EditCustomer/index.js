import React, { Component, Fragment } from 'react';

import { PageTitle } from '../../../layout-components';
import { 
    Box, 
    Button, 
    CardActions, 
    Divider, 
    Grid, 
    Typography, 
    createStyles, 
    withStyles, 
    Card, 
    CardContent,
    Switch,
    CircularProgress,
    CardHeader
} from '@material-ui/core';
import { ExampleWrapperSimple } from '../../../layout-components';
import { TextField, MenuItem, Checkbox, FormControlLabel, } from '@material-ui/core';
import { makeRequest, handleError} from 'utils/axios-helper';
import { ContainerWithLoader, ConfirmationDialog } from 'components'
import qs from 'qs';
import {withSnackbar} from 'notistack';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setIsAuthenticatedStatus } from 'actions'
import {withPermission, withConfirmationDialog} from 'utils'
import { setSelectedStaff } from 'actions'
import Axios from 'axios';
import { green } from '@material-ui/core/colors';

const VIEW_PERMISSION_NAME = "can_view_customer";

const useStyles = createStyles(theme =>({
    typo: {
        fontSize: 12,
        marginLeft: 15,
    },
    checkGrid: {
        backgroundColor: "#f7f7f7"
    },
    box:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
        height: 400
    },
    box2:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
        height: 150
    }
}))

class EditCustomer extends Component{
    constructor(props){
        super(props)
        this.state = {
            form_input:{
                email:null,
                surname: null,
                first_name: null,
                other_name: null,
                gender:null,
                phone_number:null,
                marital_status:null,
                birthday: null,
                mode_of_identification: null,
                identification_no: null,
                bank_name: null,
                bank_account_no: null,
                bank_account_name: null,
                bvn: null,
                office: null,
                marketer: null,
                notify_email: false,
                notify_sms: true,
                is_active: false,
            },
            bank_list: [],
            selectedBank: null,
            bank_list_retrieve_message: "",
            bank_account_no_resolve_message: "",
            marketers_list : [],
            marketers_list_retrieve_message: "",
            isLoading: true,
            current_data: null
        };
    }

    fetchBanks = async ()=>{
        this.setState({bank_list_retrieve_message:"Fetching bank list..."})
        let axios = Axios.create()
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.env_options.paystack_sec_key}`
        axios.get('https://api.paystack.co/bank?perPage=100')
        .then(response=>{
            this.setState({bank_list:response.data.data, bank_list_retrieve_message: "Select Bank"})
        })
        .catch(error => {
            this.setState({bank_list_retrieve_message: "Network error!"})
        })
    }

    fetchMarketers = async ()=>{
        this.setState({marketers_list_retrieve_message:"Fetching marketers list..."})
        makeRequest(this.props).get('/staff/marketers')
        .then(response => {
            this.setState({
                marketers_list: response.data.data,
                marketers_list_retrieve_message:"Select marketers in your location"
            })
        })
        .catch(error => {
            handleError({
                error: error,
                callbacks: {
                    400: response=>{ this.setState({marketers_list_retrieve_message:"Unable to fetch marketers list"}) }
                }
            }, this.props);
        })
    }

    componentWillMount(){
        onbeforeunload = event =>(
            true
        )
    }

    componentDidMount(){
        if(!this.props.selectedCustomer){
           this.props.history.goBack()
        }
        else{
            this.fetchBanks() //fetch bank list from external api,
            this.fetchMarketers() //fetch marketers from database
            makeRequest(this.props).get('/customer/get/'+this.props.selectedCustomer)
            .then(response => {
                this.setState({
                    isLoading:false,
                    current_data: response,
                    form_input: Object.assign({},this.state.form_input,
                        {
                            email: response.data.data.auth ? response.data.data.auth.email: null,
                            surname: response.data.data.surname,
                            first_name: response.data.data.first_name,
                            other_name: response.data.data.other_name,
                            gender: response.data.data.gender,
                            phone_number: response.data.data.phone_number,
                            marital_status: response.data.data.marital_status,
                            birthday: response.data.data.birthday,
                            mode_of_identification: response.data.data.mode_of_identification,
                            identification_no: response.data.data.identification_no,
                            bank_name: response.data.data.bank_name,
                            bank_account_no: response.data.data.bank_account_number,
                            bank_account_name: response.data.data.bank_account_name,
                            bvn: response.data.data.bvn,
                            office: response.data.data.office.id,
                            marketer: response.data.data.marketer.id,
                            notify_email: response.data.data.notify_email,
                            notify_sms: response.data.data.notify_sms,
                            is_active: response.data.data.auth ? response.data.data.auth.is_active: false
                        }
                    )
                })
            })
            .catch(error => {
                handleError({
                    error: error,
                    callbacks: {
                        400: response=>{this.props.enqueueSnackbar(response.data.message, {variant: "error"});  }
                    }
                }, this.props);
            })
        }
    }

    componentWillUnmount(){
        onbeforeunload = null
    }

    handleChange = event =>{
        if(event.target.name == "bank_name"){
            this.setState({
                selectedBank: event.target.value, 
                bank_account_no_resolve_message: "",
                form_input: Object.assign({},this.state.form_input,
                    {
                        [event.target.name]:this.state.bank_list[event.target.value].name, 
                        bank_account_no: "",
                        bank_account_name: ""
                    }
                )
            })
        }
        else if(event.target.name == "bank_account_no"){
            if(event.target.value.length === 10){
                this.setState({bank_account_no_resolve_message:"Resolving account number..."})
                let axios = Axios.create()
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.env_options.paystack_sec_key}`
                axios.get(`https://api.paystack.co/bank/resolve?account_number=${event.target.value}&bank_code=${this.state.bank_list[this.state.selectedBank].code}`)
                .then(response=>{
                    this.setState({form_input: Object.assign({},
                        this.state.form_input,
                        {bank_account_name:response.data.data.account_name}
                    )})
                    this.setState({bank_account_no_resolve_message: response.data.data.account_name})
                })
                .catch(error => {
                    this.setState({form_input: Object.assign({},
                        this.state.form_input,
                        {bank_account_name:null}
                    )})
                    this.setState({bank_account_no_resolve_message: "Invalid account number"})
                })
            }
            else{
                this.setState({bank_account_no_resolve_message: "Invalid account number"})
            }
            this.setState({form_input: Object.assign({},
                this.state.form_input,
                {[event.target.name]:event.target.value, bank_account_name:""}
            )})
        }
        else{
            this.setState({form_input: Object.assign({},
                this.state.form_input,
                {[event.target.name]:event.target.value}
            )})
        }
    }
    
    handleUpdate = event =>{
        this.props.openDialog({
            viewCtrl: "warning",
            title: "Confirm Update!",
            description: "Please make sure you have reviewed and confirmed all entries before you proceed",
            close: (dialog) => {
                if(dialog.viewCtrl == "warning"){
                    dialog.close()
                }
                else if(dialog.viewCtrl == "success"){
                    dialog.close()
                }
                else{
                    //Can not close untill this process is complete
                }
            },
            confirm: dialog => {
                makeRequest(this.props).post('/customer/update/'+this.props.selectedCustomer, qs.stringify(this.state.form_input))
                .then(response => {
                    dialog.setViewCtrl("success")
                    dialog.setTitle("Done!")
                    dialog.setDescription(response.data.message)
                })
                .catch(error => {
                    handleError({
                        error: error,
                        callbacks: {
                            400: response=>{ 
                                this.props.enqueueSnackbar(response.data.message, {variant: "error"}); 
                                dialog.close()
                            },
                            423: response=>{ 
                                this.props.enqueueSnackbar(response.data.message, {variant: "error"}); 
                                dialog.close()
                            },
                        }
                    }, this.props);
                })
            }
        })
    }

    handleAuthSave = event =>{
        this.props.openDialog({
            viewCtrl: "warning",
            title: "Confirm Auth Update!",
            description: "Please make sure you have reviewed and confirmed that the email is valid, as this can pose security threat to this account",
            close: (dialog) => {
                if(dialog.viewCtrl == "warning"){
                    dialog.close()
                }
                else if(dialog.viewCtrl == "success"){
                    dialog.close()
                }
                else{
                    //Can not close untill this process is complete
                }
            },
            confirm: dialog => {
                makeRequest(this.props).post('/customer/auth/'+this.props.selectedCustomer, qs.stringify(this.state.form_input))
                .then(response => {
                    dialog.setViewCtrl("success")
                    dialog.setTitle("Done!")
                    dialog.setDescription(response.data.message)
                })
                .catch(error => {
                    handleError({
                        error: error,
                        callbacks: {
                            400: response=>{ 
                                this.props.enqueueSnackbar(response.data.message, {variant: "error"}); 
                                dialog.close()
                            },
                            423: response=>{ 
                                this.props.enqueueSnackbar(response.data.message, {variant: "error"}); 
                                dialog.close()
                            },
                        }
                    }, this.props);
                })
            }
        })
    }

    handleCheckboxChange = event =>{
        if(this.state.form_input[event.target.name]){
            this.setState({form_input: Object.assign({},
                this.state.form_input,
                {[event.target.name]:false}
            )})
        }
        else{
            this.setState({form_input: Object.assign({},
                this.state.form_input,
                {[event.target.name]:true}
            )})
        }
    }

    defaultFields = (event)=>{
        let response = this.state.current_data
        this.setState({
            selectedBank: null, 
            bank_account_no_resolve_message: "",
            form_input: Object.assign({},this.state.form_input,
                {
                    email: response.data.data.auth.email,
                    surname: response.data.data.surname,
                    first_name: response.data.data.first_name,
                    other_name: response.data.data.other_name,
                    gender: response.data.data.gender,
                    phone_number: response.data.data.phone_number,
                    marital_status: response.data.data.marital_status,
                    birthday: response.data.data.birthday,
                    mode_of_identification: response.data.data.mode_of_identification,
                    identification_no: response.data.data.identification_no,
                    bank_name: response.data.data.bank_name,
                    bank_account_no: response.data.data.bank_account_number,
                    bank_account_name: response.data.data.bank_account_name,
                    bvn: response.data.data.bvn,
                    office: response.data.data.office.id,
                    marketer: response.data.data.marketer.id,
                    notify_email: response.data.data.notify_email,
                    notify_sms: response.data.data.notify_sms,
                    is_active: response.data.data.auth.is_active
                }
            )
        })
    }

    getMarketerIndex = (id)=>{
        for (let index = 0; index < this.state.marketers_list.length; index++) {
           if(this.state.marketers_list[index].id == id){
               return index
           }
        }
        return null
    }

    getOfficeLocationIndex = (id)=>{
        for (let index = 0; index < this.props.office_location.length; index++) {
           if(this.props.office_location[index].id == id){
               return index
           }
        }
        return null
    }

    render(){
        return(
            <Fragment>
                {/** Dialog Section */}
                
                <PageTitle
                    titleHeading="Update Customer's Data"
                    titleDescription="Update customer's data. You can also create authentication data for this customer"
                />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <ExampleWrapperSimple sectionHeading={`Account No: ${this.props.selectedCustomer}`}>
                            {
                                this.state.isLoading ? (
                                    <Box className={this.props.classes.box}>
                                        <CircularProgress size={35} />
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth 
                                                value={this.state.form_input.surname}
                                                name="surname" 
                                                variant="outlined" 
                                                label="Surname*" 
                                                onChange={this.handleChange} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth
                                                value={this.state.form_input.first_name}
                                                name="first_name" 
                                                variant="outlined" 
                                                label="First Name*" 
                                                onChange={this.handleChange} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth
                                                value={this.state.form_input.other_name}
                                                name="other_name" 
                                                variant="outlined" 
                                                label="Other Name" 
                                                onChange={this.handleChange} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth 
                                                value={this.state.form_input.gender}
                                                name="gender" 
                                                variant="outlined" 
                                                label="Gender*" 
                                                select 
                                                onChange={this.handleChange}
                                            >
                                                <MenuItem value="male">Male</MenuItem>
                                                <MenuItem value="female">Female</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth 
                                                name="phone_number"
                                                value={this.state.form_input.phone_number} 
                                                variant="outlined" 
                                                label="Phone Number*" 
                                                onChange={this.handleChange} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth
                                                value={this.state.form_input.marital_status} 
                                                name="marital_status" 
                                                variant="outlined" 
                                                label="Marital Status" 
                                                select
                                                onChange={this.handleChange} 
                                            >
                                                <MenuItem value="single">Single</MenuItem>
                                                <MenuItem value="married">Married</MenuItem>
                                                <MenuItem value="divorced">Divorced</MenuItem>
                                                <MenuItem value="widowed">Widowed</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth 
                                                name="birthday"
                                                value={this.state.form_input.birthday} 
                                                variant="outlined" 
                                                label="Birthday*" 
                                                type="date"
                                                onChange={this.handleChange} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth
                                                value={this.state.form_input.mode_of_identification} 
                                                name="mode_of_identification" 
                                                variant="outlined" 
                                                label="Mode of Identification" 
                                                select
                                                onChange={this.handleChange} 
                                            >
                                                <MenuItem value="national identity">National Identity (NIMC)</MenuItem>
                                                <MenuItem value="voters card">Voters Card</MenuItem>
                                                <MenuItem value="drivers license">Drivers License</MenuItem>
                                                <MenuItem value="international passport">International Passport</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth
                                                value={this.state.selectedBank} 
                                                name="bank_name" 
                                                variant="outlined" 
                                                label="Bank Name" 
                                                select
                                                disabled={!this.state.bank_list}
                                                onChange={this.handleChange} 
                                                helperText={`Current Bank: ${this.state.form_input.bank_name}`}
                                            >   
                                                {
                                                    this.state.bank_list.map((bank, index)=>(
                                                        <MenuItem value={index}>{bank.name}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth 
                                                name="bank_account_no"
                                                value={this.state.form_input.bank_account_no} 
                                                variant="outlined" 
                                                label="Bank Account Number" 
                                                helperText={this.state.bank_account_no_resolve_message}
                                                onChange={this.handleChange} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth 
                                                name="bank_account_name"
                                                value={this.state.form_input.bank_account_name} 
                                                variant="outlined" 
                                                label="Bank Account Name" 
                                                disabled
                                                onChange={this.handleChange} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth 
                                                name="bvn"
                                                value={this.state.form_input.bvn} 
                                                variant="outlined" 
                                                label="BVN" 
                                                onChange={this.handleChange} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth
                                                value={this.state.form_input.office} 
                                                name="office" 
                                                variant="outlined" 
                                                label="Branch Office*" 
                                                select
                                                onChange={this.handleChange} 
                                                helperText="Only assigned locations are vissible"
                                            >
                                                {
                                                    this.props.office_location.map((location, index)=>(
                                                        <MenuItem value={location.office.id}>{location.office.name}, {location.office.state.nicname}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField 
                                                fullWidth
                                                value={this.state.form_input.marketer} 
                                                name="marketer" 
                                                variant="outlined" 
                                                label="Marketer*" 
                                                select
                                                onChange={this.handleChange} 
                                                helperText={this.state.marketers_list_retrieve_message}
                                            >
                                                {
                                                    this.state.marketers_list.map((marketer, index)=>(
                                                        <MenuItem value={marketer.id}>{marketer.first_name} {marketer.last_name}</MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid container spacing={2} style={{margin: 10}}>
                                            
                                            <Grid item xs={12} sm={12} md={12} lg={12} className={this.props.classes.checkGrid}>
                                                <Typography component="li" className={this.props.classes.typo}>
                                                    Choose customer's prefered mode of notification
                                                </Typography>
                                                <Grid container>
                                                    <Grid item xs={12} sm={12} md={6} lg={6} className={this.props.classes.checkGrid}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox 
                                                                name="notify_sms" 
                                                                checked={this.state.form_input.notify_sms}
                                                                onChange={this.handleCheckboxChange}
                                                                />
                                                            }
                                                            label="SMS"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={6} lg={6} className={this.props.classes.checkGrid}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox 
                                                                name="notify_email" 
                                                                checked={this.state.form_input.notify_email}
                                                                onChange={this.handleCheckboxChange}
                                                                />
                                                            }
                                                            label="Email"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Typography component="li" className={this.props.classes.typo}>
                                            Customer registered since, { new Date(this.state.current_data.data.data.registration_date).toUTCString()}
                                        </Typography>
                                    </Grid>
                                )
                            }
                            
                            <Divider style={{marginTop: 20, marginBottom: 20}}/>
                            <CardActions style={{ justifyContent: "space-between" }}>
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    disableElevation 
                                    onClick={this.defaultFields}
                                >
                                    Default
                                </Button>
                                <ContainerWithLoader isLoading={this.state.isLoadingProfileSave}>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        disableElevation 
                                        onClick={this.handleUpdate}
                                    >
                                        Update
                                    </Button>
                                </ContainerWithLoader>
                            </CardActions>
                        </ExampleWrapperSimple>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Card>
                            <CardHeader title="Authenticator" subheader="Edit/Create Authentication Data"/>
                            <Divider/>
                            <CardContent>
                            {
                                this.state.isLoading ? (
                                    <Box className={this.props.classes.box2}>
                                        <CircularProgress size={25} />
                                    </Box>
                                ) : (
                                    !this.state.form_input.email ? (
                                        <div>
                                            <Typography component="p" style={{fontSize:11, marginBottom:15}}>
                                                This user does not have authentication data, Enter a valid email to create one
                                            </Typography>
                                            <TextField 
                                                fullWidth 
                                                value={this.state.form_input.email}
                                                name="email" 
                                                variant="outlined" 
                                                label="Email" 
                                                onChange={this.handleChange} 
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <Typography component="li" style={{fontSize:11, marginBottom:5}}>
                                                Reset customer authentication password; customer will receive an email conatining a
                                                One Time Password to change password
                                            </Typography>
                                            <Typography component="li" style={{fontSize:11, marginTop:5, marginBottom:20}}>
                                                Control customers access to mobile or web platform; If deactivated, user will not have 
                                                access to platforms again.
                                            </Typography>
                                            <TextField 
                                                fullWidth 
                                                value={this.state.form_input.email}
                                                name="email" 
                                                variant="outlined" 
                                                label="Email" 
                                                onChange={this.handleChange} 
                                            />
                                            <FormControlLabel
                                                style={{marginTop:15}}
                                                control={
                                                    <Switch 
                                                        name="is_active" 
                                                        checked={this.state.form_input.is_active}
                                                        onChange={this.handleCheckboxChange} 
                                                    />
                                                            
                                                }
                                                label={this.state.form_input.is_active ? "Active" : "Inactive"}
                                            />
                                        </div>
                                    )
                                  )
                                }
                            </CardContent>
                            <Divider style={{marginTop: 10, marginBottom: 10}}/>
                            <CardActions style={{ justifyContent: "space-between" }}>
                                {this.state.form_input.email ? (
                                    <Button 
                                        color="secondary" 
                                        disableElevation
                                        variant="outlined"
                                    >
                                        Reset Password
                                    </Button>
                                    ) : (
                                        null
                                    )
                                }
                                <ContainerWithLoader isLoading={this.state.isLoadingAuthSave}>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        disableElevation 
                                        onClick={this.handleAuthSave}
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
    selectedCustomer: state.App.selectedCustomer,
    env_options: state.App.options,
    office_location: state.App.user_office_location

  });
  
export default connect(mapStateToProps)(
    withSnackbar(
        withPermission(VIEW_PERMISSION_NAME)(
            withStyles(useStyles)(
                withRouter(
                    withConfirmationDialog(EditCustomer))))))