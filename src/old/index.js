import ReactDOM from 'react-dom';
import "@patternfly/react-core/dist/styles/base.css";
import './fonts.css';

import React from 'react';
import {
  Brand,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  Gallery,
  GalleryItem,
  Masthead,
  MastheadBrand,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSection,
  PageSectionVariants,
  PageSidebar,
  PageToggleButton,
  SkipToContent,
  TextContent,
  Text
} from '@patternfly/react-core';
import {
  BrowserRouter,
  Route,
  Link,
} from 'react-router-dom';
import BarsIcon from '@patternfly/react-icons/dist/js/icons/bars-icon';
import Image from "./tornados.png";
//import { DashboardBreadcrumb } from './DashboardWrapper';
//import DashboardHeader from './DashboardHeader';

class SoftballMasthead extends React.Component {
  render () {
    return (
      <Masthead id="ehtys">
        <MastheadToggle>
          <PageToggleButton variant="plain" aria-label="Global Navigation">
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadMain>
          <MastheadBrand>
            <Brand src={Image} alt="EHTYS Logo" width="50" height="50" />
          </MastheadBrand>
        </MastheadMain>
      </Masthead>
    );
  }
}

class PageLayoutExpandableNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeGroup: 'grpAbout',
      activeItem: 'grpAboutMinutes'
    };

    this.onNavSelect = result => {
      this.setState({
        activeItem: result.itemId,
        activeGroup: result.groupId
      });
    };
  }

  render() {
    const { activeItem, activeGroup } = this.state;

    const PageNav = (
      <Nav onSelect={this.onNavSelect} aria-label="Nav">
        <NavList>
          <NavExpandable title="About Us" groupId="grpAbout" isActive={activeGroup === 'grpAbout'} isExpanded>
            <NavItem groupId="grpAbout" itemId="grpAboutMinutes" isActive={activeItem === 'grpAboutMinutes'}>
              Board Meeting & Minutes
            </NavItem>
            <NavItem groupId="grpAbout" itemId="grpAboutMembers" isActive={activeItem === 'grpAboutMembers'} to="#">
              Board Members
            </NavItem>
          </NavExpandable>
          <NavExpandable title="Teams" groupId="grpTeams" isActive={activeGroup === 'grpTeams'}>
	    <NavExpandable title="8U" groupId="grpTeams8u" isActive={activeGroup === 'grpTeams8u'}>
              <NavItem groupId="grpTeams" itemId="grpTeams8uA" isActive={activeItem === 'grpTeams8uA'} to="#">
                Team A
              </NavItem>
              <NavItem groupId="grpTeams" itemId="grpTeams8uB" isActive={activeItem === 'grpTeams8uB'} to="#">
                Team B
              </NavItem>
	    </NavExpandable>
            <NavExpandable title="10U" groupId="grpTeams10u" isActive={activeGroup === 'grpTeams10u'} to
="#">
              <NavItem groupId="grpTeams" itemId="grpTeams10uA" isActive={activeItem === 'grpTeams10uA'} to="#">
                Team A
              </NavItem>
              <NavItem groupId="grpTeams" itemId="grpTeams10uB" isActive={activeItem === 'grpTeams10uB'} to="#">
                Team B
              </NavItem>
            </NavExpandable>
            <NavExpandable title="12U" groupId="grpTeams12u" isActive={activeGroup === 'grpTeams12u'} to
="#">
              <NavItem groupId="grpTeams" itemId="grpTeams12uA" isActive={activeItem === 'grpTeams12uA'} to="#">
                Team A
              </NavItem>
              <NavItem groupId="grpTeams" itemId="grpTeams12uB" isActive={activeItem === 'grpTeams12uB'} to="#">
                Team B
              </NavItem>
            </NavExpandable>
            <NavExpandable title="14U" groupId="grpTeams14u" isActive={activeGroup === 'grpTeams14u'}>
              <NavItem groupId="grpTeams" itemId="grpTeams14uA" isActive={activeItem === 'grpTeams14uA'} to="#">
                Team A
              </NavItem>
              <NavItem groupId="grpTeams" itemId="grpTeams14uB" isActive={activeItem === 'grpTeams14uB'} to="#">
                Team B
              </NavItem>
            </NavExpandable>
            <NavExpandable title="16U" groupId="grpTeams16u" isActive={activeGroup === 'grpTeams16u'}>
              <NavItem groupId="grpTeams" itemId="grpTeams16uA" isActive={activeItem === 'grpTeams16uA'} to="#">
                Team A
              </NavItem>
              <NavItem groupId="grpTeams" itemId="grpTeams16uB" isActive={activeItem === 'grpTeams16uB'} to="#">
                Team B
              </NavItem>
            </NavExpandable>	    
            <NavExpandable title="Travel Teams" groupId="grpTravel" isActive={activeGroup === 'grpTravel'}>
              <NavItem groupId="grpTravel" itemId="grpTravel10u" isActive={activeItem === 'grpTravel10u'} to="#">
                10U
              </NavItem>
              <NavItem groupId="grpTravel" itemId="grpTravel12u" isActive={activeItem === 'grpTravel12u'} to="#">
                12U
              </NavItem>
            </NavExpandable>	    
	  </NavExpandable>
          <NavItem itemId="itemFields" isActive={activeItem === 'itemFields'} to="#">
	    Field Information
          </NavItem>
          <NavItem itemId="itemForms" isActive={activeItem === 'itemForms'} to="#">
	    Forms & Documents
          </NavItem>
          <NavItem itemId="itemShop" isActive={activeItem === 'itemShop'} to="#">
	    Shop
          </NavItem>
          <NavItem itemId="itemFAQ" isActive={activeItem === 'itemFAQ'} to="#">
	    FAQ
          </NavItem>
          <NavItem itemId="itemSponsors" isActive={activeItem === 'itemSponsors'} to="#">
	    Sponsors
          </NavItem>
        </NavList>
      </Nav>
    );

    const Sidebar = <PageSidebar nav={PageNav} />;
    const pageId = 'main-content-page-layout-expandable-nav';
    const PageSkipToContent = <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>;

    return (
      <React.Fragment>
        <Page
          header={<SoftballMasthead />}
          sidebar={Sidebar}
          isManagedSidebar
          skipToContent={PageSkipToContent}
//          breadcrumb={DashboardBreadcrumb}
          mainContainerId={pageId}
        >
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">Main title</Text>
              <Text component="p">
                Body text should be Overpass Regular at 16px. It should have leading of 24px because <br />
                of its relative line height of 1.5.
              </Text>
            </TextContent>
          </PageSection>
          <PageSection>
            <Gallery hasGutter>
              {Array.apply(0, Array(10)).map((x, i) => (
                <GalleryItem key={i}>
                  <Card>
                    <CardBody>This is a card</CardBody>
                  </Card>
                </GalleryItem>
              ))}
            </Gallery>
          </PageSection>
        </Page>
      </React.Fragment>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<PageLayoutExpandableNav />, rootElement);
