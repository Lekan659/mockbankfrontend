import React, { Fragment } from 'react';

import clsx from 'clsx';

import { Hidden, Drawer, Paper, Divider, makeStyles } from '@material-ui/core';

import { connect } from 'react-redux';

import SidebarHeader from '../../layout-components/SidebarHeader';
import SidebarMenu from '../../layout-components/SidebarMenu';

import navItems from './navItems';

import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';

import Profile from '../Profile'

const useStyles = makeStyles( theme =>({
  divider: {
    margin: theme.spacing(2, 0)
  },
}))

const Sidebar = props => {
  const {
    setSidebarToggleMobile,
    sidebarToggleMobile,
    sidebarFixed,

    sidebarShadow
  } = props;

  const classes = useStyles()

  const closeDrawer = () => setSidebarToggleMobile(!sidebarToggleMobile);

  const sidebarMenuContent = (
    <div>
      {navItems.map(list => (
        <SidebarMenu
          component="div"
          key={list.label}
          pages={list.content}
          title={list.label}
        />
      ))}
    </div>
  );

  return (
    <Fragment>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          open={sidebarToggleMobile}
          onClose={closeDrawer}
          variant="temporary"
          elevation={4}
          className="app-sidebar-wrapper-lg">
          <SidebarHeader />
          <div style={{overflowY:'auto'}}>{sidebarMenuContent}</div>
        </Drawer>
      </Hidden>

      <Hidden mdDown>
        <Paper
          className={clsx('app-sidebar-wrapper', {
            'app-sidebar-wrapper-fixed': sidebarFixed
          })}
          square
          elevation={sidebarShadow ? 11 : 3}>
          <SidebarHeader />
          <div style={{overflowY:'auto'}}
            className={clsx({
              'app-sidebar-menu': sidebarFixed
            })}>
              <Profile />
              <Divider className={classes.divider}/>
             {sidebarMenuContent}
          </div>
        </Paper>
      </Hidden>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  sidebarFixed: state.ThemeOptions.sidebarFixed,
  headerFixed: state.ThemeOptions.headerFixed,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = dispatch => ({
  setSidebarToggleMobile: enable => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
