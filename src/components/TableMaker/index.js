import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { 
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell, 
    TableBody,
    TablePagination,
    withStyles,
    createStyles} from '@material-ui/core';

    const useStyle = createStyles({
        root:{
            width: '100%'
        },
        container: {
            maxHeight: 500,
        },
        tableHeadCell:{
            
        },

    })

class TableMaker extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Paper className={this.props.classes.root} elevation={0}>
                <TableContainer className={this.props.classes.container}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {this.props.columns.map((column, index)=>(
                                    <TableCell
                                        key={'table-header-cell-'+index}
                                        align={(index == 0)? "left" : "center"}
                                        className={this.props.classes.tableHeadCell}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>        
                        </TableHead>
                        <TableBody>
                            {this.props.children}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[15]}
                    component="div"
                    count={this.props.count}
                    rowsPerPage={this.props.options.rowsPerPage}
                    page={this.props.page}
                    onChangePage={this.props.options.onChangePage}
                    onChangeRowsPerPage={()=>{}}
                />
            </Paper>
        )
    }
}

TableMaker.propTypes = {
    children: PropTypes.node,
    columns: PropTypes.array,
    rows: PropTypes.array,
    options: PropTypes.object

}

export default withStyles(useStyle)(TableMaker)