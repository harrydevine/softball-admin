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
import AdminLatestNewsModal from './AdminLatestNewsModal';
import LatestNewsEditTableRow from './LatestNewsEditTableRow';

export const columnNames = {
  newsTitle: "Title",
  newsBody: "Body",
  newsImage: "Image URL"
}

const AdminLatestNewsTable = ({ children }) => {
  const [newsData, setNewsData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [newsAdded, setNewsAdded] = React.useState(false);
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
    // Fetch data for Latest News
      fetchNews();
      setNewsAdded(false);
    }, []);
  
  useEffect(() => {
  // Fetch data for Latest News when new items added
    fetchNews();
  }, [newsAdded]);
  
  const fetchNews = () => {
    fetch(`http://192.168.1.21:8081/news`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setNewsData(jsonResponse);
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
        <AdminLatestNewsModal setNewsAdded={setNewsAdded} addSuccessAlert={addSuccessAlert} addFailureAlert={addFailureAlert} />
        <Text component="br" />
        <Text component="br" />
        <Text component="hr" />
        <TableComposable variant={TableVariant.default}  aria-label="Latest News Table">
          <Thead>
	        <Tr>
              <Th width={25}>{columnNames.newsTitle}</Th>
	          <Th width={50}>{columnNames.newsBody}</Th>
	          <Th width={25}>{columnNames.newsImage}</Th>
	        </Tr>
	        </Thead>
          <Tbody>
            {!loading && newsData?.data.length === 0 && (
              <Tr key="0">
                <Td colSpan={3}>
                  <Bullseye>
                    <EmptyState variant={EmptyStateVariant.small}>
                      <EmptyStateIcon icon={SearchIcon} />
                      <Title headingLevel="h2" size="lg">
                        No News Information retrieved!
                      </Title>
                      <EmptyStateBody>
                        Check your network connection or contact the system administrator.
                      </EmptyStateBody>
                    </EmptyState>
                  </Bullseye>
                </Td>
              </Tr>
            )}
          {!loading && newsData?.data.map(row => (
            <LatestNewsEditTableRow
              key={row.id}
              currentRow={row}
              fetchNews={fetchNews}
              addSuccessAlert={addSuccessAlert} 
              addFailureAlert={addFailureAlert}
             />
          ))}
	        {loading && (
            <Tr>
              <Td colSpan={3}>
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

export default AdminLatestNewsTable;

