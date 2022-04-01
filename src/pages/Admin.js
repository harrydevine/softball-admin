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

const Admin = ({ children }) => {

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
    </div>
  );
}

export default Admin;
//export default withAuthenticationRequired (Admin, {
//    onRedirecting: () => <Loading />,
//});

