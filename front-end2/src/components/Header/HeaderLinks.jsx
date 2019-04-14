import React, { Component } from "react";
import { NavItem, Nav} from "react-bootstrap";
import ToggleButton from 'react-toggle-button'

class HeaderLinks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props,
      value: false
   }
   this._handleDoctorToggle = this._handleDoctorToggle.bind(this);
  }

  _handleDoctorToggle = (value) => {
    this.setState({value: !value});
    this.props.handleDoctorToggle();
  }

  render() {
    return (
      <div>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            <ToggleButton
              value={ this.state.value || false }
              onToggle={this._handleDoctorToggle} />
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default HeaderLinks;
