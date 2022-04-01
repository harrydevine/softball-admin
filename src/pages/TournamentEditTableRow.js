import * as React from 'react';
import { 
  Alert, 
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Button, 
  DatePicker,
  TextInput
} from '@patternfly/react-core';
import { Tr, Td } from '@patternfly/react-table';
import { columnNames } from './AdminTournamentsTable';
import ConfirmDialog from './ConfirmDialog';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import Remove2Icon from '@patternfly/react-icons/dist/esm/icons/remove2-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

const TournamentEditTableRow = ({ children, ...props }) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const {key, currentRow, fetchTournaments, addSuccessAlert, addFailureAlert } = props;
  const [editedTitle, setEditedTitle] = React.useState(currentRow.title);
  const [editedDateStart, setEditedDateStart] = React.useState(currentRow.dateStart);
  const [editedDateEnd, setEditedDateEnd] = React.useState(currentRow.dateEnd);
  const [editedDescription, setEditedDescription] = React.useState(currentRow.description);
  const [editedDivisions, setEditedDivisions] = React.useState(currentRow.divisions);
  const [editedDetails, setEditedDetails] = React.useState(currentRow.details);
  const [editedImage, setEditedImage] = React.useState(currentRow.tourneyImg);
  const [editedRegister, setEditedRegister] = React.useState(currentRow.registerURL);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isConfirmDlgOpen, setConfirmDlgOpen] = React.useState(false);

  const dateFormat = date => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).replace(/\//g,'-');
  const dateParse = date => {
    return date;
/*    const split = date.split('-');
    if (split.length !== 3) {
      return new Date();
    }
    let month = split[0];
    let day = split[1];
    let year = split[2];
    return new Date(`${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
*/
  };

  async function updateTournamentInDatabase (url = '', data = {}) {
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

  async function removeTournamentInDatabase (url = '', data = {}) {
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

  const updateTournament = (id) => {
    console.log(editedTitle, editedDateStart, editedDateEnd, editedDescription, editedDivisions, editedDetails, editedImage, editedRegister);
    updateTournamentInDatabase('http://192.168.1.21:8081/tournaments/'+ id, { title: editedTitle, 
      dateStart: editedDateStart, dateEnd: editedDateEnd, description: editedDescription, divisions: editedDivisions, 
      details: editedDetails, tourneyImg: editedImage, registerURL: editedRegister 
    })      
    .then(data => {
      if (data.message === "Tournament updated successfully") {
        addSuccessAlert(editedTitle + " updated successfully");
        fetchTournaments();
      }
      else {
        addFailureAlert(editedTitle + " update unsuccessful");
        fetchTournaments();
        console.log("Error updating " + editedTitle);
      }
    });
  }

  const removeTournament = async (id) => {
      setIsEditMode(false);
      removeTournamentInDatabase('http://192.168.1.21:8081/tournaments/'+ id, {})
      .then(data => {
        if (data.message === "Tournament deleted successfully") {
          addSuccessAlert(editedTitle + " removed successfully");
          fetchTournaments();
        }
        else {
          addFailureAlert(editedTitle + " removal unsuccessful");
          fetchTournaments();
          console.log("Error removing " + editedTitle);
        }
      });
  }

  const handleYes = () => {
    removeTournament(currentRow.id);
    setConfirmDlgOpen(false);
  }

  const handleNo = () => {
    setConfirmDlgOpen(false);
  }

  return (
    <React.Fragment>
      <ConfirmDialog title={"Are you sure you want to delete " + editedTitle + "?"} isModalOpen={isConfirmDlgOpen} handleYes={handleYes} handleNo={handleNo}/>
      <Tr key={key}>
        <Td dataLabel={columnNames.title}>
          {isEditMode ? (
            <TextInput
              value={editedTitle}
              type="text"
              aria-label="edit-tournament-title"
              onChange={(value) => {
                setEditedTitle(value);
              } } />
          ) : (
            editedTitle
          )}
        </Td>
        <Td dataLabel={columnNames.start}>
          {isEditMode ? (
            <DatePicker
            value={editedDateStart}
            placeholder="MM-DD-YYYY"
            dateFormat={dateFormat}
            dateParse={dateParse}
            onChange={setEditedDateStart}
          />
          ) : (
            editedDateStart
          )}
        </Td>
        <Td dataLabel={columnNames.end}>
          {isEditMode ? (
            <DatePicker
            value={editedDateEnd}
            placeholder="MM-DD-YYYY"
            dateFormat={dateFormat}
            dateParse={dateParse}
            onChange={setEditedDateEnd}
          />
          ) : (
            editedDateEnd
          )}
        </Td>
        <Td dataLabel={columnNames.description}>
          {isEditMode ? (
            <TextInput
              value={editedDescription}
              type="text"
              aria-label="edit-tournament-description"
              onChange={(value) => {
                setEditedDescription(value);
              } } />
          ) : (
            editedDescription
          )}
        </Td>
        <Td dataLabel={columnNames.details}>
          {isEditMode ? (
            <TextInput
              value={editedDivisions}
              type="text"
              aria-label="edit-tournament-details"
              onChange={(value) => {
                setEditedDetails(value);
              } } />
          ) : (
            editedDetails
          )}
        </Td>
        <Td dataLabel={columnNames.divisions}>
          {isEditMode ? (
            <TextInput
              value={editedDivisions}
              type="text"
              aria-label="edit-tournament-divisions"
              onChange={(value) => {
                setEditedDivisions(value);
              } } />
          ) : (
            editedDivisions
          )}
        </Td>
        <Td dataLabel={columnNames.image}>
          {isEditMode ? (
            <TextInput
              value={editedImage}
              type="text"
              aria-label="edit-tournament-image"
              onChange={(value) => {
                setEditedImage(value);
              } } />
          ) : (
            editedImage
          )}
        </Td>
        <Td dataLabel={columnNames.register}>
          {isEditMode ? (
            <TextInput
              value={editedRegister}
              type="text"
              aria-label="edit-tournament-register"
              onChange={(value) => {
                setEditedRegister(value);
              } } />
          ) : (
            editedRegister
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
                  updateTournament(currentRow.id);
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

export default TournamentEditTableRow;
