import React, { useEffect } from 'react';
import {
  Alert, 
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  Bullseye,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardTitle,
  DualListSelector,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateBody,
  Label,
  Modal,
  ModalVariant,
  PageSection,
  PageSectionVariants,
  Spinner,
  Tabs,
  Tab,
  TabContent,
  TabTitleText,
  Text,
  Title,
  Tooltip
} from '@patternfly/react-core';
import AdminTeamModal from './AdminTeamModal';
import { Thead, TableComposable, TableVariant, Tr, Th, Tbody, Td} from '@patternfly/react-table';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import PlusCircleIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import MinusCircleIcon from '@patternfly/react-icons/dist/js/icons/minus-circle-icon';

export const columnNames = {
  playerName: 'Name',
  playerNumber: 'Jersey Number'
};

//class AdminTeams extends React.Component {
const AdminTeams = () => {
  const [teamData, setTeamData] = React.useState(null);
  const [teamLoading, setTeamLoading] = React.useState(true);
  const [teamErr, setTeamErr] = React.useState(false);
  const [travelData, setTravelData] = React.useState(null);
  const [travelLoading, setTravelLoading] = React.useState(true);
  const [travelErr, setTravelErr] = React.useState(false);
  const [playerData, setPlayerData] = React.useState(null);
  const [playerLoading, setPlayerLoading] = React.useState(true);
  const [playerErr, setPlayerErr] = React.useState(false);
  const [activeTabKey, setActiveTabKey] = React.useState(0);
  const [teamAdded, setTeamAdded] = React.useState(false);
  const [alerts, setAlerts] = React.useState([]);
  const [isAddPlayerDlgOpen, setAddPlayerDlgOpen] = React.useState(false);
  const [teamId, setTeamId] = React.useState(0);
  const [teamName, setTeamName] = React.useState("");
  const [division, setDivision] = React.useState("");
  const [availablePlayers, setAvailablePlayers] = React.useState([]);
  const [chosenPlayers, setChosenPlayers] = React.useState([]);
  const [activeSortIndex, setActiveSortIndex] = React.useState(0); 
  const [activeSortDirection, setActiveSortDirection] = React.useState('asc');
  const getSortableRowValues = players => {
    const {playerName, playerNumber} = players;
    return [playerName, playerNumber];
  };

  const handleAddNewPlayerButton = () => {
    console.log("Handled Add new player to this team button click")
  };

  const handleAddPlayerToTeam = (id, level, name) => {
    let playersArray = Array();
    let teamArray = Array();
    let filteredArray = Array();
    setTeamId(id);
    setTeamName(name);
    setDivision(level);
    setAddPlayerDlgOpen(true);

    playerData?.data.filter(function (data) {
      return data.division === level;
    }).map((filteredPlayer => ( 
      playersArray.push(filteredPlayer.playerName)
    )));

    playerData?.data.filter(function (data) {
      return data.teamId === id;
    }).map((teamPlayer => (
      teamArray.push(teamPlayer.playerName)
    )));

    filteredArray = playersArray.filter(val => !teamArray.includes(val));
    setAvailablePlayers(filteredArray);
//    setChosenPlayers(teamArray);

}

  const handleRemoveTeam = (id) => {
    console.log(id);
  }

  const handleAddModalOK = () => {
    setAddPlayerDlgOpen(false);

    for (let i=0; i < chosenPlayers.length; i++) {
      console.log(chosenPlayers[i]);
    }
  }

  const handleAddModalCancel = () => {
    setAddPlayerDlgOpen(false);
  }

  const handleTabClick = (_, tabIndex) => setActiveTabKey(tabIndex);
    
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
    fetchRecTeams();
    fetchTravelTeams();
    fetchPlayers();
  }, [teamAdded]);

  useEffect(() => {
    fetchRecTeams();
    fetchTravelTeams();
    fetchPlayers();
  }, []);

  const fetchRecTeams = () => {
    // Fetch data for Rec Teams
    fetch(`http://192.168.1.21:8081/recteams`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setTeamData(jsonResponse);
      setTeamLoading(false);
    })
    .catch(err => {
      setTeamErr(err);
      setTeamLoading(false);
    })
  }

  const fetchTravelTeams = () => {
    // Fetch data for Travel Teams
    fetch(`http://192.168.1.21:8081/travelteams`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setTravelData(jsonResponse);
      setTravelLoading(false);
    })
    .catch(err => {
      setTravelErr(err);
      setTravelLoading(false);
    })
  }

  const fetchPlayers = () => {
    // Fetch data for Players
    fetch(`http://192.168.1.21:8081/players`)
    .then(async resp => {
      const jsonResponse = await resp.json()
      setPlayerData(jsonResponse);
      setPlayerLoading(false);
    })
    .catch(err => {
      setPlayerErr(err);
      setPlayerLoading(false);
    })
  }

  const onListChange = (newAvailablePlayers, newChosenPlayers) => {
    setAvailablePlayers( newAvailablePlayers.sort() );
    setChosenPlayers( newChosenPlayers.sort() );
  };

    return (
      <div>
        <PageSection variant={PageSectionVariants.light} key="adminTeamsSection1">
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
        <Modal
          variant={ModalVariant.medium}
          title="Add Player To Team"
          description={"Add a player to " + teamName + " - " + division}
          isOpen={isAddPlayerDlgOpen}
          onClose={handleAddModalCancel}
          actions={[
            <Button key="addTeam" variant="primary" form="add-team-form" onClick={handleAddModalOK}>
              Add Player(s)
            </Button>,
            <Button key="cancelAddTeam" variant="link" onClick={handleAddModalCancel}>
              Cancel
            </Button>
          ]}
        > 
          <DualListSelector
            availableOptionsTitle="Available Players"
            availableOptions={availablePlayers}
            chosenOptionsTitle={`Team: ${teamName} - Division: ${division}`}
            chosenOptions={chosenPlayers}
            onListChange={onListChange}
            id="basicSelector"
          />
        </Modal>

        <AdminTeamModal setTeamAdded={setTeamAdded} addSuccessAlert={addSuccessAlert} addFailureAlert={addFailureAlert}  />
        </PageSection>
        <PageSection type="adminTeamTabs" isWidthLimited key="adminTeamsSection2">
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick} usePageInsets id="adminTeamDivisionsTab">
            <Tab eventKey={0} title={<TabTitleText>6U</TabTitleText>} tabContentId={`tabContent${0}`} />
            <Tab eventKey={1} title={<TabTitleText>8U</TabTitleText>} tabContentId={`tabContent${1}`} />
            <Tab eventKey={2} title={<TabTitleText>10U</TabTitleText>} tabContentId={`tabContent${2}`} />
            <Tab eventKey={3} title={<TabTitleText>12U</TabTitleText>} tabContentId={`tabContent${3}`} />
            <Tab eventKey={4} title={<TabTitleText>14U</TabTitleText>} tabContentId={`tabContent${4}`} />
            <Tab eventKey={5} title={<TabTitleText>16U</TabTitleText>} tabContentId={`tabContent${5}`} />
            <Tab eventKey={6} title={<TabTitleText>Travel</TabTitleText>} tabContentId={`tabContent${6}`} />
          </Tabs>
        </PageSection>
        <PageSection isWidthLimited key="adminTeamsSection3">
	      <TabContent key={0} eventKey={0} id={`tabContent${0}`} activeKey={activeTabKey} hidden={0 !== activeTabKey}>
          {teamLoading && (
            <Bullseye>
              <Spinner size="xl" />
            </Bullseye>
          )}
          {!teamLoading && teamData?.data.length === 0 && (
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={SearchIcon} />
                  <Title headingLevel="h2" size="lg">
                    No Team information retrieved!
                  </Title>
                <EmptyStateBody>
                  Check your network connection or contact the system administrator.
                </EmptyStateBody>
              </EmptyState>
            </Bullseye>
          )}
            <React.Fragment key="6u_teams">
            {!teamLoading && teamData?.data
              .filter(function (data) {
                return data.division === "6U";
              })
              .map((row => (
                <Card key={row.id} isSelectable>
                  <CardHeader>
                  <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                  <Tooltip content="Add Player to this Team">
                    <Button variant="link" isInline icon={<PlusCircleIcon />} onClick={() => handleAddPlayerToTeam(row.id, "6U", row.teamName)} />{'  '}
                  </Tooltip>
                  <Tooltip content="Remove this Team">
                    <Button variant="link" isInline icon={<MinusCircleIcon />} onClick={() => handleRemoveTeam(row.id)}/>{'  '}
                  </Tooltip>
                  </CardHeader>
                  <CardTitle>Coach: {row.coach}</CardTitle>
                    <CardBody>
                      Phone Number: {row.coach_phone}
                      <Text component="br" />
                      Email: {row.coach_email}
                      <Text component="br" />
                      <Text component="br" />
                      <Title headingLevel="h2" size="lg">Roster</Title>
                        <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                          <Thead>
                            <Tr>
                              <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                              <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                          {!playerLoading && playerData?.data
                                .filter(function (data) {
                                  return data.teamId === row.id;
                                })
                                .map((player => (
                                  <Tr key={"player"+player.id}>
                                    <Td>{player.playerName}</Td>
                                    <Td>{player.playerNumber}</Td>
                                  </Tr>
                                )))}
                          </Tbody>
                        </TableComposable>
                    </CardBody>
                  </Card>
                )))}
              </React.Fragment>
            </TabContent>
          <TabContent key={1} eventKey={1} id={`tabContent${1}`} activeKey={activeTabKey} hidden={1 !== activeTabKey}>
            {teamLoading && (
              <Bullseye>
                <Spinner size="xl" />
              </Bullseye>
            )}
            {!teamLoading && teamData?.data.length === 0 && (
              <Bullseye>
                <EmptyState variant={EmptyStateVariant.small}>
                  <EmptyStateIcon icon={SearchIcon} />
                    <Title headingLevel="h2" size="lg">
                      No Team information retrieved!
                    </Title>
                  <EmptyStateBody>
                    Check your network connection or contact the system administrator.
                  </EmptyStateBody>
                </EmptyState>
              </Bullseye>
            )}
                    <React.Fragment key="8u_teams">
                    {!teamLoading && teamData?.data
                    .filter(function (data) {
                      return data.division === "8U";
                    })
                    .map((row => (
                        <Card key={row.id} isSelectable>
                        <CardHeader>
                        <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                        <Tooltip content="Add Player to this Team">
                            <Button variant="link" isInline icon={<PlusCircleIcon />} onClick={() => handleAddPlayerToTeam(row.id, "8U", row.teamName)} />{'  '}
                          </Tooltip>
                          <Tooltip content="Remove this Team">
                            <Button variant="link" isInline icon={<MinusCircleIcon />} onClick={() => handleRemoveTeam(row.id)}/>{'  '}
                          </Tooltip>
                        </CardHeader>
                        <CardTitle>Coach: {row.coach}</CardTitle>
                        <CardBody>
                          Phone Number: {row.coach_phone}
                          <Text component="br" />
                          Email: {row.coach_email}
                          <Text component="br" />
                          <Text component="br" />
                          <Title headingLevel="h2" size="lg">Roster</Title>
                            <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                              <Thead>
                                <Tr>
                                  <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                                  <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                              {!playerLoading && playerData?.data
                                .filter(function (data) {
                                  return data.teamId === row.id;
                                })
                                .map((player => (
                                  <Tr key={"player"+player.id}>
                                    <Td>{player.playerName}</Td>
                                    <Td>{player.playerNumber}</Td>
                                  </Tr>
                                )))}
                              </Tbody>
                            </TableComposable>
                        </CardBody>
                      </Card>
                    )))}
                    </React.Fragment>
                </TabContent>
                <TabContent key={2} eventKey={2} id={`tabContent${2}`} activeKey={activeTabKey} hidden={2 !== activeTabKey}>
                  {teamLoading && (
                      <Bullseye>
                        <Spinner size="xl" />
                      </Bullseye>
                    )}
                    {!teamLoading && teamData?.data.length === 0 && (
                      <Bullseye>
                        <EmptyState variant={EmptyStateVariant.small}>
                          <EmptyStateIcon icon={SearchIcon} />
                            <Title headingLevel="h2" size="lg">
                              No Team information retrieved!
                           </Title>
                         <EmptyStateBody>
                           Check your network connection or contact the system administrator.
                         </EmptyStateBody>
                        </EmptyState>
                     </Bullseye>
                    )}
                    <React.Fragment key="10u_teams">
                    {!teamLoading && teamData?.data
                    .filter(function (data) {
                      return data.division === "10U";
                    })
                    .map((row => (
                      <Card key={row.id} isSelectable>
                        <CardHeader>
                          <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                          <Tooltip content="Add Player to this Team">
                            <Button variant="link" isInline icon={<PlusCircleIcon />} onClick={() => handleAddPlayerToTeam(row.id, "10U", row.teamName)} />{'  '}
                            </Tooltip>
                          <Tooltip content="Remove this Team">
                            <Button variant="link" isInline icon={<MinusCircleIcon />} onClick={() => handleRemoveTeam(row.id)}/>{'  '}
                          </Tooltip>
                        </CardHeader>
                        <CardTitle>Coach: {row.coach}</CardTitle>
                        <CardBody>
                          Phone Number: {row.coach_phone}
                          <Text component="br" />
                          Email: {row.coach_email}
                          <Text component="br" />
                          <Text component="br" />
                          <Title headingLevel="h2" size="lg">Roster</Title>
                            <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                              <Thead>
                                <Tr>
                                  <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                                  <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {!playerLoading && playerData?.data
                                .filter(function (data) {
                                  return data.teamId === row.id;
                                })
                                .map((player => (
                                  <Tr key={"player"+player.id}>
                                    <Td>{player.playerName}</Td>
                                    <Td>{player.playerNumber}</Td>
                                  </Tr>
                                )))}
                              </Tbody>
                            </TableComposable>
                        </CardBody>
                        <CardFooter>
                        </CardFooter>
                      </Card>
                    )))}
                  </React.Fragment>
                </TabContent>
                <TabContent key={3} eventKey={3} id={`tabContent${3}`} activeKey={activeTabKey} hidden={3 !== activeTabKey}>
                {teamLoading && (
                      <Bullseye>
                        <Spinner size="xl" />
                      </Bullseye>
                    )}
                    {!teamLoading && teamData?.data.length === 0 && (
                      <Bullseye>
                        <EmptyState variant={EmptyStateVariant.small}>
                          <EmptyStateIcon icon={SearchIcon} />
                            <Title headingLevel="h2" size="lg">
                              No Team information retrieved!
                           </Title>
                         <EmptyStateBody>
                           Check your network connection or contact the system administrator.
                         </EmptyStateBody>
                        </EmptyState>
                     </Bullseye>
                    )}
                    <React.Fragment key="12u_teams">
                    {!teamLoading && teamData?.data
                    .filter(function (data) {
                      return data.division === "12U";
                    })
                    .map((row => (
                      <Card key={row.id} isSelectable>
                        <CardHeader>
                        <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                        <Tooltip content="Add Player to this Team">
                          <Button variant="link" isInline icon={<PlusCircleIcon />} onClick={() => handleAddPlayerToTeam(row.id, "12U", row.teamName)} />{'  '}
                        </Tooltip>
                        <Tooltip content="Remove this Team">
                          <Button variant="link" isInline icon={<MinusCircleIcon />} onClick={() => handleRemoveTeam(row.id)}/>{'  '}
                        </Tooltip>
                        </CardHeader>
                        <CardTitle>Coach: {row.coach}</CardTitle>
                        <CardBody>
                          Phone Number: {row.coach_phone}
                          <Text component="br" />
                          Email: {row.coach_email}
                          <Text component="br" />
                          <Text component="br" />
                          <Title headingLevel="h2" size="lg">Roster</Title>
                            <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                              <Thead>
                                <Tr>
                                  <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                                  <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                              {!playerLoading && playerData?.data
                                .filter(function (data) {
                                  return data.teamId === row.id;
                                })
                                .map((player => (
                                  <Tr key={"player"+player.id}>
                                    <Td>{player.playerName}</Td>
                                    <Td>{player.playerNumber}</Td>
                                  </Tr>
                                )))}
                              </Tbody>
                            </TableComposable>
                        </CardBody>
                      </Card>
                    )))}
                    </React.Fragment>
                </TabContent>
                <TabContent key={4} eventKey={4} id={`tabContent${4}`} activeKey={activeTabKey} hidden={4 !== activeTabKey}>
                {teamLoading && (
                      <Bullseye>
                        <Spinner size="xl" />
                      </Bullseye>
                    )}
                    {!teamLoading && teamData?.data.length === 0 && (
                      <Bullseye>
                        <EmptyState variant={EmptyStateVariant.small}>
                          <EmptyStateIcon icon={SearchIcon} />
                            <Title headingLevel="h2" size="lg">
                              No Team information retrieved!
                           </Title>
                         <EmptyStateBody>
                           Check your network connection or contact the system administrator.
                         </EmptyStateBody>
                        </EmptyState>
                     </Bullseye>
                    )}
                    <React.Fragment key="14u_teams">
                    {!teamLoading && teamData?.data
                    .filter(function (data) {
                      return data.division === "14U";
                    })
                    .map((row => (
                      <Card key={row.id} isSelectable>
                        <CardHeader>
                        <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                        <Tooltip content="Add Player to this Team">
                          <Button variant="link" isInline icon={<PlusCircleIcon />} onClick={() => handleAddPlayerToTeam(row.id, "14U", row.teamName)} />{'  '}
                        </Tooltip>
                        <Tooltip content="Remove this Team">
                          <Button variant="link" isInline icon={<MinusCircleIcon />} onClick={() => handleRemoveTeam(row.id)}/>{'  '}
                        </Tooltip>
                        </CardHeader>
                        <CardTitle>Coach: {row.coach}</CardTitle>
                        <CardBody>
                          Phone Number: {row.coach_phone}
                          <Text component="br" />
                          Email: {row.coach_email}
                          <Text component="br" />
                          <Text component="br" />
                          <Title headingLevel="h2" size="lg">Roster</Title>
                            <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                              <Thead>
                                <Tr>
                                  <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                                  <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                              {!playerLoading && playerData?.data
                                .filter(function (data) {
                                  return data.teamId === row.id;
                                })
                                .map((player => (
                                  <Tr key={"player"+player.id}>
                                    <Td>{player.playerName}</Td>
                                    <Td>{player.playerNumber}</Td>
                                  </Tr>
                                )))}
                              </Tbody>
                            </TableComposable>
                        </CardBody>
                      </Card>
                    )))}
                  </React.Fragment>
                </TabContent>
                <TabContent key={5} eventKey={5} id={`tabContent${5}`} activeKey={activeTabKey} hidden={5 !== activeTabKey}>
                {teamLoading && (
                      <Bullseye>
                        <Spinner size="xl" />
                      </Bullseye>
                    )}
                    {!teamLoading && teamData?.data.length === 0 && (
                      <Bullseye>
                        <EmptyState variant={EmptyStateVariant.small}>
                          <EmptyStateIcon icon={SearchIcon} />
                            <Title headingLevel="h2" size="lg">
                              No Team information retrieved!
                           </Title>
                         <EmptyStateBody>
                           Check your network connection or contact the system administrator.
                         </EmptyStateBody>
                        </EmptyState>
                     </Bullseye>
                    )}
                    <React.Fragment key="16u_teams">
                    {!teamLoading && teamData?.data
                    .filter(function (data) {
                      return data.division === "16U";
                    })
                    .map((row => (
                      <Card key={row.id} isSelectable>
                        <CardHeader>
                          <Label icon={<InfoCircleIcon />} color="{row.teamColor}" >{row.teamName}</Label>{'  '}
                          <Tooltip content="Add Player to this Team">
                            <Button variant="link" isInline icon={<PlusCircleIcon />} onClick={() => handleAddPlayerToTeam(row.id, "16U", row.teamName)} />{'  '}
                          </Tooltip>
                          <Tooltip content="Remove this Team">
                            <Button variant="link" isInline icon={<MinusCircleIcon />} onClick={() => handleRemoveTeam(row.id)}/>{'  '}
                          </Tooltip>
                        </CardHeader>
                        <CardTitle>Coach: {row.coach}</CardTitle>
                        <CardBody>
                          Phone Number: {row.coach_phone}
                          <Text component="br" />
                          Email: {row.coach_email}
                          <Text component="br" />
                          <Text component="br" />
                          <Title headingLevel="h2" size="lg">Roster</Title>
                            <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                              <Thead>
                                <Tr>
                                  <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                                  <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                              {!playerLoading && playerData?.data
                                .filter(function (data) {
                                  return data.teamId === row.id;
                                })
                                .map((player => (
                                  <Tr key={"player"+player.id}>
                                    <Td>{player.playerName}</Td>
                                    <Td>{player.playerNumber}</Td>
                                  </Tr>
                                )))}
                              </Tbody>
                            </TableComposable>
                        </CardBody>
                      </Card>
                    )))}
                  </React.Fragment>
                </TabContent>
                <TabContent key={6} eventKey={6} id={`tabContent${6}`} activeKey={activeTabKey} hidden={6 !== activeTabKey}>
                {travelLoading && (
                  <Bullseye>
                    <Spinner size="xl" />
                  </Bullseye>
                )}
                {!travelLoading && travelData?.data.length === 0 && (
                  <Bullseye>
                    <EmptyState variant={EmptyStateVariant.small}>
                      <EmptyStateIcon icon={SearchIcon} />
                        <Title headingLevel="h2" size="lg">
                          No Team information retrieved!
                        </Title>
                      <EmptyStateBody>
                        Check your network connection or contact the system administrator.
                      </EmptyStateBody>
                    </EmptyState>
                  </Bullseye>
                )}
                <React.Fragment key="travel_teams">
                  {!travelLoading && travelData?.data.map((row => (
                    <Card key={row.id} isSelectable>
                      <CardHeader>
                        <Label icon={<InfoCircleIcon />} color={`${row.teamColor}`} >{row.teamName}</Label>{'  '}
                        <Tooltip content="Add Player to this Team">
                          <Button variant="link" isInline icon={<PlusCircleIcon />} onClick={() => handleAddPlayerToTeam(row.id, row.division, row.teamName)} />{'  '}
                        </Tooltip>
                        <Tooltip content="Remove this Team">
                          <Button variant="link" isInline icon={<MinusCircleIcon />} onClick={() => handleRemoveTeam(row.id)}/>{'  '}
                        </Tooltip>
                      </CardHeader>
                      <CardTitle>Coach: {row.coach}</CardTitle>
                      <CardBody>
                        Phone Number: {row.coach_phone}
                          <Text component="br" />
                          Email: {row.coach_email}
                          <Text component="br" />
                          <Text component="br" />
                        <Title headingLevel="h2" size="lg">Roster</Title>
                          <TableComposable variant={TableVariant.default} aria-label="roster+{row.teamName}+table">
                            <Thead>
                              <Tr>
                                <Th sort={getSortParams(0)}>{columnNames.playerName}</Th>
                                <Th sort={getSortParams(1)}>{columnNames.playerNumber}</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                            {!playerLoading && playerData?.data
                              .filter(function (data) {
                                return data.teamId === row.id;
                              })
                              .map((player => (
                                <Tr key={"player"+player.id}>
                                  <Td>{player.playerName}</Td>
                                  <Td>{player.playerNumber}</Td>
                                </Tr>
                              )))}
                            </Tbody>
                          </TableComposable>
                      </CardBody>
                    </Card>
                  )))}
                  </React.Fragment>
                </TabContent>
        </PageSection>
      </div>      
    );
  }

  export default AdminTeams;
