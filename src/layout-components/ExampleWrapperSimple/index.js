import React, { Component } from 'react';

import { Card, CardContent, CardActions } from '@material-ui/core';

export default class ExampleWrapperSimple extends Component {
  render() {
    return (
      <Card className="card-box mb-4-spacing overflow-visible" elevation={0} variant="outlined">
        <div className="card-header">
          <div className="card-header--title font-size-md font-weight-bold py-2">
            {this.props.sectionHeading}
          </div>
        </div>
        <CardContent className="p-3">{this.props.children}</CardContent>
      </Card>
    );
  }
}
