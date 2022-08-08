import React, { Component, Fragment } from 'react';
import {connect} from 'react-redux'
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
        fontSize: 14,
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
    topInfo: {
        fontSize: 18,
        fontWeight: 600,
        fontFamily: "Calibri",
        color: "#fff",
        marginTop: 15,
        marginBottom: 15,
        textAlign: "left",
        marginLeft: 10
    },
    buttonCancel:{
        color: red[500]
    }, 
    isLoading:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: 250
    }
}))

class FixedDepositPreviewDialog extends Component{
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
                            Fixed Deposit Preview
                        </Typography>
                    </AppBar>
                    {
                        this.props.data ? (
                            <DialogContent className={this.props.classes.dialogContent}>
                                <Grid container spacing={2}>
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
                                            Investment Amount:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            &#8358;{parseFloat(this.props.data.amount).toLocaleString("en",{minimumFractionDigits: 2})}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Rate:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.rate}%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Upfront Interest:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.upfront_interest? "Yes" : "No"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Total Interest at Maturity:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            &#8358;{parseFloat(this.props.data.total_interest).toLocaleString("en",{minimumFractionDigits: 2})}
                                        </Typography>
                                    </Grid>
                                    {this.props.data.withholding_tax && 
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <Typography component="h4" className={this.props.classes.title}>
                                                Total Interest after Tax:
                                            </Typography>
                                            <Typography component="p" className={this.props.classes.text}>
                                                &#8358;{(parseFloat(this.props.data.total_amount) - parseFloat(this.props.data.amount)).toLocaleString("en",{minimumFractionDigits: 2})}
                                            </Typography>
                                        </Grid>
                                    }
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Total amount at Maturity:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            &#8358;{parseFloat(this.props.data.total_amount).toLocaleString("en",{minimumFractionDigits: 2})}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Withholding Tax:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.withholding_tax ? `Yes (at ${this.props.envOptions.withholding_tax}%)` : 'No'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Fixed Deposit Duration:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.duration} Days
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Investment Date:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {moment(this.props.data.investement_date).format("dddd, MMMM Do YYYY")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Maturity Date:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {moment(this.props.data.maturity_date).format("dddd, MMMM Do YYYY")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <Typography component="h4" className={this.props.classes.title}>
                                            Tag Line:
                                        </Typography>
                                        <Typography component="p" className={this.props.classes.text}>
                                            {this.props.data.tag_line}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                        ) : (
                            <Box className={this.props.classes.isLoading}>
                                <CircularProgress size={30} />
                            </Box>
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
const mapStateToProps = state =>({
    envOptions: state.App.options
}) 

export default connect(mapStateToProps)(withStyles(useStyles)(FixedDepositPreviewDialog))