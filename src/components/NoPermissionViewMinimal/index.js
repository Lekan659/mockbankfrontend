import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom'
import { PageTitle } from 'layout-components';
import {Box, Button, Avatar, createStyles, withStyles} from '@material-ui/core';
import { LockRounded as LockIcon} from '@material-ui/icons'
import { ExampleWrapperSimple } from 'layout-components';

const useStyles = createStyles(theme => ({
    body: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    avatarLocked: {
        width: 100,
        height: 100,
        marginBottom: 30
    },
    icon:{
        fontSize: 60,
        color: '#fff'
    },
    smallText: {
        fontSize: 13,
        color: "#555555"
    }
}))

class NoPermissionViewMinimal extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Fragment>
                    <Box className={this.props.classes.body}>
                        <Avatar className={this.props.classes.avatarLocked}>
                            <LockIcon className={this.props.classes.icon}/>
                        </Avatar>
                        <p>You are seeing this because you don't have the required permission to perform any acction on this view</p>
                        <p className={this.props.classes.smallText}>If you believe this is an error; please reload browser frame!</p>
                    </Box>
            </Fragment>
        )
    }
}
  
export default withRouter(withStyles(useStyles)(NoPermissionViewMinimal))