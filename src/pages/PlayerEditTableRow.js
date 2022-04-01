import * as React from 'react';
import { 
  Alert, 
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Button, 
  Select,
  SelectDirection,
  SelectOption,
  SelectVariant,
  TextInput
} from '@patternfly/react-core';
import { Tr, Td } from '@patternfly/react-table';
import { columnNames } from './AdminPlayersTable';
import ConfirmDialog from './ConfirmDialog';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import Remove2Icon from '@patternfly/react-icons/dist/esm/icons/remove2-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

const PlayerEditTableRow = ({ children, ...props }) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const {key, currentRow, fetchPlayers, addSuccessAlert, addFailureAlert } = props;
  const [editedName, setEditedName] = React.useState(currentRow.playerName);
  const [editedNumber, setEditedNumber] = React.useState(currentRow.playerNumber);
  const [editedDivision, setEditedDivision] = React.useState(currentRow.division);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isConfirmDlgOpen, setConfirmDlgOpen] = React.useState(false);

  const divisionDropdownItems = [
    <SelectOption key={0} value="Select a Division" label="Select a Division" isPlaceholder />,
    <SelectOption key={1} value="6U" label="6U" />,
    <SelectOption key={2} value="8U" label="8U" />,
    <SelectOption key={3} value="10U" label="10U" />,
    <SelectOption key={4} value="12U" label="12U" />,
    <SelectOption key={5} value="14U" label="14U"/>,
    <SelectOption key={6} value="16U" label="16U" />
  ];

  async function updatePlayerInDatabase (url = '', data = {}) {
    const response = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
  };

  async function removePlayerInDatabase (url = '', data = {}) {
    const response = await fetch(url, {
      method: 'DELETE',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
  };

  const updatePlayer = (id) => {
    updatePlayerInDatabase('http://192.168.1.21:8081/players/'+ id, { playerName: editedName, playerNumber: parseInt(editedNumber), division: editedDivision, teamId: currentRow.teamId })      
    .then(data => {
      if (data.message === "Player info updated successfully") {
        addSuccessAlert(editedName + " updated successfully");
        fetchPlayers();
      }
      else {
        addFailureAlert(editedName + " update unsuccessful");
        fetchPlayers();
        console.log("Error updating " + editedName);
      }
    });
  }

  const removePlayer = async (id) => {
      setIsEditMode(false);
      removePlayerInDatabase('http://192.168.1.21:8081/players/'+ id, {})
      .then(data => {
        if (data.message === "Player deleted successfully") {
          addSuccessAlert(editedName + " removed successfully");
          fetchPlayers();
        }
        else {
          addFailureAlert(editedName + " removal unsuccessful");
          fetchPlayers();
          console.log("Error removing " + editedName);
        }
      });
  }

  const onToggle = isOpen => {
    setIsOpen( isOpen );
  };
  
  const onSelect = (event, selection, isPlaceholder) => {
    if (isPlaceholder) {
        setEditedDivision("");
        setIsOpen(false);
      }
    else {
      setEditedDivision(selection);
      setIsOpen(false);
      }
  };

  const handleYes = () => {
    removePlayer(currentRow.id);
    setConfirmDlgOpen(false);
  }

  const handleNo = () => {
    setConfirmDlgOpen(false);
  }

  return (
    <React.Fragment>
      <ConfirmDialog title={"Are you sure you want to delete " + editedName + "?"} isModalOpen={isConfirmDlgOpen} handleYes={handleYes} handleNo={handleNo}/>
      <Tr key={key}>
        <Td dataLabel={columnNames.playerName}>
          {isEditMode ? (
            <TextInput
              value={editedName}
              type="text"
              aria-label="edit-player-name"
              onChange={(value) => {
                setEditedName(value);
              } } />
          ) : (
            editedName
          )}
        </Td>
        <Td dataLabel={columnNames.playerNumber}>
          {isEditMode ? (
            <TextInput
              value={editedNumber}
              type="number"
              aria-label="edit-player-number"
              onChange={(value) => {
                setEditedNumber(value);
              } } />
          ) : (
            editedNumber
          )}
        </Td>
        <Td dataLabel={columnNames.division}>
          {isEditMode ? (
            <Select
              variant={SelectVariant.single}
              aria-label="Select Division"
              onToggle={onToggle}
              onSelect={onSelect}
              onChange={(value) => {
                setEditedDivision(value);
              }}
              selections={editedDivision}
              isOpen={isOpen}
              aria-labelledby="edit-player-division"
              direction={SelectDirection.down}
              menuAppendTo={() => document.body}
            >
              { divisionDropdownItems }
          </Select>
        ) : (
            editedDivision
          )}
        </Td>
        <Td modifier="nowrap">
          {!isEditMode ? (
            <React.Fragment>
              <Button
                variant="link"
                icon={<PencilAltIcon />}
                iconPosition="right"
                onClick={() => {
                  setIsEditMode(true);
                } }
              >
                Edit
              </Button>
              <Button
                variant="link"
                icon={<Remove2Icon />}
                iconPosition="right"
                onClick={() => {
                  setConfirmDlgOpen(true);
                }}
              >
                Remove
              </Button>
            </React.Fragment>
          ) : (
            <>
              <Button
                variant="link"
                icon={<CheckIcon />}
                onClick={() => {
                  setIsEditMode(false);
                  updatePlayer(currentRow.id);
                } } />
              <Button
                variant="plain"
                icon={<TimesIcon />}
                onClick={() => {
                  setIsEditMode(false);
                } }
              >
                <TimesIcon />
              </Button>
            </>
          )}
        </Td>
      </Tr>
      </React.Fragment>
  );
}

export default PlayerEditTableRow;
