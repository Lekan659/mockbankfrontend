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
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import { ExampleWrapperSimple } from '../../../layout-components';
import { Refresh as RefreshIcon, Cancel as CancelIcon, CheckCircle as CheckIcon } from '@material-ui/icons';
import { makeRequest, handleError} from 'utils/axios-helper';
import { ContainerWithLoader, TransactionTabView, TransactionTab, CustomerDetailsDialog, RecentTransactionList } from 'components'
import qs from 'qs';
import {withSnackbar} from 'notistack';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setIsAuthenticatedStatus } from 'actions'
import withPermission from 'utils/permission'
import withConfirmationDialog from 'utils/confirmationDialog'
import { setSelectedStaff } from 'actions'
import { grey,blueGrey, green, red } from '@material-ui/core/colors';
import PerfectScrollBar from 'react-perfect-scrollbar'


const VIEW_PERMISSION_NAME = [
    "can_initiate_credit_savings_transaction", 
    "can_approve_credit_savings_transaction"
];

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
    }
}))

class MakeTransaction extends Component{
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
            subject_to_approval: true, 
            isLoadingAccount: false,
            recent_transactions: [],
            isLoading:true,
            open:false
        };
    }

    fetchRecentTransactions = async ()=>{
        this.setState({isLoading:true})
        makeRequest(this.props).get('/transaction/savings/recent')
        .then(response => {
            this.setState({
                recent_transactions: response.data.data,
                isLoading: false
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
        .finally(()=>{
            this.setState({isLoading:false})
        })
    }

    componentDidMount = ()=>{
        this.fetchRecentTransactions()
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
        else if(event.target.name == "subject_to_approval"){
            if(this.state.subject_to_approval){
                this.setState({
                    [event.target.name]: false,
                })
            }
            else{
                this.setState({
                    [event.target.name]: true,
                })
            }
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
                    titleHeading="Savings Account"
                    titleDescription="You can initiate or make a direct deposit or withdrawal transaction"
                />
                <CustomerDetailsDialog 
                    data={this.state.customer} 
                    open={this.state.open} 
                    onClose={()=>{this.setState({open:false})}} 
                />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <ExampleWrapperSimple sectionHeading="Make Savings Transaction">
                            <TransactionTabView>

                                {/** credit/Deposit Transaction Tab */}
                                <TransactionTab 
                                    credit
                                    hasPermission={this.props.hasPermission([
                                        "can_initiate_credit_savings_transaction", 
                                        "can_approve_credit_savings_transaction"
                                    ])}
                                >
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
                                            </TextField>
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
                                        <Grid item xs={12} sm={6} md={6} lg={6}  className={this.props.classes.processMethod}>

                                            <Typography component="li"  className={this.props.classes.typoInfo}>
                                                The Transaction process method tells the system how to process this transaction
                                            </Typography>
                                            <Typography component="li"  className={this.props.classes.typoInfo}>
                                                When "Subject to Approval" is checked; Transaction will join the que of 
                                                pending transactions waiting for the final approval of an authorized staff
                                            </Typography>
                                            <Typography component="li"  className={this.props.classes.typoInfo}>
                                                When unchecked; Transaction will be processed immediately.
                                            </Typography>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={this.state.subject_to_approval}
                                                        name="subject_to_approval"
                                                        value={this.state.subject_to_approval}
                                                        onChange={this.handleChange}
                                                        disabled={!this.props.hasPermission("can_approve_credit_savings_transaction")}
                                                    />
                                                }
                                                label="Subject to Approval"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.buttonGrid}>
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
                                </TransactionTab>

                                {/** Debit/Withdawal Transaction Tab */}
                                <TransactionTab 
                                    debit
                                    hasPermission={this.props.hasPermission([
                                        "can_initiate_debit_savings_transaction", 
                                        "can_approve_debit_savings_transaction"
                                    ])}
                                >
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
                                                label="Amount to Withdraw"
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
                                                label="Withdrawal Channel"
                                                name="channel"
                                                select
                                                value={this.state.channel}
                                                onChange={this.handleChange}
                                            >
                                                <MenuItem value="cash">Cash Withdrawal</MenuItem>
                                                <MenuItem value="transfer">Bank Transfer</MenuItem>
                                                <MenuItem value="cheque">Cheque</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.textFieldGrid}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                label="Withdrawal Narration"
                                                name="narration"
                                                value={this.state.narration}
                                                onChange={this.handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}  className={this.props.classes.processMethod}>

                                            <Typography component="li"  className={this.props.classes.typoInfo}>
                                                The Transaction process method tells the system how to process this transaction
                                            </Typography>
                                            <Typography component="li"  className={this.props.classes.typoInfo}>
                                                When "Subject to Approval" is checked; Transaction will join the que of 
                                                pending transactions waiting for the final approval of an authorized staff
                                            </Typography>
                                            <Typography component="li"  className={this.props.classes.typoInfo}>
                                                When unchecked; Transaction will be processed immediately.
                                            </Typography>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={this.state.subject_to_approval}
                                                        name="subject_to_approval"
                                                        value={this.state.subject_to_approval}
                                                        onChange={this.handleChange}
                                                        disabled={!this.props.hasPermission("can_approve_debit_savings_transaction")}
                                                    />
                                                }
                                                label="Subject to Approval"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.buttonGrid}>
                                            <Button
                                                classes={this.props.classes.button}
                                                className={this.props.classes.debitButton}
                                                variant="contained"
                                                disableElevation
                                                fullWidth
                                                onClick={evt => this.handleMakeTransaction("debit")}
                                                disabled={!(this.state.customer && (this.state.amount > 0) && this.state.narration)}
                                            >
                                                {!this.state.subject_to_approval ? "Make Withdrawal" : "Initiate Withdrawal"}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </TransactionTab>
                            </TransactionTabView>
                        </ExampleWrapperSimple>
                    </Grid>
                    <Hidden smDown>
                        <Grid item md={4} lg={4}>
                            <Card variant="outlined">
                                <CardHeader 
                                    subheader="Recent Transactions"
                                    action={<IconButton color="primary"><RefreshIcon/></IconButton>}
                                />
                                <Divider style={{marginTop:"-10px"}}/>
                                <CardContent className={this.props.classes.cardContent}>
                                    {
                                        this.state.isLoading ? (
                                            <Skeleton animation="wave" variant="rect" width="100%" height={250} />
                                        ) : (
                                            <Box style={{height:250, width:"100%"}}>
                                                <PerfectScrollBar>
                                                    <RecentTransactionList data={this.state.recent_transactions} />
                                                </PerfectScrollBar>
                                            </Box>
                                        )
                                    }
                                </CardContent>
                                <Divider style={{marginTop:30}} />
                                <CardActions style={{justifyContent: "right"}}>
                                    <Button variant="text" color="primary" disableElevation>More</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Hidden>
                </Grid>
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
              withConfirmationDialog(MakeTransaction)))))