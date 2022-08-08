import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { 
    Paper,  
    Divider,  
    Typography, 
    withStyles, 
    createStyles,
    TextField,
    CardContent,
    InputBase,
    IconButton
} from '@material-ui/core';
import { Search as SearchIcon, Settings as SettingsIcon} from '@material-ui/icons';
import { grey,blueGrey, green, red } from '@material-ui/core/colors';
import {NoPermissionViewMinimal} from 'components'
import { Search } from '@material-ui/icons';

const styles = createStyles(theme =>({
    root: {
        width: "100%",
        minHeight: 400,
        marginTop: "-17px",
        borderWidth: 1,
        padding: 15,
        backgroundColor: "#fcfcfc"
    },
    topBar:{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "right",
        alignItems: "right"
    },
    paperRoot: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 300,
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
    searchField:{
        width: 250
    },
    header: {
        fontSize: 14,
        fontWeight: 400,
        color: grey[900],
        
    }
}))
class TransactionTab extends Component{
    constructor(props){
        super(props)
        this.state = {
            tabValue:0,
        };
    }

    handleTabChange = (event, value)=>{
        this.setState({tabValue: value})
    }

    render(){
        return(
            <Paper variant="outlined" className={this.props.classes.root}>
                <CardContent className={this.props.classes.topBar}>
                    <Paper component="form" className={this.props.classes.paperRoot} elevation={0} variant="outlined">
                        <InputBase
                            className={this.props.classes.input}
                            inputProps={{ 'aria-label': 'search data' }}
                            placeholder="Search Customer"                          
                        />
                        <IconButton><SearchIcon/></IconButton>
                    </Paper>
                </CardContent>
                <Divider style={{marginBottom:20}}/>
                {
                    this.props.hasPermission ? (
                        (this.props.debit || this.props.credit) && this.props.children
                    ) : (
                        <NoPermissionViewMinimal/>
                    )
                }
            </Paper>
        )
    }
}

TransactionTab.propTypes = {
    children: PropTypes.node,
    credit: PropTypes.bool,
    debit: PropTypes.bool,
    hasPermission: PropTypes.bool
}
export default withStyles(styles)(TransactionTab)