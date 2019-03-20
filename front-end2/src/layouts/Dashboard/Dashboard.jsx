import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NotificationSystem from "react-notification-system";

import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import PropsRoute from 'components/Routes/PropsRoute';

import dashboardRoutes from "routes/dashboard.jsx";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.handleDoctorToggle = this.handleDoctorToggle.bind(this);
    this.setAppState = this.setAppState.bind(this);
    this.setPatientData = this.setPatientData.bind(this);
    this.saveState = this.saveState.bind(this);
    this.loadState = this.loadState.bind(this);
    this.state = {
      _notificationSystem: null,
      isDoctor: false,
      patientData: {},
      appState: {}
    };
  }

  saveState = () => {
    localStorage.setItem("appState", JSON.stringify(this.state.appState));
    localStorage.setItem("patientData", JSON.stringify(this.state.patientData));
  }

  loadState = () => {
    var appState = localStorage.getItem("appState");
    let self = this;
    appState = JSON.parse(appState);
    if(appState) {
    Object.keys(appState).forEach(function(key) {
      self.setAppState(key, appState[key]);
    });
  }
    var patientData = localStorage.getItem("patientData");
    patientData = JSON.parse(patientData);
    if(patientData) {
    Object.keys(patientData).forEach(function(key) {
      self.setPatientData(key, patientData[key]);
    });
  }
  }

  setPatientData = (key, value) => {
    var newPatientData = this.state.patientData;
    newPatientData[key] = value;
    this.setState({ patientData : newPatientData });
    this.saveState();
  }

  setAppState = (key, value) => {
    var newAppState = this.state.appState;
    newAppState[key] = value;
    this.setState({ appState : newAppState})
    this.saveState();
  }

  handleDoctorToggle = () => {
    var isDoctor = this.state.isDoctor;
    this.setState({ isDoctor: !isDoctor})
  }
  handleNotificationClick(position) {
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className="pe-7s-gift" />,
      message: (
        <div>
          Welcome to <b>Light Bootstrap Dashboard</b> - a beautiful freebie for
          every web developer.
        </div>
      ),
      level: level,
      position: position,
      autoDismiss: 15
    });
  }
  componentDidMount() {
    this.setState({ _notificationSystem: this.refs.notificationSystem });
    var _notificationSystem = this.refs.notificationSystem;
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
  }
  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  render() {
    return (
      <div className="wrapper">
        <Sidebar {...this.props} handleDoctorToggle={this.handleDoctorToggle}/>
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <Header {...this.props} handleDoctorToggle={this.handleDoctorToggle} />
          <Switch>
            {dashboardRoutes.map((prop, key) => {
              if (prop.name === "Notifications")
                return (
                  <Route
                    path={prop.path}
                    key={key}
                    render={routeProps => (
                      <prop.component
                        {...routeProps}
                        handleClick={this.handleNotificationClick}
                      />
                    )}
                  />
                );
              if (prop.redirect)
                return <Redirect from={prop.path} to={prop.to} key={key} />;
          
              return (
                <PropsRoute path={prop.path} component={prop.component} key={key} isDoctor={this.state.isDoctor}
                  setAppState={this.setAppState} appState={this.state.appState} patientData={this.state.patientData} 
                  setPatientData={this.setPatientData} saveState={this.saveState} loadState={this.loadState} />
              );
            })}
          </Switch>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Dashboard;
