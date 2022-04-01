import React, { useEffect } from 'react';
import {
  Alert, 
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateVariant,
  Spinner,
  Text,
  Title
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { Thead, TableComposable, TableVariant, Tr, Th, Tbody, Td, Caption} from '@patternfly/react-table';
import AdminPlayerModal from './AdminPlayerModal';
import PlayerEditTableRow from './PlayerEditTableRow';

export const columnNames = {
  playerName: 'Name',
  playerNumber: 'Jersey Number',
  division: 'Division'
};

const AdminPlayersTable = ({ children }) => {
  const [playerData, setPlayerData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [activeSortIndex, setActiveSortIndex] = React.useState(0);
  const [activeSortDirection, setActiveSortDirection] = React.useState('asc');
  const getSortableRowValues = players => {
    const {playerName, playerNumber, division} = players;
    return [playerName, playerNumber, division];
  };
  const [playerAdded, setPlayerAdded] = React.useState(false);
  const [alerts, setAlerts] = React.useState([]);

  if (playerData?.data.length > 0) {
    let sortedPlayers = playerData?.data;
    if (sortedPlayers !== null) {
      sortedPlayers = playerData?.data.sort((a, b) => {
        const aValue = getSortableRowValues(a)[activeSortIndex];
        const bValue = getSortableRowValues(b)[activeSortIndex];
        if ((aValue === null) || (bValue === null)) {
          return 0;
        }
        if (typeof aValue === 'number') {
          if (activeSortDirection === 'asc') {
            return aValue - bValue;
          }
          return bValue - aValue;
        } else {
          if (activeSortDirection === 'asc') {
            return aValue.localeCompare(bValue);
          }
          return bValue.localeCompare(aValue);
        }
      });
    }
  }

  const getSortParams = columnIndex => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });

  useEffect(() => {
    // Fetch data for Players
      fetchPlayers();
      setPlayerAdded(false);
    }, []);
  
  useEffect(() => {
  // Fetch data for Players when new player added
    fetchPlayers();
  }, [playerAdded]);
  
  const fetchPlayers = () => {
  // Fetch data for Players
    fetch(`http://192.168.1.21:8081/players`)
      .then(async resp => {
        const jsonResponse = await resp.json()
        setPlayerData(jsonResponse);
        setLoading(false);
      })
      .catch(err => {
        setErr(err);
        setLoading(false);
      })
  }

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

  return (
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
      <AdminPlayerModal setPlayerAdded={setPlayerAdded} addSuccessAlert={addSuccessAlert} addFailureAlert={addFailureAlert} />
      <Text component="br" />
      <Text component="br" />
      <Text component="hr" />
      <TableComposable variant={TableVariant.default}  aria-label="Players Table">
        <Caption>EHT Softball - Players</Caption>
        <Thead>
       <Tr>
          <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
          <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
          <Th sort={getSortParams(2)}>{columnNames.division}</Th>
       </Tr>
       </Thead>
        <Tbody>
          {!loading && playerData?.data.length === 0 && (
            <Tr key="0">
              <Td colSpan={4}>
                <Bullseye>
                  <EmptyState variant={EmptyStateVariant.small}>
                    <EmptyStateIcon icon={SearchIcon} />
                    <Title headingLevel="h2" size="lg">
                      No Player information retrieved!
                    </Title>
                    <EmptyStateBody>
                      Check your network connection or contact the system administrator.
                    </EmptyStateBody>
                  </EmptyState>
                </Bullseye>
              </Td>
            </Tr>
          )}
          {!loading && playerData?.data.map((row, rowIndex) => (
            <PlayerEditTableRow
              key={row.id}
              currentRow={row}
              fetchPlayers={fetchPlayers}
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
  );
}

export default AdminPlayersTable;

