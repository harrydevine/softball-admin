import "@patternfly/react-core/dist/styles/base.css";
import { useNavigate } from "react-router-dom";

import React from "react";
import {
  Avatar,
  Brand,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownToggle,
  KebabToggle,
  Nav,
  NavItem,
  NavList,
  Page,
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  PageSection,
  PageSectionVariants
} from "@patternfly/react-core";
import { useAuth0 } from "@auth0/auth0-react";
import imgBrand from '@patternfly/react-core/src/components/Brand/examples/pfLogo.svg';
import imgAvatar from '@patternfly/react-core/src/components/Avatar/examples/avatarImg.svg';

const AdminPageLayoutNav = ({ children }) => {
  const navigate = useNavigate();
  //const { isAuthenticated } = useAuth0();
  const [isAuthenticated, setAuthenticated] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState("itemAdminHome");
  const [isDropdownOpen, setDropdownOpen] = React.useState(false);

  const onLoginClick = () => {
    console.log("Reimplement loginWithRedirect")
    //loginWithRedirect();
  }

  const onLogoutClick = () => {
    console.log("Reimplement logout")
  }

  const nonAdminDropdownItems = [
    <DropdownGroup key="nonAdminGroup">
      <DropdownItem key="nonAdminGroup-Login">Admin Login</DropdownItem>
    </DropdownGroup>
  ];

  const adminDropdownItems = [
    <DropdownGroup key="adminGroup">
      <DropdownItem key="adminGroup-Profile">My Profile</DropdownItem>
      <DropdownItem key="adminGroup-Logout">Logout</DropdownItem>
    </DropdownGroup>
  ];

  const onDropdownToggle = isDropdownOpen => {
    setDropdownOpen (isDropdownOpen);
  };

  const onDropdownSelect = event => {
    setDropdownOpen(!isDropdownOpen);
    if (event.target.innerText === "Admin Login") {
      onLoginClick();
    }
    if (event.target.innerText === "Logout") {
      onLogoutClick();
    }
  };

  const onNavSelect = ({ itemId, groupId }) => {
    setActiveItem(itemId);
    switch (itemId) {
      case "itemAdminHome":
        navigate("/");
        break;
      case "itemAdminPlayers":
        navigate("/admin-players");
        break;
      case "itemAdminTeams":
        navigate("/admin-teams");
        break;
      case "itemAdminFields":
        navigate("/admin-fields");
        break;
      case "itemAdminTournaments":
        navigate("/admin-tournaments");
        break;
      case "itemAdminLocalities":
        navigate("/admin-localities");
        break;
      case "itemAdminBoardMembers":
        navigate("/admin-boardmembers");
        break;
      case "itemAdminBoardMeetings":
        navigate("/admin-boardmeetings");
        break;
      case "itemAdminBoardMinutes":
        navigate("/admin-boardminutes");
        break;
      case "itemAdminLatestNews":
        navigate("/admin-latestnews");
        break;
      default:
        navigate("/not-found");
    }
  };

  const PageNav = (
    <Nav onSelect={onNavSelect} aria-label="Nav" variant="horizontal">
      <NavList>
        <NavItem itemId="itemAdminHome" isActive={activeItem === "itemAdminHome"}>
          Home
        </NavItem>
        <NavItem itemId="itemAdminPlayers" isActive={activeItem === "itemAdminPlayers"}>
          Players
        </NavItem>
	      <NavItem itemId="itemAdminTeams" isActive={activeItem === "itemAdminTeams"}>
          Teams
        </NavItem>
        <NavItem itemId="itemAdminFields" isActive={activeItem === "itemAdminFields"}>
          Fields
        </NavItem>
        <NavItem itemId="itemAdminTournaments" isActive={activeItem === "itemAdminTournaments"}>
          Tournaments
        </NavItem>
        <NavItem itemId="itemAdminLocalities" isActive={activeItem === "itemAdminLocalities"}>
          Localities
        </NavItem>
        <NavItem itemId="itemAdminBoardMembers" isActive={activeItem === "itemAdminBoardMembers"}>
          Board Members
        </NavItem>
        <NavItem itemId="itemAdminBoardMeetings" isActive={activeItem === "itemAdminBoardMeetings"}>
          Board Meetings
        </NavItem>
        <NavItem itemId="itemAdminBoardMinutes" isActive={activeItem === "itemAdminBoardMinutes"}>
          Board Minutes
        </NavItem>
        <NavItem itemId="itemAdminLatestNews" isActive={activeItem === "itemAdminLatestNews"}>
          Latest News
        </NavItem>
      </NavList>
    </Nav>
  );

  const headerTools = (
    <PageHeaderTools>
      <PageHeaderToolsGroup>
        <PageHeaderToolsItem
          visibility={{ default: 'hidden', md: 'visible' }} /** this user dropdown is hidden on mobile sizes */
        >
          {isAuthenticated && (
            <Dropdown
              position="right"
              onSelect={onDropdownSelect}
              isOpen={isDropdownOpen}
              toggle={
                <DropdownToggle onToggle={onDropdownToggle}>
                  Harry Devine
                </DropdownToggle>
              }
              dropdownItems={adminDropdownItems}
            />
            )}
            {!isAuthenticated && (
            <Dropdown
              position="right"
              onSelect={onDropdownSelect}
              isOpen={isDropdownOpen}
              toggle={
                <DropdownToggle onToggle={onDropdownToggle}>
                  Not Logged In
                </DropdownToggle>
              }
              dropdownItems={nonAdminDropdownItems}
            />
            )}
        </PageHeaderToolsItem>
      </PageHeaderToolsGroup>
      <Avatar src={imgAvatar} alt="Avatar image" />
    </PageHeaderTools>
  );

  const Header = (
    <PageHeader logo={<Brand src={imgBrand} alt="Patternfly Logo" />} headerTools={headerTools} topNav={PageNav} />
  );

  const pageId = "admin-content-page-layout-expandable-nav";

  return (
    <Page
      header={Header}
      mainContainerId={pageId}
    >
      <PageSection variant={PageSectionVariants.light}>
        {children}
      </PageSection>
    </Page>
  );
};

export default AdminPageLayoutNav;
