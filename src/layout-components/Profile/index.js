import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';

import { connect } from 'react-redux';
import getInitials from 'utils/getInitials';
import UserImage from '../../assets/images/avatars/avatar5.jpg';
import { deepOrange, deepPurple, purple } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content',
    marginTop: 25
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: purple[500]
  },
  name: {
    marginTop: theme.spacing(1),
    textTransform: "capitalize",
  }
}));

const user_inst = {
  first_name: 'Admin',
  last_name: 'Admin',
  avatar: '/images/avatars/avatar_11.png',
  position: 'Administrator'
};

const Profile = ({ user=user_inst, className, ...rest }) => {

  const classes = useStyles();
  
  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        className={classes.avatar}
        src={user.avatar}
      >
        {getInitials(user.first_name +" "+ user.last_name)}
      </Avatar>
      <Typography
        className={classes.name}
        variant="h4"
      >
        {user.first_name +" "+ user.last_name}
      </Typography>
      <Typography variant="body2">{user.position}</Typography>
    </div>
  );
};

//Map state to props
const  mapStateToProps = state => ({
  user_data: state.user_data
});

Profile.propTypes = {
  className: PropTypes.string,
  user_data: PropTypes.object
};

export default connect(mapStateToProps, null)(Profile);

