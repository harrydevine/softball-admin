import ReactDOM from 'react-dom';
import "@patternfly/react-core/dist/styles/base.css";
import '../fonts.css';

import React from 'react';
import {
  Backdrop,
  BackgroundImage,
  Card,
  CardBody,
  Gallery,
  GalleryItem,
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
import SoftballMasthead from './SoftballMasthead';
import BoardMinutes from './BoardMinutes';

class SoftballPageLayoutNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeGroup: 'itemHome',
      activeItem: 'itemHome'
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
    const backdrop = () => <Backdrop />;
    const PageNav = (
      <Nav onSelect={this.onNavSelect} aria-label="Nav">
        <NavList>
            <NavItem itemId="itemHome" isActive={activeItem === 'itemHome'} to="/">
              Home
            </NavItem>
	    <NavExpandable title="About Us" groupId="grpAbout" isActive={activeGroup === 'grpAbout'}>
            <NavItem groupId="grpAbout" itemId="grpAboutMinutes" isActive={activeItem === 'grpAboutMinutes'} to="/boardminutes">
              Board Meeting & Minutes
            </NavItem>
            <NavItem groupId="grpAbout" itemId="grpAboutMembers" isActive={activeItem === 'grpAboutMembers'} to="#">
              Board Members
            </NavItem>
          </NavExpandable>
          <NavExpandable title="Teams" groupId="grpTeams" isActive={activeGroup === 'grpTeams'}>
            <NavItem itemId="grpRecTeams" groupId="grpRecTeams" to="#">
	      Rec Teams
	    </NavItem>
            <NavItem itemId="grpTravelTeams" groupId="grpTravelTeams" to="#">
	      Travel Teams
	    </NavItem>
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
//    const PageSkipToContent = <SkipToContent href={`#${pageId}`}>Skip to content</SkipToContent>;

    return (
      <React.Fragment>
        <Page
          header={<SoftballMasthead />}
          sidebar={Sidebar}
          isManagedSidebar
//          skipToContent={PageSkipToContent}
//          breadcrumb={DashboardBreadcrumb}
          mainContainerId={pageId}
        >
          <PageSection variant={PageSectionVariants.light}>
          </PageSection>
        </Page>
      </React.Fragment>
//<PageSection variant={PageSectionVariants.light}>
//            <TextContent>
//              <Text component="h1">Main title</Text>
//              <Text component="p">
//                Body text should be Overpass Regular at 16px. It should have leading of 24px because <br />
//                of its relative line height of 1.5.
//              </Text>
//            </TextContent>
//          </PageSection>
//          <PageSection>
//            <Gallery hasGutter>
//              {Array.apply(0, Array(10)).map((x, i) => (
//                <GalleryItem key={i}>
//                  <Card>
//                    <CardBody>This is a card</CardBody>
//                  </Card>
//                </GalleryItem>
//              ))}
//            </Gallery>
//          </PageSection>
//        </Page>
//      </React.Fragment>
    );
  }
}

export default SoftballPageLayoutNav;
