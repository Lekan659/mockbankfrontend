import React, { Component, Fragment } from 'react';
import { PageTitle } from '../../../layout-components';
import { DataLayoutWrapper } from '../../../layout-components';
import { makeRequest, handleError} from 'utils/axios-helper';
import { DataViewLoader, TableMaker, StatusBadge, PopoverMenu, IconMenuItem, SavingsTransactionDetailsDialog } from 'components'
import qs from 'qs';
import {withSnackbar} from 'notistack';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { setSelectedCustomer } from 'actions'
import withPermission from 'utils/permission'
import { Edit as EditIcon, 
    Check as ApproveIcon, 
    Cancel as DeclineIcon,
    Receipt as ReceiptIcon,
    ArrowDownward as CreditIcon,
    ArrowUpward as DebitIcon,
    Details as DetailsIcon,
    Undo as ReverseIcon
} from '@material-ui/icons'
import { 
    TableRow,
    TableCell, 
    Avatar,
    Box,
    Typography,
    Tooltip,
    withStyles,
    createStyles
} from '@material-ui/core';
import { green, grey, red } from '@material-ui/core/colors';
import appConfig from 'config/appConfig'
import moment from 'moment'
import withConfirmationDialog from 'utils/confirmationDialog'

    const useStyles = createStyles({
        boxOuter:{
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems: "center"
        },
        boxInner:{
            marginTop: 10,
            marginLeft: 5
        },
        avatar: {
            width: 60,
            height: 60,
            backgroundColor:green[500]
        },
        name:{
            fontSize: 14,
            color: '#111111',
            margin: 0
        },
        position:{
            fontSize: 12,
            color: grey[600],
            marginTop: 2,
            textTransform: "capitalize"
        },
        typo:{
            fontSize: 13
        },
        acctTypo:{
            fontWeight: 600,
            letterSpacing: 2,
            color: grey[800],
            fontSize: 14
        },
        copyIcon:{
            color: grey[500], 
            fontSize: 15,
            marginLeft: 5,
            '&:hover':{
                cursor:"pointer"
            }
        },
        balanceTypo:{
            color: grey[900],
            fontSize: 14,
            fontWeight: 600
        }
    })
    
const VIEW_PERMISSION_NAME = "can_view_savings_transaction";

class TransactionHistory extends Component{
    constructor(props){
        super(props)
        this.state = {
            columns: [
                {label:'Ref Id'},
                {label:'Full Name'},
                {label:'Account Number'},
                {label:'Amount'},
                {label:'Office Branch'},
                {label:'Status'},
                {label:'Timestamp'},
                {label:'Actions'}
            ],
            rows: [],
            count: 0,
            page: 0,
            options: {
                rowsPerPage: appConfig.rowsPerPage,
                onChangePage: this.onChangePage
            },
            isLoading: true,
            open: false,
            selectedTransaction: null,
            selectedIndex: null,
            filters: null
        }
    }

    onChangePage = (event,page) =>{
        this.setState({isLoading:true, page: page})
        makeRequest(this.props).post('/transaction/savings/list/' + (page+1), qs.stringify(this.state.filters))
        .then(response => {
           this.setState({
               rows:response.data.data,
               count: response.data.count
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
            this.setState({isLoading:false});
        })
    }

    statusToBadgeVariant = status =>{
        if(status){
            return "on";
        }
        else{
            return "off";
        }
    }

    searchHandler = filters =>{
        this.setState({isLoading:true, page: 0})
        makeRequest(this.props).post('/transaction/savings/list', qs.stringify(filters))
        .then(response => {
           this.setState({
               rows:response.data.data,
               count: response.data.count,
               filters
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
            this.setState({isLoading:false});
        })
    }

    componentDidMount(){
        makeRequest(this.props).post('/transaction/savings/list')
        .then(response => {
           this.setState({
               rows:response.data.data,
               count: response.data.count
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
            this.setState({isLoading:false});
        })
    }

    copyText = (text) =>{
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        this.props.enqueueSnackbar("Text copied to clipboard!", {variant: "info"});
    }

    showDetails = (index) =>{
        this.setState({
            open: true,
            selectedTransaction: this.state.rows[index]
        })
    }

    reload = () =>{
        this.setState({
            isLoading: true,
        })
        this.componentDidMount()
    }

    updateTransaction = (index, new_status) =>{
        let tag_word = ""
        if(new_status == "completed"){
            tag_word = "Approve"
        }
        else if(new_status == "declined"){
            tag_word = "Decline"
        }
        else if(new_status == "reversed"){
            tag_word = "Reverse"
        }

        let transaction = this.state.rows[index]
        this.props.openDialog({
            viewCtrl: "warning",
            title: transaction.transaction_type == 'credit' ? `${tag_word } Credit Transaction` : `${tag_word} Debit Transaction`,
            description: "Make sure you have confirmed the transaction details before you continue",
            close: dialog =>{
                dialog.close()
            },
            confirm: dialog =>{
                makeRequest(this.props).post('/transaction/savings/update', qs.stringify({
                    id: transaction.id,
                    new_status: new_status,
                }))
                .then(response => {
                    dialog.setViewCtrl("success")
                    dialog.setTitle("Done!")
                    dialog.setDescription(response.data.message)
                    //Update transaction table row
                    transaction.status = new_status;
                    let updated_rows = this.state.rows;
                    updated_rows[index] = transaction;
                    this.setState({rows:updated_rows});
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

    render(){
        return(
            <Fragment>
                <PageTitle
                    titleHeading="Savings Account Transactions"
                    titleDescription="View savings account Transaction, make specific changes and take actions on transactions"
                />
                {/** Savings Transaction Details Dialog */}
                <SavingsTransactionDetailsDialog 
                    open={this.state.open} 
                    onClose={() => this.setState({open:false})} 
                    data={this.state.selectedTransaction}
                />

                <DataLayoutWrapper sectionHeading="Transaction Table" searchHandler={this.searchHandler} reloadHandler={this.reload}>
                    <DataViewLoader isLoading={this.state.isLoading} data={this.state.rows}>
                    {/** Staff Table */}
                    <TableMaker columns={this.state.columns} page={this.state.page} count={this.state.count} options={this.state.options}>
                        {this.state.rows.map((transaction, index) => (
                            <TableRow hover key={transaction.account_no}>
                                <TableCell align="left">
                                    {
                                        transaction.transaction_type == "credit" && 
                                        <Box className={this.props.classes.boxOuter}>
                                            <CreditIcon style={{color:green[500]}}/>
                                            <Typography>{transaction.id}</Typography>
                                        </Box>
                                    }
                                   {
                                        transaction.transaction_type == "debit" && 
                                        <Box className={this.props.classes.boxOuter}>
                                            <DebitIcon style={{color:red[500]}}/> 
                                            <Typography>{transaction.id}</Typography>
                                        </Box>
                                    }
                                </TableCell>
                                <TableCell align="left">
                                    <Typography className={this.props.classes.typo}>
                                        {transaction.customer}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography 
                                        component="h5" 
                                        className={this.props.classes.typo}
                                    >
                                        {transaction.account_no}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography className={this.props.classes.balanceTypo}>
                                        &#8358;{parseFloat(transaction.amount).toLocaleString()}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography className={this.props.classes.typo}>
                                        {transaction.office}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <StatusBadge 
                                        variant={transaction.status}
                                    > 
                                        {transaction.status} 
                                    </StatusBadge>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography className={this.props.classes.typo}>
                                        {moment(transaction.timestamp).format("ddd, MMM Do YYYY")}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <PopoverMenu>
                                        <IconMenuItem 
                                            icon={<ApproveIcon style={{color:green[500]}}/>} 
                                            text="Approve" 
                                            disabled={!(transaction.status == "pending")}
                                            onClick={()=>this.updateTransaction(index, "completed")}
                                        />
                                        <IconMenuItem 
                                            icon={<DeclineIcon style={{color:red[500]}}/>} 
                                            text="Decline" 
                                            disabled={!(transaction.status == "pending")}
                                            onClick={()=>this.updateTransaction(index, "declined")}
                                        />
                                        <IconMenuItem 
                                            icon={<ReverseIcon color="secondary"/>} 
                                            text="Reverse" 
                                            disabled={!(transaction.status == "completed")}
                                            onClick={()=>this.updateTransaction(index, "reversed")}
                                        />
                                        <IconMenuItem 
                                            icon={<DetailsIcon color="primary"/>} 
                                            text="Details"
                                            onClick={() => this.showDetails(index)}
                                        />
                                        <IconMenuItem 
                                            icon={<ReceiptIcon color="primary"/>} 
                                            text="Receipt"
                                            disabled={(transaction.status == "pending")} 
                                        />
                                    </PopoverMenu>
                                </TableCell>
                            </TableRow>
                        ))}    
                    </TableMaker>
                    </DataViewLoader>
                </DataLayoutWrapper>
            </Fragment>
        )
    }
}

//Map state to props
const mapStateToProps = state => ({
    session_token: state.App.session_token,
    user_permissions: state.App.user_permissions,
  });
  
export default connect(mapStateToProps)(
    withSnackbar(
        withStyles(useStyles)(
            withPermission(VIEW_PERMISSION_NAME)(
                withRouter(
                    withConfirmationDialog(TransactionHistory))))))