import React, { Component, Fragment } from 'react';
import { PageTitle } from '../../../layout-components';
import { DataLayoutWrapper } from '../../../layout-components';
import { makeRequest, handleError} from 'utils/axios-helper';
import getInitials from 'utils/getInitials';
import { DataViewLoader, TableMaker, StatusBadge, PopoverMenu, IconMenuItem } from 'components'
import qs from 'qs';
import {withSnackbar} from 'notistack';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { setSelectedCustomer } from 'actions'
import withPermission from 'utils/permission'
import { Edit as EditIcon, 
    VpnKey as PermissionIcon, 
    Email as EmailIcon, 
    SmsRounded as SmsIcon,
    Lock as LockIcon,
    FileCopyRounded as CopyIcon
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
import { green, grey } from '@material-ui/core/colors';
import appConfig from 'config/appConfig'
import { setSelectedStaff } from 'actions'

    const useStyles = createStyles({
        boxOuter:{
            display:"flex",
            flexDirection:"row",
            justifyContent:"left"
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
            fontSize: 13,
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
            fontSize: 13
        },
        copyIcon:{
            color: grey[500], 
            fontSize: 14,
            marginLeft: 5,
            '&:hover':{
                cursor:"pointer"
            }
        },
        balanceTypo:{
            color: grey[900],
            fontSize: 13,
            fontWeight: 500
        }
    })
    
const VIEW_PERMISSION_NAME = "can_view_savings_account";

class ViewAccount extends Component{
    constructor(props){
        super(props)
        this.state = {
            columns: [
                {label:'Full Name'},
                {label:'Account Number'},
                {label:'Balance'},
                {label:'Office Branch'},
                {label:'Minimum Balance'},
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
            selecetedStaff: [],
            selectedIndex: null,
            filters: null
        }
    }

    onChangePage = (event,page) =>{
        this.setState({isLoading:true, page: page})
        makeRequest(this.props).post('/account-manager/savings/list/' + (page+1), qs.stringify(this.state.filters))
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
        makeRequest(this.props).post('/account-manager/savings/list', qs.stringify(filters))
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
        makeRequest(this.props).post('/account-manager/savings/list')
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

    updateRows = (data, selectedIndex) =>{
        data.email = null;
        let updated_rows = this.state.rows;
        updated_rows[selectedIndex] = data;
        this.setState({rows:updated_rows});
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

    reload = () =>{
        this.setState({
            isLoading: true,
        })
        this.componentDidMount()
    }

    render(){
        return(
            <Fragment>
                <PageTitle
                    titleHeading="Savings Account"
                    titleDescription="View savings account, make specific changes to Account details"
                />
                <DataLayoutWrapper sectionHeading="Account Table" searchHandler={this.searchHandler} reloadHandler={this.reload}>
                    <DataViewLoader isLoading={this.state.isLoading} data={this.state.rows}>
                    
                    {/** Staff Table */}
                    <TableMaker columns={this.state.columns} page={this.state.page} count={this.state.count} options={this.state.options}>
                        {this.state.rows.map((account, index) => (
                            <TableRow hover key={account.customer.account_no}>
                                <TableCell align="left">
                                    <Box className={this.props.classes.boxOuter}>
                                        <Avatar 
                                            src={account.customer.avatar} 
                                            className={this.props.classes.avatar}
                                        >
                                            {getInitials(account.customer.first_name + " " + account.customer.surname)} 
                                        </Avatar>
                                        <Box className={this.props.classes.boxInner}>
                                            <p className={this.props.classes.name}>{account.customer.first_name + " " + account.customer.surname + " " + account.customer.other_name}</p>
                                            <p className={this.props.classes.position}>{account.customer.gender}</p>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography 
                                        component="h5" 
                                        className={this.props.classes.acctTypo}
                                    >
                                        {account.customer.account_no}
                                        <Tooltip title="Copy">
                                            <CopyIcon 
                                                onClick={event =>this.copyText(account.customer.account_no)} 
                                                className={this.props.classes.copyIcon}
                                            />
                                        </Tooltip>
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography className={this.props.classes.balanceTypo}>
                                        &#8358;{parseFloat(account.savings_account_balance).toLocaleString()}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography className={this.props.classes.typo}>
                                        {account.customer.office.name}, {account.customer.office.state.nicname}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <StatusBadge 
                                        variant={this.statusToBadgeVariant(account.activate_minimum_balance)}
                                    > 
                                        {this.statusToBadgeVariant(account.activate_minimum_balance)} 
                                    </StatusBadge>
                                </TableCell>
                                <TableCell align="center">
                                    <PopoverMenu>
                                        <IconMenuItem 
                                            icon={<EditIcon color="primary"/>} 
                                            text="History" 
                                        />
                                        <IconMenuItem 
                                            icon={<SmsIcon color="primary"/>} 
                                            text="Make Transaction" 
                                        />
                                        <IconMenuItem 
                                            icon={<EmailIcon color="primary"/>} 
                                            text="Actvate Min Bal." 
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
                withRouter(ViewAccount)))))