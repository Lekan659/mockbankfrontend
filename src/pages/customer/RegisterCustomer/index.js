import React, { Component, Fragment } from 'react';

import { PageTitle } from '../../../layout-components';
import { Box, Button, CardActions, Divider, Grid, Typography, createStyles, withStyles, Dialog, DialogTitle, DialogContent, Avatar } from '@material-ui/core';
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

const VIEW_PERMISSION_NAME = "can_register_customer";

const useStyles = createStyles(theme =>({
    typo: {
        fontSize: 12,
        marginLeft: 15,
    },
    checkGrid: {
        backgroundColor: "#f7f7f7"
    },
}))

class RegisterCustomer extends Component{
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
                notify_customer:true,
                channel:"cash",
                initial_deposit: 1000,
                activate_minimum_balance: false
            },
            bank_list: [],
            selectedBank: null,
            bank_list_retrieve_message: "",
            bank_account_no_resolve_message: "",
            marketers_list : [],
            marketers_list_retrieve_message: "",
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
        this.fetchBanks() //fetch bank list from external api,
        this.fetchMarketers() //fetch marketers from database
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
                        bank_account_no: ""
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
                {[event.target.name]:event.target.value}
            )})
        }
        else{
            this.setState({form_input: Object.assign({},
                this.state.form_input,
                {[event.target.name]:event.target.value}
            )})
        }
    }
    
    handleSave = event =>{
        this.setState({
            dialogViewCtrl: "warning",
            dialogTitle: "Confirm Registration!",
            dialogDescription: "Please make sure you have reviewed and confirmed all entries before you proceed"
        });
        this.props.openDialog({
            viewCtrl: "warning",
            title: "Confirm Registration!",
            description: "Please make sure you have reviewed and confirmed all entries before you proceed",
            close: (dialog) => {
                if(dialog.viewCtrl == "warning"){
                    dialog.close()
                }
                else if(dialog.viewCtrl == "success"){
                    dialog.close()
                    this.clearFields(null);
                }
                else{
                    //Can not close untill this process is complete
                }
            },
            confirm: dialog => {
                makeRequest(this.props).post('/customer/register', qs.stringify(this.state.form_input))
                .then(response => {
                    dialog.setViewCtrl("success")
                    dialog.setTitle("Registration Successful!")
                    dialog.setDescription(
                        <Typography>
                            Account Number: <strong>{response.data.data.account_no}</strong>, 
                            Account Name: <strong>{response.data.data.first_name} {response.data.data.surname} {response.data.data.other_name} </strong>
                        </Typography>
                    )
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

    clearFields = (event)=>{
        this.setState({
            selectedBank: null, 
            bank_account_no_resolve_message: "",
            form_input: Object.assign({},this.state.form_input,
                {
                    email: "",
                    surname: "",
                    first_name: "",
                    other_name: "",
                    gender: null,
                    phone_number: "",
                    marital_status: null,
                    birthday: "",
                    mode_of_identification: null,
                    identification_no: "",
                    bank_name: "",
                    bank_account_no: "",
                    bank_account_name: "",
                    bvn: "",
                    office: null,
                    marketer: null,
                    notify_email: false,
                    notify_sms: true,
                    notify_customer:true,
                    channel:"cash",
                    initial_deposit: 1000,
                    activate_minimum_balance: false
                }
            )
        })
    }

    render(){
        return(
            <Fragment>
                <PageTitle
                    titleHeading="Register Customer"
                    titleDescription="Register new customer, Account number are Auto-generated and displayed"
                />
                <ExampleWrapperSimple sectionHeading="New Customer Registration Form">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TextField 
                                fullWidth 
                                value={this.state.form_input.surname}
                                name="surname" 
                                variant="outlined" 
                                label="Surname*" 
                                onChange={this.handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TextField 
                                fullWidth
                                value={this.state.form_input.first_name}
                                name="first_name" 
                                variant="outlined" 
                                label="First Name*" 
                                onChange={this.handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TextField 
                                fullWidth
                                value={this.state.form_input.other_name}
                                name="other_name" 
                                variant="outlined" 
                                label="Other Name" 
                                onChange={this.handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
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
                                name="phone_number"
                                value={this.state.form_input.phone_number} 
                                variant="outlined" 
                                label="Phone Number*" 
                                onChange={this.handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
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
                        <Grid item xs={12} sm={6} md={6} lg={4}>
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
                        <Grid item xs={12} sm={6} md={6} lg={4}>
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
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TextField 
                                fullWidth
                                value={this.state.selectedBank} 
                                name="bank_name" 
                                variant="outlined" 
                                label="Bank Name" 
                                select
                                disabled={!this.state.bank_list}
                                onChange={this.handleChange} 
                                helperText={this.state.bank_list_retrieve_message}
                            >   
                                {
                                    this.state.bank_list.map((bank, index)=>(
                                        <MenuItem value={index}>{bank.name}</MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
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
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <TextField 
                                fullWidth 
                                name="bvn"
                                value={this.state.form_input.bvn} 
                                variant="outlined" 
                                label="BVN" 
                                onChange={this.handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={4}>
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
                        <Grid item xs={12} sm={6} md={6} lg={4}>
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
                            <Grid item xs={12} sm={12} md={6} lg={6} className={this.props.classes.checkGrid}>
                                <Typography component="li" className={this.props.classes.typo}>
                                    By checking "activate minimum balance" the customer's savings account will be credited with 
                                    the amount set in the initial deposit
                                </Typography>
                                <Typography component="li" className={this.props.classes.typo}>
                                    This option is suitable for a customer starting with a regular savings account
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                        name="activate_minimum_balance" 
                                        checked={this.state.form_input.activate_minimum_balance}
                                        onChange={this.handleCheckboxChange}
                                        />
                                    }
                                    label="Activate Minimum Balance"
                                />
                                {this.state.form_input.activate_minimum_balance ? (
                                    <div>
                                        <TextField 
                                            fullWidth
                                            value={this.state.form_input.channel} 
                                            name="channel" 
                                            variant="outlined" 
                                            label="Transaction Channel" 
                                            select
                                            onChange={this.handleChange} 
                                            style={{marginBottom:20}}
                                        >
                                            <MenuItem value="cash">Cash Deposit</MenuItem>
                                            <MenuItem value="cheque">Cheque</MenuItem>
                                            <MenuItem value="transfer">Transfer</MenuItem>
                                        </TextField>
                                        <TextField 
                                            fullWidth
                                            name="initial_deposit"
                                            value={this.state.form_input.initial_deposit} 
                                            variant="outlined" 
                                            label="Initial Deposit" 
                                            onChange={this.handleChange}
                                            type="number"
                                            helperText="Minimum initial deposit is &#8358;1,000" 
                                        />
                                    </div>
                                ) : (null)}
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} className={this.props.classes.checkGrid}>
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
                                <Typography component="li" className={this.props.classes.typo}>
                                    By checking "Notify Customer" the customer will receive an sms and email notification
                                    contianing his/her Full Name and Account Number about his newly registered account
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                        name="notify_customer" 
                                        checked={this.state.form_input.notify_customer}
                                        onChange={this.handleCheckboxChange}
                                        />
                                    }
                                    label="Notify Customer"
                                />
                            </Grid>
                        </Grid>
                        
                    </Grid>
                    <Divider style={{marginTop: 20, marginBottom: 20}}/>
                    <CardActions style={{ justifyContent: "space-between" }}>
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            disableElevation 
                            onClick={this.clearFields}
                        >
                            Clear
                        </Button>
                        <ContainerWithLoader isLoading={this.state.isLoading}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                disableElevation 
                                onClick={this.handleSave}
                            >
                                Save
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
    user_permissions: state.App.user_permissions,
    env_options: state.App.options,
    office_location: state.App.user_office_location
  });
  
export default connect(mapStateToProps)(
    withSnackbar(
        withPermission(VIEW_PERMISSION_NAME)(
            withStyles(useStyles)(
                withConfirmationDialog(RegisterCustomer)))))