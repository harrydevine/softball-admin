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
import { columnNames } from './AdminBoardMemberTable';
import ConfirmDialog from './ConfirmDialog';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import Remove2Icon from '@patternfly/react-icons/dist/esm/icons/remove2-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

const BoardMemberEditTableRow = ({ children, ...props }) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const {key, currentRow, fetchBoard, addSuccessAlert, addFailureAlert } = props;
  const [editedName, setEditedName] = React.useState(currentRow.name);
  const [editedTitle, setEditedTitle] = React.useState(currentRow.title);
  const [editedPhone, setEditedPhone] = React.useState(currentRow.phone);
  const [editedEmail, setEditedEmail] = React.useState(currentRow.email);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isConfirmDlgOpen, setConfirmDlgOpen] = React.useState(false);

  const positionDropdownItems = [
    <SelectOption key={0} value="Select a Position" label="Select a Position" isPlaceholder />,
    <SelectOption key={1} value="President" label="President" />,
    <SelectOption key={2} value="Vice-President" label="Vice-President" />,
    <SelectOption key={3} value="Treasurer" label="Treasurer" />,
    <SelectOption key={4} value="Secretary" label="Secretary" />,
    <SelectOption key={5} value="Equipment Maintenance" label="Equipment Maintenance"/>,
    <SelectOption key={6} value="Field Maintenance" label="Field Maintenance" />,
    <SelectOption key={7} value="Field Coordinator" label="Field Coordinator" />,
    <SelectOption key={8} value="Stand Coordinator" label="Stand Coordinator" />,
    <SelectOption key={9} value="Stand Scheduler" label="Stand Scheduler" />,
    <SelectOption key={10} value="Website Coordinator" label="Website Coordinator" />
  ];

  async function updateBoardInfoInDatabase (url = '', data = {}) {
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

  async function removeBoardInfoInDatabase (url = '', data = {}) {
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

  const updateBoardInfo = (id) => {
    updateBoardInfoInDatabase('http://192.168.1.21:8081/board/'+ id, { name: editedName, title: editedTitle, phone: editedPhone, email: editedEmail })      
    .then(data => {
      if (data.message === "Board Member info updated successfully") {
        addSuccessAlert("Board Member info updated successfully");
        fetchBoard();
      }
      else {
        addFailureAlert("Board Member update unsuccessful");
        fetchBoard();
        console.log("Error updating Board Member info!")
      }
  });
  }

  const removeBoardInfo = async (id) => {
      setIsEditMode(false);
      removeBoardInfoInDatabase('http://192.168.1.21:8081/board/'+ id, {})
      .then(data => {
        if (data.message === "Board Member deleted successfully") {
          addSuccessAlert("Board Member deleted successfully");
          fetchBoard();
        }
        else {
          addFailureAlert("Board Member removal unsuccessful");
          fetchBoard();
          console.log("Error removing Board Member!")
        }
      });
  }

  const onToggle = isOpen => {
    setIsOpen( isOpen );
  };
  
  const onSelect = (event, selection, isPlaceholder) => {
    if (isPlaceholder) {
        setEditedTitle("");
        setIsOpen(false);
      }
    else {
      setEditedTitle(selection);
      setIsOpen(false);
      }
  };

  const handleYes = () => {
    removeBoardInfo(currentRow.id);
    setConfirmDlgOpen(false);
  }

  const handleNo = () => {
    setConfirmDlgOpen(false);
  }

  return (
    <React.Fragment>
      <ConfirmDialog title={"Are you sure you want to delete " + editedName + "?"} isModalOpen={isConfirmDlgOpen} handleYes={handleYes} handleNo={handleNo}/>
      <Tr key={key}>
        <Td dataLabel={columnNames.bmName}>
          {isEditMode ? (
            <TextInput
              value={editedName}
              type="text"
              aria-label="bm-name"
              onChange={(value) => {
                setEditedName(value);
              } } />
          ) : (
            editedName
          )}
        </Td>
        <Td dataLabel={columnNames.bmTitle}>
          {isEditMode ? (
            <Select
              variant={SelectVariant.single}
              aria-label="Select Position"
              onToggle={onToggle}
              onSelect={onSelect}
              onChange={(value) => {
                setEditedTitle(value);
              }}
              selections={editedTitle}
              isOpen={isOpen}
              aria-labelledby="edit-bm-position"
              direction={SelectDirection.down}
              menuAppendTo={() => document.body}
            >
              { positionDropdownItems }
          </Select>
        ) : (
            editedTitle
          )}
        </Td>
        <Td dataLabel={columnNames.bmPhone}>
          {isEditMode ? (
            <TextInput
              value={editedPhone}
              type="text"
              aria-label="edit-bm-phone"
              onChange={(value) => {
                setEditedPhone(value);
              } } />
          ) : (
            editedPhone
          )}
        </Td>
        <Td dataLabel={columnNames.bmEmail}>
          {isEditMode ? (
            <TextInput
              value={editedEmail}
              type="text"
              aria-label="edit-bm-email"
              onChange={(value) => {
                setEditedEmail(value);
              } } />
          ) : (
            editedEmail
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
                  updateBoardInfo(currentRow.id);
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

export default BoardMemberEditTableRow;
