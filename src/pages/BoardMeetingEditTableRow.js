import * as React from 'react';
import { 
  Button, 
  DatePicker,
  TimePicker
} from '@patternfly/react-core';
import { Tr, Td } from '@patternfly/react-table';
import { columnNames } from './AdminBoardMeetingTable';
import ConfirmDialog from './ConfirmDialog';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import Remove2Icon from '@patternfly/react-icons/dist/esm/icons/remove2-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

const BoardMeetingEditTableRow = ({ children, ...props }) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const {key, currentRow, fetchMeetings, addSuccessAlert, addFailureAlert } = props;
  const [editedDate, setEditedDate] = React.useState(currentRow.date);
  const [editedTime, setEditedTime] = React.useState(currentRow.time);
  const [isConfirmDlgOpen, setConfirmDlgOpen] = React.useState(false);

  async function updateMeetingInfoInDatabase (url = '', data = {}) {
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

  async function removeMeetingInfoInDatabase (url = '', data = {}) {
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

  const updateMeetingInfo = (id) => {
    updateMeetingInfoInDatabase('http://192.168.1.21:8081/boardmtg/'+ id, { date: editedDate, time: editedTime })      
    .then(data => {
      if (data.message === "Board Meeting info updated successfully") {
        addSuccessAlert("Board Meeting info updated successfully");
        fetchMeetings();
      }
      else {
        addFailureAlert("Board Meeting update unsuccessful");
        fetchMeetings();
        console.log("Error updating Board Meeting info!")
      }
  });
  }

  const removeMeetingInfo = async (id) => {
      setIsEditMode(false);
      removeMeetingInfoInDatabase('http://192.168.1.21:8081/boardmtg/'+ id, {})
      .then(data => {
        if (data.message === "Board Meeting deleted successfully") {
          addSuccessAlert("Board Meeting deleted successfully");
          fetchMeetings();
        }
        else {
          addFailureAlert("Board Meeting removal unsuccessful");
          fetchMeetings();
          console.log("Error removing Board Meeting!")
        }
      });
  }

  const handleYes = () => {
    removeMeetingInfo(currentRow.id);
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

  const onTimeChange = (time, hour, minute, seconds, isValid) => {
    setEditedTime( time );
  }

  return (
    <React.Fragment>
      <ConfirmDialog title={"Are you sure you want to delete the meeting for " + editedDate + "?"} isModalOpen={isConfirmDlgOpen} handleYes={handleYes} handleNo={handleNo}/>
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
            <TimePicker
              time={editedTime}
              placeholder="hh:mm"
              onChange={onTimeChange}
              menuAppendTo={() => document.body}
            />
          ) : (
            editedTime
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
                  updateMeetingInfo(currentRow.id);
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

export default BoardMeetingEditTableRow;
