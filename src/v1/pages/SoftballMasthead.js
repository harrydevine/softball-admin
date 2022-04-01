import React from 'react';
import {
  Brand,
  Masthead,
  MastheadBrand,
  MastheadMain,
  MastheadToggle,
  PageToggleButton
} from '@patternfly/react-core';
import { Outlet, Link } from 'react-router-dom';
import BarsIcon from '@patternfly/react-icons/dist/js/icons/bars-icon';
import Image from "../tornados.png";

class SoftballMasthead extends React.Component {
  render () {
    return (
      <Masthead id="ehtys">
        <MastheadToggle>
          <PageToggleButton variant="plain" aria-label="Global Navigation">
            <BarsIcon />
	    <Link to="/"></Link>
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

export default SoftballMasthead;
