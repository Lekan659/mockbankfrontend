import React, { Component, Fragment } from 'react';
import { 
    Box, 
    Button, 
    CardActions, 
    Divider, 
    Grid, 
    AppBar, 
    Tab, 
    Tabs, 
    Typography, 
    withStyles, 
    createStyles 
} from '@material-ui/core';
import { grey,blueGrey, green, red } from '@material-ui/core/colors';
import {TabPanel} from 'components'
import SwipeableViews from 'react-swipeable-views'

const styles = createStyles(theme =>({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    appBar: {
        backgroundColor: grey[200],
        maxWidth: 350,
        height: 34,
        borderRadius: 20
    },
    indicator: {
        backgroundColor: 'transparent',
    },
    tabsRoot:{
        
    },
    tabRootCredit: {
        textTransform: 'none',
        color: grey[800],
        fontFamily: "Roboto",
        fontWeight: 600,
        fontSize: theme.typography.pxToRem(13),
        marginRight: theme.spacing(0),
        minHeight: 23,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20
      },
      selectedCredit: {
        color: "#fff",
        backgroundColor: green[300],
      },
    tabRootDebit: {
        textTransform: 'none',
        color: grey[800],
        fontFamily: "Roboto",
        fontWeight: 600,
        fontSize: theme.typography.pxToRem(13),
        marginRight: theme.spacing(0),
        minHeight: 23,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
      },
      selectedDebit: {
        color: "#fff",
        backgroundColor: red[300],
      },
}))
class TransactionTabView extends Component{
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
            <Fragment>
                    <div className={this.props.classes.root}>
                        <AppBar position="static" className={this.props.classes.appBar} elevation={1}>
                            <Tabs
                                variant="fullWidth"
                                value={this.state.tabValue}
                                onChange={this.handleTabChange}
                                classes={{indicator:this.props.classes.indicator, root:this.props.classes.tabsRoot}}
                            >
                                <Tab 
                                    classes={{root:this.props.classes.tabRootCredit, selected:this.props.classes.selectedCredit}}
                                    label="Deposit" 
                                    id="tab-0" 
                                    aria-controls="tabpanel-0"
                                    disableRipple
                                />
                                <Tab 
                                    classes={{root:this.props.classes.tabRootDebit, selected:this.props.classes.selectedDebit}}
                                    label="Withdrawal" 
                                    id="tab-1" 
                                    aria-controls="tabpanel-1"
                                    disableRipple
                                />
                            </Tabs>
                        </AppBar>
                    </div>
                    {
                        this.props.children.length == 2 ? (
                            React.Children.map(this.props.children, (child, index) => (
                                
                                child.props.credit ? (
                                    <TabPanel key={index} value={this.state.tabValue} index={0}>
                                        {child}
                                    </TabPanel>
                                ) : (
                                    child.props.debit && (
                                        <TabPanel key={index} value={this.state.tabValue} index={1}>
                                            {child}
                                        </TabPanel>
                                    )
                                )
                            ))
                        ) : (
                            null
                        )
                    }
            </Fragment>
        )
    }
}
  
export default withStyles(styles)(TransactionTabView)