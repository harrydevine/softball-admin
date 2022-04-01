import React from 'react';
import {
  Button,
  Modal,
  ModalVariant
} from '@patternfly/react-core';

class ConfirmDialog extends React.Component{
  constructor(props) {
    super(props);

    this.handleYes = () => {
      console.log("clicked yes");
    };

    this.handleNo = () => {
        console.log("clicked no");
    };

  }

  render() {
    const { isModalOpen } = this.props;

    return (
      <React.Fragment>
        <Modal
          variant={ModalVariant.medium}
          title={this.props.title}
          isOpen={isModalOpen}
          onClose={this.props.handleNo}
          actions={[
            <Button key="confirmYes" variant="primary" form="confirmYes" onClick={this.props.handleYes}>
              Yes
            </Button>,
            <Button key="confirmNo" variant="primary" onClick={this.props.handleNo}>
              No
            </Button>
          ]}
        >
        </Modal>
      </React.Fragment>
    )
  }
}

export default ConfirmDialog;
