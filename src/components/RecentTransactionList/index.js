import React from 'react';
import {
    makeStyles, 
    Button, 
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
} from '@material-ui/core';
import {
    ArrowUpward as DebitIcon, 
    ArrowDownward as CreditIcon,
    CheckBox as CompletedIcon,
    History as PendingIcon,
    Cancel as DeclinedIcon
} from '@material-ui/icons';
import { yellow, green, red} from '@material-ui/core/colors';
import moment from 'moment'

const useStyle = makeStyles({
    root:{
        padding:0
    },
    list:{
        marginTop:-20,
    },
    button:{
        justifyContent: "left",
        borderRadius: 0
    },
    avatarCredit:{
        backgroundColor: green[500],
    },
    avatarDebit:{
        backgroundColor: red[500],
    },
    listText:{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    },
    primaryText:{
        fontSize: 12,
    },
    secondaryText:{
        fontSize: 11,
    },
    amount:{
        textAlign: "right",
        fontSize: 12,
        fontWeight: 600
    },
    status:{
        textAlign: "right",
        fontSize: 11,
    },
    completedIcon:{
        color: green[500],
        fontSize: 14,
        marginRight: 2,
        marginBottom: 3
    },
    pendingIcon:{
        color: yellow[600],
        fontSize: 14,
        marginRight: 2,
        marginBottom: 3
    },
    declinedIcon:{
        color: red[500],
        fontSize: 14,
        marginRight: 2,
        marginBottom: 3
    }
})

const ITEM_HEIGHT = 48;

const RecentTransactionList = ({data=[], ...props}) =>{

    const classes = useStyle(props)

    const transactions = data

    return(
        <List className={classes.list}>
            {
                transactions.map((transaction, index) =>(
                    <ListItem key={index} disableGutters divider>
                        <ListItemAvatar>
                            {
                                transaction.transaction_type == "credit" ? (
                                    <Avatar className={classes.avatarCredit}>
                                        <CreditIcon/>
                                    </Avatar>
                                ) : (
                                    <Avatar className={classes.avatarDebit}>
                                        <DebitIcon/>
                                    </Avatar>
                                )
                            }
            
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${transaction.customer}`}
                            secondary={transaction.account_no}
                            classes={{primary:classes.primaryText,secondary:classes.secondaryText}}
                            className={classes.listText}
                        />
                        <ListItemSecondaryAction >
                            <Typography component="h4" className={classes.amount}>
                                {(transaction.status == "pending") && <PendingIcon className={classes.pendingIcon} />}
                                {(transaction.status == "completed") && <CompletedIcon className={classes.completedIcon} />}
                                {(transaction.status == "declined") && <DeclinedIcon className={classes.declinedIcon} />}
                                &#8358;{parseFloat(transaction.amount).toLocaleString("en",{minimumFractionDigits: 2})}
                            </Typography>
                            <Typography component="p" className={classes.status}>
                                {moment(transaction.timestamp).fromNow()}
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))
            }
        </List>
    )
}


export default RecentTransactionList