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
import AdminTournamentsModal from './AdminTournamentsModal';
import TournamentEditTableRow from './TournamentEditTableRow';

export const columnNames = {
  title: 'Title',
  start: 'Start Date',
  end: 'End Date',
  description: 'Description',
  details: 'Details',
  divisions: 'Divisions',
  image: 'Tournament Image',
  registration: 'Registration URL'
};

const AdminTournamentsTable = ({ children }) => {
  const [tournamentData, setTournamentData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [tournamentAdded, setTournamentAdded] = React.useState(false);
  const [alerts, setAlerts] = React.useState([]);

  useEffect(() => {
    // Fetch data for Players
      fetchTournaments();
      setTournamentAdded(false);
    }, []);
  
  useEffect(() => {
  // Fetch data for Players when new player added
    fetchTournaments();
  }, [tournamentAdded]);

  const fetchTournaments = () => {
    // Fetch Tournament data
    fetch(`http://192.168.1.21:8081/tournaments`)
      .then(async resp => {
        const jsonResponse = await resp.json()
        setTournamentData(jsonResponse);
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
        <AdminTournamentsModal setTournamentAdded={setTournamentAdded} addSuccessAlert={addSuccessAlert} addFailureAlert={addFailureAlert} />
        <Text component="br" />
        <Text component="br" />
        <Text component="hr" />
        <TableComposable variant={TableVariant.default}  aria-label="Tournaments Table">
          <Thead>
         <Tr key="touraments_header">
           <Th width={10}>{columnNames.title}</Th>
           <Th width={10}>{columnNames.start}</Th>
           <Th width={10}>{columnNames.end}</Th>
           <Th width={20}>{columnNames.description}</Th>
           <Th width={20}>{columnNames.details}</Th>
           <Th width={10}>{columnNames.divisions}</Th>
           <Th width={10}>{columnNames.image}</Th>
           <Th width={10}>{columnNames.registration}</Th>
          </Tr>
         </Thead>
          <Tbody>
            {!loading && tournamentData?.data.length === 0 && (
              <Tr key="tournamentEmptyState">
                <Td colSpan={4}>
                  <Bullseye>
                    <EmptyState variant={EmptyStateVariant.small}>
                      <EmptyStateIcon icon={SearchIcon} />
                      <Title headingLevel="h2" size="lg">
                        No Tournment information retrieved!
                      </Title>
                      <EmptyStateBody>
                        Check your network connection or contact the system administrator.
                      </EmptyStateBody>
                    </EmptyState>
                  </Bullseye>
                </Td>
              </Tr>
            )}
            {!loading && tournamentData?.data.map((row, index) => (
              <TournamentEditTableRow
                key={row.id}
                currentRow={row}
                fetchTournaments={fetchTournaments}
                addSuccessAlert={addSuccessAlert} 
                addFailureAlert={addFailureAlert}
              />
            ))}
           {loading && (
              <Tr key="tournament_loading">
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

export default AdminTournamentsTable;

