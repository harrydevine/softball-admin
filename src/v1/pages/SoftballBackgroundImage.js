import React from 'react';
import {
  BackgroundImage
} from '@patternfly/react-core';

class SoftballBackgroundImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return <BackgroundImage src="./softball_background.png" />;
  }
}

export default SoftballBackgroundImage;
