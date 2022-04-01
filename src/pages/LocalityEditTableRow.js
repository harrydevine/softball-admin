import * as React from 'react';
import { 
  Button, 
  TextInput
} from '@patternfly/react-core';
import { Tr, Td } from '@patternfly/react-table';
import { columnNames } from './AdminLocalitiesTable';
import ConfirmDialog from './ConfirmDialog';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import Remove2Icon from '@patternfly/react-icons/dist/esm/icons/remove2-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

const LocalityEditTableRow = ({ children, ...props }) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const {key, currentRow, fetchLocalities, addSuccessAlert, addFailureAlert } = props;
  const [editedName, setEditedName] = React.useState(currentRow.name);
  const [editedStreet, setEditedStreet] = React.useState(currentRow.street);
  const [editedCity, setEditedCity] = React.useState(currentRow.city);
  const [editedUSState, setEditedUSState] = React.useState(currentRow.state);
  const [editedZip, setEditedZip] = React.useState(currentRow.zip);
  const [editedLat, setEditedLat] = React.useState(currentRow.lat);
  const [editedLng, setEditedLng] = React.useState(currentRow.lng);
  const [editedDescription, setEditedDescription] = React.useState(currentRow.description);
  const [isConfirmDlgOpen, setConfirmDlgOpen] = React.useState(false);

  async function updateLocalityInDatabase (url = '', data = {}) {
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

  async function removeLocalityInDatabase (url = '', data = {}) {
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

  const updateLocalityInfo = (id) => {
    updateLocalityInDatabase('http://192.168.1.21:8081/localities/'+ id, { name: editedName, 
      street: editedStreet, city: editedCity, state: editedUSState, zip: editedZip, lat: editedLat,
      lng: editedLng, description: editedDescription})      
    .then(data => {
      if (data.message === "Locality info updated successfully") {
        addSuccessAlert(editedName + " updated successfully");
        fetchLocalities();
      }
      else {
        addFailureAlert(editedName + " update unsuccessful");
        fetchLocalities();
        console.log("Error updating " + editedName)
      }
    });
  }

  const removeLocalityInfo = async (id) => {
      setIsEditMode(false);
      removeLocalityInDatabase('http://192.168.1.21:8081/localities/'+ id, {})
      .then(data => {
        if (data.message === "Locality deleted successfully") {
          addSuccessAlert(editedName + " deleted successfully");
          fetchLocalities();
        }
        else {
          addFailureAlert(editedName + " removal unsuccessful");
          fetchLocalities();
          console.log("Error removing " + editedName)
        }
      });
  }

  const handleYes = () => {
    removeLocalityInfo(currentRow.id);
    setConfirmDlgOpen(false);
  }

  const handleNo = () => {
    setConfirmDlgOpen(false);
  }

  return (
    <React.Fragment>
      <ConfirmDialog title={"Are you sure you want to delete " + editedName + "?"} isModalOpen={isConfirmDlgOpen} handleYes={handleYes} handleNo={handleNo}/>
      <Tr key={key}>
      <Td dataLabel={columnNames.name}>
      {isEditMode ? (
        <TextInput
          value={editedName}
          type="text"
          aria-label="locality-name"
          onChange={(value) => {
            setEditedName(value);
          } } />
      ) : (
        editedName
      )}
      </Td>
      <Td dataLabel={columnNames.street}>
      {isEditMode ? (
        <TextInput
          value={editedStreet}
          type="text"
          aria-label="locality-street"
          onChange={(value) => {
            setEditedStreet(value);
          } } />
      ) : (
        editedStreet
      )}
      </Td>
      <Td dataLabel={columnNames.city}>
      {isEditMode ? (
        <TextInput
          value={editedCity}
          type="text"
          aria-label="locality-city"
          onChange={(value) => {
            setEditedCity(value);
          } } />
        ) : (
         editedCity
        )}
      </Td>
      <Td dataLabel={columnNames.usstate}>
      {isEditMode ? (
        <TextInput
          value={editedUSState}
          type="text"
          aria-label="locality-state"
          onChange={(value) => {
            setEditedUSState(value);
          } } />
        ) : (
         editedUSState
        )}
      </Td>
      <Td dataLabel={columnNames.zip}>
      {isEditMode ? (
        <TextInput
          value={editedZip}
          type="text"
          aria-label="locality-zip"
          onChange={(value) => {
            setEditedZip(value);
          } } />
        ) : (
         editedZip
        )}
      </Td>
      <Td dataLabel={columnNames.lat}>
      {isEditMode ? (
        <TextInput
          value={editedLat}
          type="text"
          aria-label="locality-lat"
          onChange={(value) => {
            setEditedLat(value);
          } } />
        ) : (
         editedLat
        )}
      </Td>
      <Td dataLabel={columnNames.lng}>
      {isEditMode ? (
        <TextInput
          value={editedLng}
          type="text"
          aria-label="locality-lng"
          onChange={(value) => {
            setEditedLng(value);
          } } />
        ) : (
         editedLng
        )}
      </Td>
      <Td dataLabel={columnNames.description}>
      {isEditMode ? (
        <TextInput
          value={editedDescription}
          type="text"
          aria-label="locality-description"
          onChange={(value) => {
            setEditedDescription(value);
          } } />
        ) : (
         editedDescription
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
                  updateLocalityInfo(currentRow.id);
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

export default LocalityEditTableRow;
