import React, { useEffect } from 'react';
import {
  Button,
  DualListSelector,
  Modal,
  ModalVariant
} from '@patternfly/react-core';

class AdminAddPlayerToTeamModal extends React.Component{
  constructor(props) {
    super(props);
    console.log(this.props.teamId, this.props.teamId, this.props.teamName);
    this.state = {
      isModalOpen: this.props.modalOpen,
      availablePlayers: this.props.players,
      teamId: this.props.teamId,
      teamName: this.props.teamName,
      chosenPlayers: []
    };

    this.onListChange = (newAvailablePlayers, newChosenPlayers) => {
      this.setState({
        availablePlayers: newAvailablePlayers.sort(),
        chosePlayers: newChosenPlayers.sort()
      })
    };

  }

  render() {
    const { isModalOpen, availablePlayers, teamId, division, teamName} = this.props;
    const { chosenPlayers } = this.state;

    return (
      <React.Fragment>
        <Modal
          variant={ModalVariant.medium}
          title="Add Player To Team"
           description="Adds a player to the selected team"
          isOpen={isModalOpen}
          onClose={this.handleAddModalCancel}
          actions={[
            <Button key="addTeam" variant="primary" form="add-team-form" onClick={this.props.handleAddModalOK}>
              Add Player(s)
            </Button>,
            <Button key="cancelAddTeam" variant="link" onClick={this.props.handleAddModalCancel}>
              Cancel
            </Button>
          ]}
        >
          <DualListSelector
            availableOptionsTitle="Available Players"
            availableOptions={availablePlayers}
            chosenOptionsTitle={teamName}
            chosenOptions={chosenPlayers}
            onListChange={this.onListChange}
            id="basicSelector"
          />
        </Modal>
      </React.Fragment>
    )
  }
}

export default AdminAddPlayerToTeamModal;
