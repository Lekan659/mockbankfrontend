/**
 * Permission Provider
 * It provides to react prop a connecting function for all views to enforce view permission
 */
import React from 'react'
import { NoPermissionView } from 'components'
import {connect} from 'react-redux'
import { isArray } from 'underscore'

class PermissionProvider extends React.Component{
    constructor(props){
        super(props)
    }

    has_permission = () =>{
        let has_permission = false;
        //Check if permission_name is an array
        if(isArray(this.props.permission_name)){
            if(this.props.user_permissions != null){
                for (let index = 0; index < this.props.user_permissions.length; index++) {
                    const permission = this.props.user_permissions[index].permission;
                    for (let i = 0; i < this.props.permission_name.length; i++) {
                        if(permission.name == this.props.permission_name[i]){
                            has_permission = true;
                            break;
                        }
                    }
                }
            }
        }
        else{
            if(this.props.user_permissions != null){
                for (let index = 0; index < this.props.user_permissions.length; index++) {
                    const permission = this.props.user_permissions[index].permission;
                    if(permission.name == this.props.permission_name){
                        has_permission = true;
                        break;
                    }
                }
            }
        }
        
        return has_permission
    }

    render(){
        let Component = this.props.component
        return(
            this.has_permission() ? (
                <Component {...this.props}/> 
            ) : (
                <NoPermissionView {...this.props} />
            )
        )
    }
}

 const withPermission = permission_name => component =>{
     const PermissionWrapper = props =>{

        const hasPermission = permission_name =>{
            let has_permission = false;
            //Check if permission_name is an array
            if(isArray(permission_name)){
                if(props.user_permissions != null){
                    for (let index = 0; index < props.user_permissions.length; index++) {
                        const permission = props.user_permissions[index].permission;
                        for (let i = 0; i < permission_name.length; i++) {
                            if(permission.name == permission_name[i]){
                                has_permission = true;
                                break;
                            }
                        }
                    }
                }
            }
            else{
                if(props.user_permissions != null){
                    for (let index = 0; index < props.user_permissions.length; index++) {
                        const permission = props.user_permissions[index].permission;
                        if(permission.name == permission_name){
                            has_permission = true;
                            break;
                        }
                    }
                }
            }
            return has_permission
         }

         return(
            <PermissionProvider permission_name={permission_name} component={component} hasPermission={hasPermission} {...props}/>
         )
     }

     const mapStateToProps = state => ({
        session_token: state.App.session_token,
        user_permissions: state.App.user_permissions
      });

    return connect(mapStateToProps)(PermissionWrapper)
 }
 
 export default withPermission;
