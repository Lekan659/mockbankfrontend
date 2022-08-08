import React, { Component, Fragment } from 'react';
import {
    Box, 
    Button, 
    Avatar, 
    Dialog,
    DialogContent,
    DialogActions,
    createStyles, 
    withStyles,
    Typography,
    CircularProgress,
    Grid,
    Divider,
    AppBar
} from '@material-ui/core';
import { WarningRounded as WarningIcon, Done as SuccessIcon} from '@material-ui/icons'
import { orange, red, green } from '@material-ui/core/colors'
import {getInitials} from 'utils'
import moment from 'moment'

const useStyles = createStyles(theme => ({
    dialogContent: {
        minHeight: 300
    },
    avatarBox:{
        display: "flex",
        flexDirection:  "column",
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        width: 80,
        height: 80,
        backgroundColor: green[500]
    },
    topHeader:{
        fontSize: 17,
        color: "#333333",
        fontWeight: 600,
    },
    title: {
        fontSize: 15,
        color: "#222222",
        fontWeight: 500,
    },
    text: {
        fontSize: 13,
        color: "#555555",
        marginTop: 5,
        marginBottom: 15
    },
    balanceText: {
        fontSize: 14,
        color: green[600],
        fontWeight: 600,
        marginTop: 5,
        marginBottom: 15
    },
    lastInfo: {
        fontSize: 13,
        color: "#555555",
        marginTop: 20,
    },
    buttonCancel:{
        color: red[500]
    },
    topInfo: {
        fontSize: 18,
        fontWeight: 600,
        fontFamily: "Calibri",
        color: "#fff",
        marginTop: 15,
        marginBottom: 15,
        textAlign: "left",
        marginLeft: 10
    }
}))

class CustomerDetailsDialog extends Component{
    constructor(props){
        super(props)
        this.state = {
            open: false
        }
    }

    render(){
        return(
            <Fragment>
                <Dialog
                    fullWidth
                    maxWidth="md"
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <AppBar position="static" style={{backgroundColor:green[400]}}>
                        <Typography component="h6" className={this.props.classes.topInfo}>
                            Customer's Details
                        </Typography>
                    </AppBar>
                    {
                        this.props.data ? (
                            <DialogContent className={this.props.classes.dialogContent}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} justify="center" className={this.props.classes.avatarBox}>
                                        <Avatar
                                            className={this.props.classes.avatar}
                                            src={this.props.data.customer.avatar}
                                        >
                                            {getInitials(this.props.data.customer.first_name +" "+ this.props.data.customer.surname)}
                                        </Avatar>
                                        <Typography component="h4" className={this.props.classes.topHeader}>
                                            {this.props.data.customer.account_no}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Divider style={{marginTop:15, marginBottom:5}}/>
                                        <Typography component="h4" className={this.props.classes.topHeader}>
                                            Biodata
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Surname:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.customer.surname}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            First Name:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.customer.first_name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Other Name:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.customer.other_name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Phone Number:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.customer.phone_number}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Email:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.customer.auth.email}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Gender:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.customer.gender}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Associated Branch:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {`${this.props.data.customer.office.name}, ${this.props.data.customer.office.state.name}`}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Marketer:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {`${this.props.data.customer.marketer.first_name} ${this.props.data.customer.marketer.last_name}`}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Divider style={{marginTop:15,marginBottom:5}}/>
                                        <Typography component="h4" className={this.props.classes.topHeader}>
                                            Account Information
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Savings Balance (Ledger):
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.balanceText}>
                                            &#8358;{parseFloat(this.props.data.savings_account_balance).toLocaleString("en",{minimumFractionDigits: 2})}
                                        </Typography>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Savings Balance (Avaliable):
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.balanceText}>
                                            &#8358;{parseFloat(this.props.data.available_savings_account_balance).toLocaleString("en",{minimumFractionDigits: 2})}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Target Savings Balance (Ledger):
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.balanceText}>
                                            &#8358;{parseFloat(this.props.data.target_savings_balance).toLocaleString("en",{minimumFractionDigits: 2})}
                                        </Typography>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Target Savings Balance (Available):
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.balanceText}>
                                            &#8358;{parseFloat(this.props.data.available_target_savings_balance).toLocaleString("en",{minimumFractionDigits: 2})}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Fixed Deposit Balance (Ledger):
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.balanceText}>
                                            &#8358;{parseFloat(this.props.data.fixed_deposit_balance).toLocaleString("en",{minimumFractionDigits: 2})}
                                        </Typography>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Fixed Deposit Balance (Available):
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.balanceText}>
                                            &#8358;{parseFloat(this.props.data.available_fixed_deposit_balance).toLocaleString("en",{minimumFractionDigits: 2})}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography component="p" className={this.props.classes.lastInfo}>
                                        Last transaction activity on this account was on : <strong>{moment(this.props.data.last_updated).format("dddd, MMMM Do YYYY, h:mm:ss a")}</strong>
                                </Typography>
                            </DialogContent>
                        ) : (
                            null
                        )
                    }
                    <Divider style={{marginTop:15,marginBottom:5}}/>
                    <DialogActions>
                        <Button  
                            className={this.props.classes.buttonCancel} 
                            onClick={this.props.onClose}
                            variant="outlined"
                            disableElevation
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}
  
export default withStyles(useStyles)(CustomerDetailsDialog)