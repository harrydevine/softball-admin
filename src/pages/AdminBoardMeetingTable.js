import React, { useEffect } from 'react';
import {
  Alert, 
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Bullseye,
  EmptyState,
  EmptyStateVariant,
  EmptyStateBody,
  EmptyStateIcon,
  Spinner,
  Text,
  Title
} from '@patternfly/react-core';
import { Thead, TableComposable, TableVariant, Tr, Th, Tbody, Td} from '@patternfly/react-table';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import AdminBoardMeetingModal from './AdminBoardMeetingModal';
import BoardMeetingEditTableRow from './BoardMeetingEditTableRow';

export const columnNames = {
  bmDate: "Date",
  bmTime: "Time"
}

const AdminBoardMeetingTable = ({ children }) => {
  const [mtgData, setMtgData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [boardMeetingAdded, setMeetingAdded] = React.useState(false);
  const [alerts, setAlerts] = React.useState([]);

  const addAlert = (title, variant, key) => {
    setAlerts([ ...alerts, {title: title, variant: variant, key }]);
  };

  const removeAlert = key => {
    setAlerts([...alerts.filter(el => el.key !== key)]);
  };

  const getUniqueId = () => (new Date().getTime());

  const addSuccessAlert = ( string ) => { 
    addAlert(string, 'success', getUniqueId());
  };
      
  const addFailureAlert = ( string ) => { 
    addAlert(string, 'danger', getUniqueId()) 
  };
  
  useEffect(() => {
    // Fetch data for Board Members
      fetchMeetings();
      setMeetingAdded(false);
    }, []);
  
  useEffect(() => {
  // Fetch data for Board Meeting when new meeting added
    fetchMeetings();
  }, [boardMeetingAdded]);
  
  const fetchMeetings = () => {
    fetch(`http://192.168.1.21:8081/boardmtg`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setMtgData(jsonResponse);
      setLoading(false);
    })
    .catch(err => {
      setErr(err);
      setLoading(false);
    })
  }

  return (
    <div>
      <React.Fragment>
        <AlertGroup isToast isLiveRegion>
          {alerts.map(({ key, variant, title }) => (
            <Alert
             variant={AlertVariant[variant]}
              title={title}
              timeout={5000}
              actionClose={<AlertActionCloseButton
                title={title}
                variantLabel={`variant} alert`}
                onClose={() => removeAlert(key)} />}
              key={key} />
          ))}
        </AlertGroup>
        <AdminBoardMeetingModal setMeetingAdded={setMeetingAdded} addSuccessAlert={addSuccessAlert} addFailureAlert={addFailureAlert} />
        <Text component="br" />
        <Text component="br" />
        <Text component="hr" />
        <TableComposable variant={TableVariant.default}  aria-label="Board Meetings Table">
          <Thead>
	        <Tr>
	          <Th width={50}>{columnNames.bmDate}</Th>
	          <Th width={50}>{columnNames.bmTime}</Th>
	        </Tr>
	        </Thead>
          <Tbody>
            {!loading && mtgData?.data.length === 0 && (
              <Tr key="0">
                <Td colSpan={4}>
                  <Bullseye>
                    <EmptyState variant={EmptyStateVariant.small}>
                      <EmptyStateIcon icon={SearchIcon} />
                      <Title headingLevel="h2" size="lg">
                        No Board Meeting information retrieved!
                      </Title>
                      <EmptyStateBody>
                        Check your network connection or contact the system administrator.
                      </EmptyStateBody>
                    </EmptyState>
                  </Bullseye>
                </Td>
              </Tr>
            )}
          {!loading && mtgData?.data.map(row => (
            <BoardMeetingEditTableRow
              key={row.id}
              currentRow={row}
              fetchMeetings={fetchMeetings}
              addSuccessAlert={addSuccessAlert} 
              addFailureAlert={addFailureAlert}
             />
          ))}
	        {loading && (
            <Tr>
              <Td colSpan={4}>
                <Bullseye>
	                <Spinner size="xl" />
		            </Bullseye>
		          </Td>
            </Tr>
          )}
	      </Tbody>
      </TableComposable>
    </React.Fragment>
  </div>
  );
}

export default AdminBoardMeetingTable;

