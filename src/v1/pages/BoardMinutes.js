import ReactDOM from 'react-dom';

import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  PageSection
} from '@patternfly/react-core';

class BoardMinutes extends React.Component {

  render() {
    return (
	<div>
          <Card>
            <CardTitle>Board Meeting Minutes</CardTitle>
            <CardBody> Board Meeting Minutes should go here!</CardBody>
          </Card>
	</div>
    );
  }
}

export default BoardMinutes;

