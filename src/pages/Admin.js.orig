import React, { useEffect } from 'react';
import {
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Tabs,
  Tab,
  TabContent,
  TabContentBody,
  TabTitleText,
  Title
} from '@patternfly/react-core';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import AdminPlayersTable from './AdminPlayersTable';
import AdminTeams from './AdminTeams'
import AdminFieldsTable from './AdminFieldsTable';
import AdminBoardMemberTable from './AdminBoardMemberTable';
import AdminBoardMeetingTable from './AdminBoardMeetingTable';
import AdminBoardMinutesTable from './AdminBoardMinutesTable';
import AdminLocalitiesTable from './AdminLocalitiesTable';
import AdminTournamentsTable from './AdminTournamentsTable';
import AdminLatestNewsTable from './AdminLatestNewsTable';
import { Loading } from './Loading'; 

const config = require('./config.js');

const Admin = ({ children }) => {

  const [activeTabKey, setActiveTabKey] = React.useState(0);
  const [activeTabKeySecondary, setActiveTabKeySecondary] = React.useState(10);

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const handleTabClickSecondary = (event, tabIndex) => {
    setActiveTabKeySecondary(tabIndex);
  };

  return (
    <div>
      <PageSection variant={PageSectionVariants.light} isWidthLimited key="section1">
        <Flex
          spaceItems={{ default: 'spaceItemsMd' }}
          alignItems={{ default: 'alignItemsFlexStart' }}
          flexWrap={{ default: 'noWrap' }}
        >
          <FlexItem key="admin_heading">
            <Title headingLevel="h1" size="2x1">
              EHT Softball - Admin Functions
            </Title>
          </FlexItem>
        </Flex>
      </PageSection>
      <PageSection type="tabs" variant={PageSectionVariants.light} isWidthLimited key="section2">
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} usePageInsets id="tabAdminFunctions">
          <Tab
            eventKey={0}
            title={<TabTitleText>Players</TabTitleText>}
            tabContentId={`tabContent${0}`}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>Teams</TabTitleText>}
            tabContentId={`tabContent${1}`}
          />
          <Tab
            eventKey={2}
            title={<TabTitleText>Fields</TabTitleText>}
            tabContentId={`tabContent${2}`}
          />
          <Tab
            eventKey={3}
            title={<TabTitleText>Tournaments</TabTitleText>}
            tabContentId={`tabContent${3}`}
          />
          <Tab
            eventKey={4}
            title={<TabTitleText>Localities</TabTitleText>}
            tabContentId={`tabContent${4}`}
          />
          <Tab
            eventKey={5}
            title={<TabTitleText>Board Members</TabTitleText>}
            tabContentId={`tabContent${5}`}
          />
          <Tab
            eventKey={6}
            title={<TabTitleText>Board Meetings</TabTitleText>}
            tabContentId={`tabContent${6}`}
          />
          <Tab
            eventKey={7}
            title={<TabTitleText>Board Minutes</TabTitleText>}
            tabContentId={`tabContent${7}`}
          />
          <Tab
            eventKey={8}
            title={<TabTitleText>Latest News</TabTitleText>}
            tabContentId={`tabContent${8}`}
          />
	      </Tabs>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} isWidthLimited key="section3">
        <Flex direction={{ default: 'column' }} key="adminTabsMainFlex">
          <FlexItem key="adminTabs">
            <TabContent key={0} eventKey={0} id={`tabContent${0}`} activeKey={activeTabKey} hidden={0 !== activeTabKey}>
	              <AdminPlayersTable />
            </TabContent>
            <TabContent key={1} eventKey={1} id={`tabContent${1}`} activeKey={activeTabKey} hidden={1 !== activeTabKey}>
              <AdminTeams />
            </TabContent>
            <TabContent key={2} eventKey={2} id={`tabContent${2}`} activeKey={activeTabKey} hidden={2 !== activeTabKey}>
              <TabContentBody>
                <AdminFieldsTable />
              </TabContentBody>
            </TabContent>
            <TabContent key={3} eventKey={3} id={`tabContent${3}`} activeKey={activeTabKey} hidden={3 !== activeTabKey}>
              <TabContentBody>
                <AdminTournamentsTable />
              </TabContentBody>
            </TabContent>
            <TabContent key={4} eventKey={4} id={`tabContent${4}`} activeKey={activeTabKey} hidden={4 !== activeTabKey}>
              <TabContentBody>
                <AdminLocalitiesTable />
              </TabContentBody>
            </TabContent>
            <TabContent key={5} eventKey={5} id={`tabContent${5}`} activeKey={activeTabKey} hidden={5 !== activeTabKey}>
              <TabContentBody>
                <AdminBoardMemberTable />
              </TabContentBody>
            </TabContent>
            <TabContent key={6} eventKey={6} id={`tabContent${6}`} activeKey={activeTabKey} hidden={6 !== activeTabKey}>
              <TabContentBody>
              <AdminBoardMeetingTable />
              </TabContentBody>
            </TabContent>
            <TabContent key={7} eventKey={7} id={`tabContent${7}`} activeKey={activeTabKey} hidden={7 !== activeTabKey}>
              <TabContentBody>
              <AdminBoardMinutesTable />
              </TabContentBody>
            </TabContent>
            <TabContent key={8} eventKey={8} id={`tabContent${8}`} activeKey={activeTabKey} hidden={8 !== activeTabKey}>
              <TabContentBody>
              <AdminLatestNewsTable />
              </TabContentBody>
            </TabContent>
	        </FlexItem>
	      </Flex>
      </PageSection>
    </div>
  );
}

export default Admin;
//export default withAuthenticationRequired (Admin, {
//    onRedirecting: () => <Loading />,
//});

