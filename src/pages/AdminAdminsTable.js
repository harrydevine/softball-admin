import React from 'react';
import {
  Bullseye,
  Button,
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

class AdminAdminsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adminData: [],
      loading: true,
      err: []
    };
  };

  componentDidMount() {
    this.fetchAdmins();
  }

  // Fetch data for site admins
  fetchAdmins() {
    this.setState({ loading: true });

    fetch("http://192.168.1.21:8081/admins")
      .then(resp => resp.json())
      .then(resp => this.setState({adminData: resp, loading: false}))
      .catch(err => this.setState({err: err, loading: false}));
  }

  render() {
    const {adminData, loading, error} = this.state;

    return (
      <React.Fragment>
        <TableComposable variant={TableVariant.default}  aria-label="Admins Table">
          <Thead>
	        <Tr>
	          <Th width={50}>Name</Th>
	          <Th width={50}>Password</Th>
	        </Tr>
	        </Thead>
          <Tbody>
            {!loading && (adminData?.data.length === 0) && (
              <Tr key="admin_empty">
                <Td colSpan={4}>
                  <Bullseye>
                    <EmptyState variant={EmptyStateVariant.small}>
                      <EmptyStateIcon icon={SearchIcon} />
                      <Title headingLevel="h2" size="lg">
                        No Admin information retrieved!
                      </Title>
                      <EmptyStateBody>
                        Check your network connection or contact the system administrator.
                      </EmptyStateBody>
                    </EmptyState>
                  </Bullseye>
                </Td>
              </Tr>
            )}
 	          {!loading && adminData?.data.map(row => (
              <Tr key={row.id} isEditable>
                <Td dataLabel="name">{row.name}</Td>
                <Td dataLabel="password">
                  <Text component="b">******* (password obscured for security purposes) *******</Text>
                </Td>
              </Tr>
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
}

export default AdminAdminsTable;

