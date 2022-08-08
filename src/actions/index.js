/**
 * App action creators
 */
import {
    SET_SESSION_TOKEN, 
    SET_USER_DATA,
    SET_IS_AUTHENTICATED_STATUS,
    SET_OPTIONS,
    SET_HAS_VIEW_PERMISSION,
    SET_USER_PERMISSIONS,
    SET_SELECTED_STAFF,
    SET_OFFICE_LOCATION,
    SET_USER_OFFICE_LOCATION,
    SET_SELECTED_CUSTOMER,
} from './types';

 /**
  * Set user session token
  * @param {String} token
  */
 export function setSessionToken(token){
     return {
        type: SET_SESSION_TOKEN,
        token
     }
 }

 /**
  * Set option
  * @param {object} options
  */
 export function setOptions(options){
    return {
       type: SET_OPTIONS,
       options
    }
}

 /**
  * Set user data
  * @param {object} user_data
  */
 export function setUserData(user_data){
    return {
       type: SET_USER_DATA,
       user_data
    }
}

/**
  * Set valid session/authentication status
  * @param {Boolean} status
  */
 export function setIsAuthenticatedStatus(status){
    return {
       type: SET_IS_AUTHENTICATED_STATUS,
       status
    }
}

/**
  * Set view permission status
  * @param {Boolean} status
  */
 export function setHasViewPermission(status){
   return {
      type: SET_HAS_VIEW_PERMISSION,
      status
   }
}

/**
  * Set view user permissions
  * @param {Boolean} status
  */
 export function setUserPermissions(permissions){
   return {
      type: SET_USER_PERMISSIONS,
      permissions
   }
}

/**
  * Set selected staff
  * @param {object} staffs
  */
 export function setSelectedStaff(staff){
   return {
      type: SET_SELECTED_STAFF,
      staff
   }
}

 /**
  * Set office locations
  * @param {object} office_location
  */
 export function setOfficeLocation(office_location){
   return {
      type: SET_OFFICE_LOCATION,
      office_location
   }
}

 /**
  * Set user office locations
  * @param {object} user_office_location
  */
 export function setUserOfficeLocation(user_office_location){
   return {
      type: SET_USER_OFFICE_LOCATION,
      user_office_location
   }
}

 /**
  * Set selected customer
  * @param {String} account_no
  */
 export function setSelectedCustomer(account_no){
   return {
      type: SET_SELECTED_CUSTOMER,
      account_no
   }
}