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
    Divider
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
        fontWeight: 500,
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
        marginBottom: 15,
        textTransform: "Capitalize"
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
    }
}))

class SavingsTransactionDetailsDialog extends Component{
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
                    {
                        this.props.data ? (
                            <DialogContent className={this.props.classes.dialogContent}>
                                <Grid container spacing={2}>
                
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Typography component="h4" className={this.props.classes.topHeader}>
                                            Transaction Details - Ref #[ {this.props.data.id} ]
                                        </Typography>
                                        <Divider style={{marginTop:15, marginBottom:5}}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Customer Name:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.customer}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Account Number:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.account_no}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Office Branch:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.office}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Amount:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            &#8358;{parseFloat(this.props.data.amount).toLocaleString("en",{minimumFractionDigits: 2})}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Transaction Type:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.transaction_type}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Transaction Status:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.status}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Timestamp:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {moment(this.props.data.timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Initialized By:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.initialized_by ? this.props.data.initialized_by : "Not Available"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Approved By:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.approved_by ? this.props.data.approved_by : "Not Available"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Channel:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {`${this.props.data.channel}`}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Narration:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {`${this.props.data.narration}`}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            New Balance:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.new_balance ? (<span>&#8358;{parseFloat(this.props.data.new_balance).toLocaleString("en")}</span>) : "Not Available"}
                                        </Typography>
                                    </Grid>
                                </Grid>
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
  
export default withStyles(useStyles)(SavingsTransactionDetailsDialog)