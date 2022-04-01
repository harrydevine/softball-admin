import * as React from 'react';
import { 
  Button, 
  DatePicker,
  TextInput
} from '@patternfly/react-core';
import { Tr, Td } from '@patternfly/react-table';
import { columnNames } from './AdminBoardMinutesTable';
import ConfirmDialog from './ConfirmDialog';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import Remove2Icon from '@patternfly/react-icons/dist/esm/icons/remove2-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

const BoardMinutesEditTableRow = ({ children, ...props }) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const {key, currentRow, fetchMinutes, addSuccessAlert, addFailureAlert } = props;
  const [editedDate, setEditedDate] = React.useState(currentRow.date);
  const [editedMinutes, setEditedMinutes] = React.useState(currentRow.minutes);
  const [isConfirmDlgOpen, setConfirmDlgOpen] = React.useState(false);

  async function updateMinutesInfoInDatabase (url = '', data = {}) {
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

  async function removeMinutesInfoInDatabase (url = '', data = {}) {
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

  const updateMinutesInfo = (id) => {
    updateMinutesInfoInDatabase('http://192.168.1.21:8081/minutes/'+ id, { date: editedDate, minutes: editedMinutes })      
    .then(data => {
      if (data.message === "Board Minutes info updated successfully") {
        addSuccessAlert("Board Minutes info updated successfully");
        fetchMinutes();
      }
      else {
        addFailureAlert("Board Minutes update unsuccessful");
        fetchMinutes();
        console.log("Error updating Board Minutes info!")
      }
  });
  }

  const removeMinutesInfo = async (id) => {
      setIsEditMode(false);
      removeMinutesInfoInDatabase('http://192.168.1.21:8081/minutes/'+ id, {})
      .then(data => {
        if (data.message === "Board Minutes deleted successfully") {
          addSuccessAlert("Board Minutes for " + editedDate + " deleted successfully");
          fetchMinutes();
        }
        else {
          addFailureAlert("Board Minutes removal for " + editedDate + " unsuccessful");
          fetchMinutes();
          console.log("Error removing Board Minutes!")
        }
      });
  }

  const handleYes = () => {
    removeMinutesInfo(currentRow.id);
    setConfirmDlgOpen(false);
  }

  const handleNo = () => {
    setConfirmDlgOpen(false);
  }

  const dateFormat = date => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).replace(/\//g,'-');
  const dateParse = date => {
    return date;
  };

  const onDateChange = (str, date) => {
    console.log('str', str, 'date', date);
    setEditedDate( str );
  }

  const onMinutesChange = (value) => {
    setEditedMinutes( value );
  }

  return (
    <React.Fragment>
      <ConfirmDialog title={"Are you sure you want to meeting minutes for " + editedDate + "?"} isModalOpen={isConfirmDlgOpen} handleYes={handleYes} handleNo={handleNo}/>
      <Tr key={key}>
        <Td dataLabel={columnNames.bmDate}>
          {isEditMode ? (
            <DatePicker
              value={editedDate}
              placeholder="MM-DD-YYYY"
              dateFormat={dateFormat}
              dateParse={dateParse}
              onChange={onDateChange}
          />
        ) : (
            editedDate
          )}
        </Td>
        <Td dataLabel={columnNames.bmTime}>
          {isEditMode ? (
            <TextInput
            value={editedMinutes}
            type="text"
            aria-label="mtg-minutes"
            onChange={(value) => {
              setEditedMinutes(value);
            }} />
        ) : (
            editedMinutes
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
                  updateMinutesInfo(currentRow.id);
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

export default BoardMinutesEditTableRow;
