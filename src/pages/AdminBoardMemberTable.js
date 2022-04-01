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
import AdminBoardMemberModal from './AdminBoardMemberModal';
import BoardMemberEditTableRow from './BoardMemberEditTableRow';

export const columnNames = {
  bmName: "Name",
  bmTitle: "Title",
  bmPhone: "Phone",
  bmEmail: "Email"
}

//class AdminBoardMemberTable extends React.Component {
const AdminBoardMemberTable = ({ children }) => {
  const [boardData, setBoardData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [boardMemberAdded, setBoardMemberAdded] = React.useState(false);
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
    fetchBoard();
    setBoardMemberAdded(false);
  }, []);

  useEffect(() => {
  // Fetch data for Board Members when new member added
    fetchBoard();
  }, [boardMemberAdded]);

  const fetchBoard = () => {
    fetch(`http://192.168.1.21:8081/board`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setBoardData(jsonResponse);
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
        <AdminBoardMemberModal setBoardMemberAdded={setBoardMemberAdded} addSuccessAlert={addSuccessAlert} addFailureAlert={addFailureAlert} />
        <Text component="br" />
        <Text component="br" />
        <Text component="hr" />
        <TableComposable variant={TableVariant.default}  aria-label="Board Members Table">
          <Thead>
         <Tr>
            <Th width={25}>{columnNames.bmName}</Th>
            <Th width={25}>{columnNames.bmTitle}</Th>
            <Th width={25}>{columnNames.bmPhone}</Th>
            <Th width={25}>{columnNames.bmEmail}</Th>
         </Tr>
         </Thead>
          <Tbody>
            {!loading && boardData?.data.length === 0 && (
              <Tr key="0">
                <Td colSpan={4}>
                  <Bullseye>
                    <EmptyState variant={EmptyStateVariant.small}>
                      <EmptyStateIcon icon={SearchIcon} />
                      <Title headingLevel="h2" size="lg">
                        No Board Member information retrieved!
                      </Title>
                      <EmptyStateBody>
                        Check your network connection or contact the system administrator.
                      </EmptyStateBody>
                    </EmptyState>
                  </Bullseye>
                </Td>
              </Tr>
            )}
            {!loading && boardData?.data.map(row => (
              <BoardMemberEditTableRow
                key={row.id}
                currentRow={row}
                fetchBoard={fetchBoard}
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

export default AdminBoardMemberTable;

