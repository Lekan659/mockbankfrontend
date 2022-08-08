/**
 * App Action types
 */

 /**
  * This action fires when user get a new token
  */
 export const SET_SESSION_TOKEN = "SET_SESSION_TOKEN";

  /**
  * This action set general options
  */
 export const SET_OPTIONS = "SET_OPTIONS";

 /**
  * This action fires when user start a new seesion
  */
 export const SET_USER_DATA = "SET_USER_DATA";

 /**
  * This action set user valid session/authentication status
  */
 export const SET_IS_AUTHENTICATED_STATUS = "SET_IS_AUTHENTICATED_STATUS";

  /**
  * This action set user active view permission
  */
 export const SET_HAS_VIEW_PERMISSION = "SET_HAS_VIEW_PERMISSION";

 /**
  * This action set user assigned permissions
  */
 export const SET_USER_PERMISSIONS = "SET_USER_PERMISSIONS";

 /**
  * This action set selected staff from the database for staff permission settings
  */
 export const SET_SELECTED_STAFF = "SET_SELECTED_STAFF";

 /**
  * This action sets Office Locations
  */
 export const SET_OFFICE_LOCATION = "SET_OFFICE_LOCATION";

 /**
  * This action sets user Office Locations
  */
 export const SET_USER_OFFICE_LOCATION = "SET_USER_OFFICE_LOCATION";

  /**
  * This action sets selected customer
  */
 export const SET_SELECTED_CUSTOMER = "SET_SELECTED_CUSTOMER";