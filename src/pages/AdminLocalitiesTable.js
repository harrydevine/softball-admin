import React, {useEffect } from 'react';
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
import AdminLocalitiesModal from './AdminLocalitiesModal';
import LocalityEditTableRow from './LocalityEditTableRow';

export const columnNames = {
  name: "Name",
  street: "Street",
  city: "City",
  usstate: "State",
  zip: "Zip Code",
  lat: "Latitude",
  lng: "Longitude",
  description: "Description"
}

const AdminLocalitiesTable = ({ children }) => {
  const [localityData, setLocalityData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [localityAdded, setLocalityAdded] = React.useState(false);
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
    // Fetch data for Localities
      fetchLocalities();
      setLocalityAdded(false);
    }, []);
  
  useEffect(() => {
  // Fetch data for Localities when new town added
    fetchLocalities();
  }, [localityAdded]);
  
  // Fetch data for Localities
  const fetchLocalities = () => {
    fetch(`http://192.168.1.21:8081/localities`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setLocalityData(jsonResponse);
      setLoading(false);
    })
    .catch(err => {
      setErr(err);
      setLoading(false);
    })
  }

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
      <AdminLocalitiesModal setLocalityAdded={setLocalityAdded} addSuccessAlert={addSuccessAlert} addFailureAlert={addFailureAlert} />
      <Text component="br" />
      <Text component="br" />
      <Text component="hr" />
      <TableComposable variant={TableVariant.default}  aria-label="Localities Table">
      <Thead>
        <Tr>
          <Th width={10}>{columnNames.name}</Th>
          <Th width={10}>{columnNames.street}</Th>
          <Th width={10}>{columnNames.city}</Th>
          <Th width={5}>{columnNames.usstate}</Th>
          <Th width={10}>{columnNames.zip}</Th>
          <Th width={15}>{columnNames.lat}</Th>
          <Th width={15}>{columnNames.lng}</Th>
          <Th width={25}>{columnNames.description}</Th>
        </Tr>
       </Thead>
          <Tbody>
          {!loading && localityData?.data.length === 0 && (
            <Tr key="0">
              <Td colSpan={4}>
                <Bullseye>
                  <EmptyState variant={EmptyStateVariant.small}>
                    <EmptyStateIcon icon={SearchIcon} />
                    <Title headingLevel="h2" size="lg">
                      No Localities retrieved!
                    </Title>
                    <EmptyStateBody>
                      Check your network connection or contact the system administrator.
                    </EmptyStateBody>
                  </EmptyState>
                </Bullseye>
              </Td>
            </Tr>
          )}
          {!loading && localityData?.data.map(row => (
            <LocalityEditTableRow
              key={row.id}
              currentRow={row}
              fetchLocalities={fetchLocalities}
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

export default AdminLocalitiesTable;

