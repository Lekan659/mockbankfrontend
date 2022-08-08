import React, { Component, Fragment } from 'react';
import { PageTitle } from '../../../layout-components';
import { DataLayoutWrapper } from '../../../layout-components';
import { makeRequest, handleError} from 'utils/axios-helper';
import getInitials from 'utils/getInitials';
import { DataViewLoader, StatusBadge, TableMaker, PopoverMenu, IconMenuItem } from 'components'
import qs from 'qs';
import {withSnackbar} from 'notistack';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { setStaffList } from 'actions'
import withPermission from 'utils/permission'
import { Edit as EditIcon, 
    VpnKey as PermissionIcon, 
    Block as BlockIcon, 
    Check as CheckIcon,
    Lock as LockIcon
} from '@material-ui/icons'
import { 
    TableRow,
    TableCell, 
    Avatar,
    Box,
    withStyles,
    createStyles,
    Typography
} from '@material-ui/core';
import StaffEditModal from './StaffEditModal';
import { purple } from '@material-ui/core/colors';
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
            backgroundColor:purple[500]
        },
        name:{
            fontSize: 13,
            color: '#111111',
            margin: 0
        },
        typo:{
            fontSize: 13,
        },
        position:{
            fontSize: 12,
            color: '#888888',
            marginTop: 2
        }
    })
    
const VIEW_PERMISSION_NAME = "can_view_staff";

class ViewStaff extends Component{
    constructor(props){
        super(props)
        this.state = {
            columns: [
                {label:'Full Name'},
                {label:'Email'},
                {label:'Gender'},
                {label:'Status'},
                {label:'Action'}
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
        makeRequest(this.props).post('/staff/list/' + (page+1), qs.stringify(this.state.filters))
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
            return "active";
        }
        else{
            return "inactive";
        }
    }

    onEdit = (index) =>{
        this.setState({
            selecetedStaff: this.state.rows[index],
            selectedIndex: index,
            open: true
        })
    }

    handlePermission = index =>{
        this.props.dispatch(setSelectedStaff(this.state.rows[index]))
        this.props.history.push('/staff-permissions')
    }

    searchHandler = filters =>{
        this.setState({isLoading:true, page: 0})
        makeRequest(this.props).post('/staff/list', qs.stringify(filters))
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
        makeRequest(this.props).post('/staff/list')
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
                    titleHeading="Staff Management"
                    titleDescription="Edit staff permissions, profile, reset password and deactivate staff profile"
                />
                <DataLayoutWrapper sectionHeading="View Enrolled Staffs" searchHandler={this.searchHandler} reloadHandler={this.reload}>
                    <DataViewLoader isLoading={this.state.isLoading} data={this.state.rows}>
                    {/** Staff Edit Modal */}
                        {this.state.open && 
                            <StaffEditModal 
                            open={this.state.open} 
                            onClose={evt =>{this.setState({open: false, selecetedStaff:[]})}} 
                            data={this.state.selecetedStaff}
                            selectedIndex={this.state.selectedIndex}
                            updateRows={this.updateRows}
                            />
                        }
                    {/** Staff Table */}
                    <TableMaker columns={this.state.columns} page={this.state.page} count={this.state.count} options={this.state.options}>
                        {this.state.rows.map((staff, index) => (
                            <TableRow hover key={staff.id}>
                                <TableCell align="left">
                                    <Box className={this.props.classes.boxOuter}>
                                        <Avatar 
                                            src={staff.avatar} 
                                            className={this.props.classes.avatar}
                                        >
                                            {getInitials(staff.first_name + " " + staff.last_name)} 
                                        </Avatar>
                                        <Box className={this.props.classes.boxInner}>
                                            <p className={this.props.classes.name}>{staff.first_name + " " + staff.last_name}</p>
                                            <p className={this.props.classes.position}>{staff.position}</p>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography className={this.props.classes.typo}>
                                        {staff.auth.email}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography className={this.props.classes.typo}>
                                        {staff.auth.gender}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <StatusBadge 
                                        variant={this.statusToBadgeVariant(staff.auth.is_active)}
                                    > 
                                        {this.statusToBadgeVariant(staff.auth.is_active)} 
                                    </StatusBadge>
                                </TableCell>
                                <TableCell align="center">
                                    <PopoverMenu>
                                        <IconMenuItem 
                                            icon={<EditIcon color="primary"/>} 
                                            text="Edit/View" 
                                            onClick={evt => {this.onEdit(index)}}
                                        />
                                        <IconMenuItem 
                                            icon={<PermissionIcon color="primary"/>} 
                                            text="Permissions"
                                            onClick={evt => {this.handlePermission(index)}} 
                                        />
                                        {(staff.auth.is_active) ? (
                                            <IconMenuItem icon={<BlockIcon color="primary"/>} text="Deactivate"/>
                                        ) : (
                                            <IconMenuItem icon={<CheckIcon color="primary"/>} text="Activate"/>
                                        )}
                                        <IconMenuItem icon={<LockIcon color="primary"/>} text="Reset Password"/>
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
    staff_list: state.App.staff_list
  });
  
export default connect(mapStateToProps)(
    withSnackbar(
        withStyles(useStyles)(
            withPermission(VIEW_PERMISSION_NAME)(
                withRouter(ViewStaff)))))