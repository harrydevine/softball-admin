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
import AdminFieldsModal from './AdminFieldsModal';
import AdminFieldsMasterStatusModal from './AdminFieldsMasterStatusModal';
import FieldsEditTableRow from './FieldsEditTableRow';
import { Thead, TableComposable, TableVariant, Tr, Th, Tbody, Td} from '@patternfly/react-table';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';

export const columnNames = {
  fieldNum: "Field Number",
  fieldStatus: "Field Status",
  fieldReason: "Field Status Reason"
}

const AdminFieldsTable = ({ children }) => {
  const [fieldData, setFieldData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [fieldAdded, setFieldAdded] = React.useState(false);
//  const [fieldMasterUpdated, setFieldMasterUpdated] = React.useState(false);
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
  // Fetch data for Fields
    fetchFieldInfo();
    setFieldAdded(false);
//    setFieldMasterUpdated(false);
  }, []);

  useEffect(() => {
//    console.log("triggered by dependency array ", fieldAdded, fieldMasterUpdated);
    // Fetch data for Fields
      fetchFieldInfo();
//      setFieldAdded(false);
//      setFieldMasterUpdated(false);
  }, [fieldAdded]);
      
  // Fetch field data
  const fetchFieldInfo = () => {
    fetch(`http://192.168.1.21:8081/fields`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setFieldData(jsonResponse);
      setLoading(false);
//      console.log(jsonResponse);
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
      <AdminFieldsModal setFieldAdded={setFieldAdded} addSuccessAlert={addSuccessAlert} addFailureAlert={addFailureAlert} />
      <AdminFieldsMasterStatusModal fetchFieldInfo={fetchFieldInfo} setLoading={setLoading} addSuccessAlert={addSuccessAlert} addFailureAlert={addFailureAlert} />
      <Text component="br" />
      <Text component="br" />
      <Text component="hr" />
      <TableComposable variant={TableVariant.default}  aria-label="Fields Table">
        <Thead>
       <Tr>
         <Th width={20}>{columnNames.fieldNum}</Th>
         <Th width={30}>{columnNames.fieldStatus}</Th>
         <Th width={50}>{columnNames.fieldReason}</Th>
       </Tr>
       </Thead>
       <Tbody>
        {!loading && fieldData?.data.length === 0 && (
          <Tr key="0">
            <Td colSpan={4}>
              <Bullseye>
                <EmptyState variant={EmptyStateVariant.small}>
                  <EmptyStateIcon icon={SearchIcon} />
                  <Title headingLevel="h2" size="lg">
                    No Field information retrieved!
                  </Title>
                  <EmptyStateBody>
                    Check your network connection or contact the system administrator.
                  </EmptyStateBody>
                </EmptyState>
              </Bullseye>
            </Td>
          </Tr>
        )}
        {!loading && fieldData?.data.map(row => (
          <FieldsEditTableRow
            key={row.id}
            currentField={row}
            fetchFieldInfo={fetchFieldInfo}
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

export default AdminFieldsTable;
