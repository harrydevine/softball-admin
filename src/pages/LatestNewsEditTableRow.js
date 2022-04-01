import * as React from 'react';
import { 
  Button, 
  TextArea,
  TextInput
} from '@patternfly/react-core';
import { Tr, Td } from '@patternfly/react-table';
import { columnNames } from './AdminLatestNewsTable';
import ConfirmDialog from './ConfirmDialog';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import Remove2Icon from '@patternfly/react-icons/dist/esm/icons/remove2-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';

const LatestNewsEditTableRow = ({ children, ...props }) => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const {key, currentRow, fetchNews, addSuccessAlert, addFailureAlert } = props;
  const [editedTitle, setEditedTitle] = React.useState(currentRow.title);
  const [editedBody, setEditedBody] = React.useState(currentRow.body);
  const [editedImage, setEditedImage] = React.useState(currentRow.image);
  const [isConfirmDlgOpen, setConfirmDlgOpen] = React.useState(false);

  async function updateNewsInDatabase (url = '', data = {}) {
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

  async function removeNewsInDatabase (url = '', data = {}) {
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

  const updateNewsInfo = (id) => {
    updateNewsInDatabase('http://192.168.1.21:8081/news/'+ id, { title: editedTitle, body: editedBody, image: editedImage })      
    .then(data => {
      if (data.message === "Latest News info updated successfully") {
        addSuccessAlert("News item updated successfully");
        fetchNews();
      }
      else {
        addFailureAlert("News Item update unsuccessful");
        fetchNews();
        console.log("Error updating Latest News info!")
      }
  });
  }

  const removeNewsInfo = async (id) => {
      setIsEditMode(false);
      removeNewsInDatabase('http://192.168.1.21:8081/news/'+ id, {})
      .then(data => {
        if (data.message === "Latest News deleted successfully") {
          addSuccessAlert("News item deleted successfully");
          fetchNews();
        }
        else {
          addFailureAlert("News item removal unsuccessful");
          fetchNews();
          console.log("Error removing Latest News item!")
        }
      });
  }

  const handleYes = () => {
    removeNewsInfo(currentRow.id);
    setConfirmDlgOpen(false);
  }

  const handleNo = () => {
    setConfirmDlgOpen(false);
  }

  return (
    <React.Fragment>
      <ConfirmDialog title={"Are you sure you want to delete this news item?"} isModalOpen={isConfirmDlgOpen} handleYes={handleYes} handleNo={handleNo}/>
      <Tr key={key}>
        <Td dataLabel={columnNames.newsTitle}>
          {isEditMode ? (
          <TextInput
            value={editedTitle}
            type="text"
            aria-label="news-title"
            onChange={(value) => {
              setEditedTitle(value);
            }} />
        ) : (
            editedTitle
          )}
        </Td>
        <Td dataLabel={columnNames.newsBody}>
          {isEditMode ? (
            <TextArea
            value={editedBody}
            type="text"
            aria-label="news-body"
            onChange={(value) => {
              setEditedBody(value);
            }} />
        ) : (
            editedBody
          )}
        </Td>
        <Td dataLabel={columnNames.newsImage}>
          {isEditMode ? (
          <TextInput
            value={editedImage}
            type="text"
            aria-label="news-image"
            onChange={(value) => {
              setEditedImage(value);
            }} />
        ) : (
            editedImage
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
                  updateNewsInfo(currentRow.id);
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

export default LatestNewsEditTableRow;
