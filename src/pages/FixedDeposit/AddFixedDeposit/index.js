import React, { Component, Fragment } from 'react';

import { PageTitle } from '../../../layout-components';
import { 
    Grid,
    Hidden,
    Typography, 
    withStyles, 
    createStyles, 
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Divider,
    IconButton,
    TextField,
    Paper,
    InputBase,
    CircularProgress,
    MenuItem,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    Box,
    Radio,
    RadioGroup
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import { ExampleWrapperSimple } from '../../../layout-components';
import { Refresh as RefreshIcon, Cancel as CancelIcon, CheckCircle as CheckIcon } from '@material-ui/icons';
import { makeRequest, handleError} from 'utils/axios-helper';
import { ContainerWithLoader, TransactionTabView, TransactionTab, CustomerDetailsDialog, RecentTransactionList, FixedDepositPreviewDialog } from 'components'
import qs from 'qs';
import {withSnackbar} from 'notistack';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setIsAuthenticatedStatus } from 'actions'
import withPermission from 'utils/permission'
import withConfirmationDialog from 'utils/confirmationDialog'
import { setSelectedStaff } from 'actions'
import { grey,blueGrey, green, red, blue } from '@material-ui/core/colors';
import PerfectScrollBar from 'react-perfect-scrollbar'


const VIEW_PERMISSION_NAME = "can_add_fixed_deposit";

const styles = createStyles(theme =>({
    cardContent: {
        height: 250,
        overFlow: "auto"
    },
    textField: {
        backgroundColor: "#fff"
    },
    paper: {
        height: 100,
        backgroundColor: "#fff"
    },
    paperRoot: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: "100%",
        height: 50
      },
      input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        height: 50
      },
      iconButton: {
        padding: 10,
      },
    accountTypo:{
        marginLeft: 5,
        fontSize: 14,
        color: grey[600],
        fontWeight: 600,
    },
    typoNotFound:{
        padding: 5,
        borderRadius: 20,
        paddingRight: 7,
        fontSize: 13,
        backgroundColor: red[400],
        color: "#fff"
    },
    typoFound:{
        padding: 5,
        borderRadius: 20,
        paddingRight: 7,
        fontSize: 13,
        backgroundColor: green[400],
        color: "#fff",
        "&:hover":{
            cursor: "pointer"
        }
    },
    processMethod: {
        backgroundColor: grey[100],
    },
    typoInfo: {
        fontSize: 11,
        marginLeft: 5
    },
    buttonGrid: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "Center"
    },
    textFieldGrid:{
        marginBottom:10
    },
    creditButton:{
        backgroundColor: green[400],
        color: "#fff",
        "&:hover":{
            backgroundColor: green[500],
        }
    },
    debitButton:{
        backgroundColor: red[400],
        color: "#fff",
        "&:hover":{
            backgroundColor: red[500],
        }
    },
    button:{
        disabled:{
            color: grey[200]
        }
    },
    balanceBox:{
        height: 30,
        padding: 5,
        backgroundColor: blue[100],
    },
    balanceTypo:{
        color: blue[800],
        fontSize: 12
    },
    balanceErrorBox:{
        height: 30,
        padding: 5,
        backgroundColor: red[100]
    },
    balanceErrorTypo:{
        color: red[800],
        fontSize: 12
    }
}))

class AddFixedDeposit extends Component{
    constructor(props){
        super(props)
        this.state = {
            account_no: "",
            account_no_message: "",
            customer: null,
            amount: 0.00,
            amountReadable: "",
            channel: "cash",
            narration: "",
            rate: '',
            upfront_interest: "false", 
            withholding_tax: "true",
            duration: '',
            investment_date: null,
            isLoadingAccount: false,
            tag_line:null,
            isLoading:true,
            open:false,
            previewData: null,
            openPreview: false,
        };
    }

    fetchAccount = async (account_no)=>{
        this.setState({account_no_message:"Fetching Account...", isLoadingAccount:true})
        makeRequest(this.props).get(`/account-manager/account/get/${account_no}`)
        .then(response => {
            this.setState({
                customer: response.data.data,
                account_no_message: response.data.data.customer.first_name + " " + response.data.data.customer.surname + " " + response.data.data.customer.other_name,
                isLoadingAccount: false
            })
        })
        .catch(error => {
            handleError({
                error: error,
                callbacks: {
                    400: response=>{ this.setState({
                            account_no_message:"", 
                            isLoadingAccount:false,
                            customer: null
                        }) 
                    }
                }
            }, this.props);
        })
    }

    handleChange = event =>{
        if(event.target.name == "account_no"){
            if(((event.target.value.length <= 10) && /^\d+$/.test(event.target.value)) || event.target.value.length === 0){
                this.setState({
                    [event.target.name]: event.target.value,
                })
                if(event.target.value.length === 10){
                    //fetch account details
                    this.fetchAccount(event.target.value)
                }
                else{
                    this.setState({
                        account_no_message: "Invalid Account Number",
                    })
                }
            }
        }
        else if(event.target.name == "amountReadable"){
            //Remove commas
            let num_str = event.target.value.replace(new RegExp(",", 'g'), "")
            let decimal_part = num_str.split(".")[1]
            let amount = parseFloat(num_str)
            if(amount && amount > 0){
                if(decimal_part !== undefined){
                    //check if number exists after the decimal point
                    if(/^\d+$/.test(decimal_part)){
                        this.setState({
                            amount: amount,
                            amountReadable: amount.toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 1})
                        })
                    }
                    else{
                        this.setState({
                            amount: amount,
                            amountReadable: amount.toLocaleString() + "."
                        })
                    }
                }
                else{
                    this.setState({
                        amount: amount,
                        amountReadable: amount.toLocaleString()
                    })
                }
            }
            else{
                this.setState({
                    amount: 0.00,
                    amountReadable: ""
                })
            }
        }
        else if(event.target.name == "narration"){
            if(event.target.value.length <= 40){
                this.setState({
                    [event.target.name]: event.target.value,
                })
            }
        }
        else if(event.target.name == "rate"){
            if(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(event.target.value) && (parseFloat(event.target.value) <= 100)){
                this.setState({
                    [event.target.name]: event.target.value,
                })
            }
            else if(event.target.value === ''){
                this.setState({
                    [event.target.name]: event.target.value,
                })
            }
        }
        else if(event.target.name == "duration"){
            if(/^\d*$/.test(event.target.value)){
                this.setState({
                    [event.target.name]: event.target.value,
                })
            }
        }
        else if((event.target.name == "upfront_interest") || (event.target.name == "withholding_tax")){
            this.setState({
                [event.target.name]: event.target.value,
            })
        }
        else if(event.target.name == "channel"){
            this.setState({
                [event.target.name]: event.target.value,
            })
        }
        else{
            this.setState({
                [event.target.name]: event.target.value,
            })
        }
    }

    handleBlur = (event) =>{
        if(event.target.name == "amountReadable"){
            this.setState({
                amount: parseFloat(this.state.amount).toFixed(2),
                amountReadable: parseFloat(this.state.amount).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})
            })
        }
    }

    handlePreview = evt=>{
        this.setState({
            openPreview: true,
        })
        makeRequest(this.props).post('/transaction/fixed/preview',  qs.stringify({
            account_no: this.state.account_no,
            amount: this.state.amount,
            channel: this.state.channel,
            narration: this.state.narration,
            rate: this.state.rate,
            upfront_interest: this.state.upfront_interest, 
            withholding_tax: this.state.withholding_tax,
            duration: this.state.duration,
            investment_date: this.state.investment_date,
            tag_line: this.state.tag_line,
        }))
        .then(response => {
            this.setState({
                previewData: response.data.data,
            })
        })
        .catch(error => {
            handleError({
                error: error,
                callbacks: {
                    400: response=>{  
                        this.props.enqueueSnackbar(response.data.message, {variant: "error"}); 
                    }
                }
            }, this.props);
        })
    }

    handleMakeTransaction = (type) =>{
        this.props.openDialog({
            viewCtrl: "warning",
            title: type == 'credit' ? "Confirm Deposit Transaction" : "Confirm Withdrawal Transaction",
            description: "Make sure you have confirmed the transaction details before you proceed from here",
            close: dialog =>{
                if(dialog.viewCtrl == "success"){
                    this.clearFields()
                }
                dialog.close()
            },
            confirm: dialog =>{
                makeRequest(this.props).post('/transaction/savings/post', qs.stringify({
                    type: type,
                    account_no: this.state.account_no,
                    amount: this.state.amount,
                    narration: this.state.narration,
                    channel: this.state.channel,
                    subject_to_approval: this.state.subject_to_approval
                }))
                .then(response => {
                    dialog.setViewCtrl("success")
                    dialog.setTitle("Done!")
                    dialog.setDescription(response.data.message)
                    this.fetchRecentTransactions()
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

    clearFields = ()=>{
        this.setState({
            account_no: "",
            account_no_message: "",
            customer: null,
            amount: 0.00,
            amountReadable: "",
            channel: "cash",
            narration: "",
            subject_to_approval: true,
        })
    }

    render(){
        return(
            <Fragment>
                <PageTitle
                    titleHeading="Fixed Deposit"
                    titleDescription="You can create, preview and add fixed deposit"
                />
                <CustomerDetailsDialog 
                    data={this.state.customer} 
                    open={this.state.open} 
                    onClose={()=>{this.setState({open:false})}} 
                />
                <FixedDepositPreviewDialog
                    data={this.state.previewData} 
                    open={this.state.openPreview} 
                    onClose={()=>{this.setState({openPreview:false})}}
                />
                <ExampleWrapperSimple sectionHeading="Add Fixed Deposit">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.textFieldGrid}>
                            <Paper component="form" className={this.props.classes.paperRoot} elevation={0} variant="outlined">
                                <InputBase
                                    className={this.props.classes.input}
                                    inputProps={{ 'aria-label': 'search data' }}
                                    placeholder="Account Number"
                                    value={this.state.account_no}
                                    name="account_no"
                                    onChange={this.handleChange}
                                    disabled={this.state.isLoadingAccount}
                                />
                                {
                                    this.state.isLoadingAccount ? (
                                        <CircularProgress size={25}/>
                                    ) : (
                                        this.state.account_no.length === 10 ? (
                                            this.state.customer ? (
                                                <Typography 
                                                    className={this.props.classes.typoFound}
                                                    onClick={()=>{this.setState({open:true})}}
                                                >
                                                    <CheckIcon/>View Details
                                                </Typography>
                                            ) : (
                                                <Typography 
                                                    className={this.props.classes.typoNotFound}
                                                >
                                                    <CancelIcon/>Not Found
                                                </Typography>
                                            )
                                        ) :(
                                            null
                                        )
                                    )
                                }
                            </Paper>
                            <Typography 
                                component="p" 
                                className={this.props.classes.accountTypo} 
                                                    >
                                {this.state.account_no_message}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.textFieldGrid}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Amount to Deposit"
                                name="amountReadable"
                                value={this.state.amountReadable}
                                onChange={this.handleChange}
                                onBlur={this.handleBlur}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">&#8358;</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.textFieldGrid}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Deposit Channel"
                                name="channel"
                                select
                                value={this.state.channel}
                                onChange={this.handleChange}
                            >
                                <MenuItem value="cash">Cash Deposit</MenuItem>
                                <MenuItem value="transfer">Bank Transfer</MenuItem>
                                <MenuItem value="cheque">Cheque</MenuItem>
                                <MenuItem value="balance">From Balance</MenuItem>
                            </TextField>
                            {
                                this.state.channel == 'balance' ? (
                                    this.state.customer ? (
                                        this.state.customer.available_fixed_deposit_balance < this.state.amount ? (
                                            <Box className={this.props.classes.balanceErrorBox}>
                                                <Typography component="p"  className={this.props.classes.balanceErrorTypo}>
                                                    Insufficient fund in your fixed deposit account
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Box className={this.props.classes.balanceBox}>
                                                <Typography component="p"  className={this.props.classes.balanceTypo}>
                                                    Amount will be deducted from the available balance in your fixed deposit acount!
                                                </Typography>
                                            </Box>
                                        )
                                    ) : (null)
                                ) : (null)
                            }
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.textFieldGrid}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Annual Rate"
                                name="rate"
                                value={this.state.rate}
                                onChange={this.handleChange}
                                helperText="The rate between (0 - 100)%"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}  className={this.props.classes.processMethod}>
                            <Typography component="li"  className={this.props.classes.typoInfo}>
                                Do you want interest to be paid upfront upon submission of this fixed deposit?
                            </Typography>
                            <RadioGroup name="upfront_interest" value={this.state.upfront_interest} onChange={this.handleChange}>
                                <FormControlLabel
                                    value="true"
                                    control={
                                        <Radio/>
                                    }
                                    label="Yes"
                                />
                                <FormControlLabel
                                    value="false"
                                    control={
                                        <Radio/>
                                    }
                                    label="No"
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}  className={this.props.classes.processMethod}>
                            <Typography component="li"  className={this.props.classes.typoInfo}>
                                Do you want to apply withholding tax on this fixed deposit?
                            </Typography>
                            <RadioGroup name="withholding_tax" value={this.state.withholding_tax} onChange={this.handleChange}>
                                <FormControlLabel
                                    value="true"
                                    control={
                                        <Radio/>
                                    }
                                    label="Yes"
                                />
                                <FormControlLabel
                                    value="false"
                                    control={
                                        <Radio/>
                                    }
                                    label="No"
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.textFieldGrid}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={this.state.investment_date}
                                label="Investment Date"
                                name="investment_date"
                                type="date"
                                onChange={this.handleChange}
                                helperText="When the fixed deposit should start running."
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.textFieldGrid}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Duration"
                                name="duration"
                                value={this.state.duration}
                                onChange={this.handleChange}
                                helperText="The duration in number of days"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.textFieldGrid}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Deposit Narration"
                                name="narration"
                                value={this.state.narration}
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.textFieldGrid}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Tag Line"
                                name="tag_line"
                                value={this.state.tag_line}
                                onChange={this.handleChange}
                                helperText="An optional text description to categorize the fixed deposit"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.buttonGrid}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Button
                                        classes={this.props.classes.button}
                                        className={this.props.classes.creditButton}
                                        variant="contained"
                                        disableElevation
                                        fullWidth
                                        onClick={this.handlePreview}
                                        disabled={!(this.state.customer && (this.state.amount > 0) && this.state.narration && 
                                            this.state.duration && this.state.investment_date && this.state.rate
                                            )}
                                    >
                                        Preview
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Button
                                        classes={this.props.classes.button}
                                        className={this.props.classes.creditButton}
                                        variant="contained"
                                        disableElevation
                                        fullWidth
                                        onClick={evt => this.handleMakeTransaction("credit")}
                                        disabled={!(this.state.customer && (this.state.amount > 0) && this.state.narration)}
                                    >
                                        {!this.state.subject_to_approval ? "Make Deposit" : "Initiate Deposit"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
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
            withStyles(styles)(
              withConfirmationDialog(AddFixedDeposit)))))