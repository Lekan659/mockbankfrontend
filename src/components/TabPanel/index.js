import React from 'react';
import PropTypes from 'prop-types';

const TabPanel = props =>{
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tab-${index}`}
        aria-labelledby={`tabpanel-${index}`}
        {...other}
      >
        {value === index && (
            <React.Fragment>
                {children}
            </React.Fragment>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  export default TabPanel