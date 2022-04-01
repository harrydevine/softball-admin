import * as React from 'react';
import { 
  Button, 
  TextInput, 
  Switch
} from '@patternfly/react-core';
import { Tr, Td } from '@patternfly/react-table';
import { columnNames } from './AdminFieldsTable';
import ConfirmDialog from './ConfirmDialog';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import Remove2Icon from '@patternfly/react-icons/dist/esm/icons/remove2-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

const FieldsEditTableRow = ({ children, ...props }) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const {key, currentField, fetchFieldInfo, addSuccessAlert, addFailureAlert } = props;
  const [editedFieldNum, setEditedFieldNum] = React.useState(currentField.fieldNum);
  const [editedFieldStatus, setEditedFieldStatus] = React.useState(currentField.fieldStatus);
  const [editedFieldReason, setEditedFieldReason] = React.useState(currentField.fieldReason);
  const [isConfirmDlgOpen, setConfirmDlgOpen] = React.useState(false);

    async function updateFieldInfoInDatabase (url = '', data = {}) {
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

  async function removeFieldInfoInDatabase (url = '', data = {}) {
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

  const updateFieldInfo = (id) => {
    updateFieldInfoInDatabase('http://192.168.1.21:8081/fields/'+ id, { fieldNum: editedFieldNum, fieldStatus: editedFieldStatus ? 1 : 0, fieldReason: editedFieldReason })      
    .then(data => {
      if (data.message === "Field Info updated successfully") {
        addSuccessAlert("Field " + editedFieldNum + " updated successfully");
        fetchFieldInfo();
      }
      else {
        addFailureAlert("Field update unsuccessful");
        fetchFieldInfo();
        console.log("Error updating field info!")
      }
  });
  }

  const removeFieldInfo = async (id) => {
      setIsEditMode(false);
      removeFieldInfoInDatabase('http://192.168.1.21:8081/fields/'+ id, {})
      .then(data => {
        if (data.message === "Field Info deleted successfully") {
          addSuccessAlert("Field " + editedFieldNum + " deleted successfully");
          fetchFieldInfo();
        }
        else {
          addFailureAlert("Field removal unsuccessful");
          fetchFieldInfo();
          console.log("Error removing field!")
        }
      });
  }

  const handleYes = () => {
    removeFieldInfo(currentField.id);
    setConfirmDlgOpen(false);
  }

  const handleNo = () => {
    setConfirmDlgOpen(false);
  }

  return (
    <React.Fragment>
      <ConfirmDialog title={"Are you sure you want to delete this field?"} isModalOpen={isConfirmDlgOpen} handleYes={handleYes} handleNo={handleNo}/>
      <Tr key={key}>
        <Td dataLabel={columnNames.fieldNum}>
          {isEditMode ? (
            <TextInput
              value={editedFieldNum}
              type="text"
              aria-label="field-number"
              onChange={(value) => {
                setEditedFieldNum(value);
              } } />
          ) : (
            editedFieldNum
          )}
        </Td>
        <Td dataLabel={columnNames.fieldStatus}>
          {isEditMode ? (
            <Switch
              id={`switch-${currentField.id}`}
              label="Open"
              labelOff="Closed"
              isChecked={editedFieldStatus}
              onChange={(isChecked) => {
                setEditedFieldStatus(isChecked);
              } } />
          ) : (
            editedFieldStatus ? "Open" : "Closed"
          )}
        </Td>
        <Td dataLabel={columnNames.fieldReason}>
          {isEditMode ? (
            <TextInput
              value={editedFieldReason}
              type="text"
              aria-label="field-reason"
              onChange={(value) => {
                setEditedFieldReason(value);
              } } />
          ) : (
            editedFieldReason
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
                  console.log(currentField.id, editedFieldNum ? 1 : 0, editedFieldStatus, editedFieldReason);
                  updateFieldInfo(currentField.id);
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

export default FieldsEditTableRow;
