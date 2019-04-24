import React, { Component } from "react";
import { Switch, Redirect } from "react-router-dom";
import axios from 'axios';

import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import PropsRoute from 'components/Routes/PropsRoute';

import dashboardRoutes from "routes/dashboard.jsx";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleDoctorToggle = this.handleDoctorToggle.bind(this);
    this.setAppState = this.setAppState.bind(this);
    this.saveState = this.saveState.bind(this);
    this.loadState = this.loadState.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.getAppState = this.getAppState.bind(this);
    this.state = {
      isDoctor: false,
      patientData: {},
      appState: {},
      patientName: 'Dummy, Dummy',
    };
  }

  saveState = () => {
    sessionStorage.setItem("appState", JSON.stringify(this.state.appState));
  }

  loadState = () => {
    var appState = sessionStorage.getItem("appState");
    appState = JSON.parse(appState);
    if (appState) {
      Object.keys(appState).forEach( (key) => {
        this.setAppState(key, appState[key]);
      });
    }
  }

  getAppState = () => {
    var appState = sessionStorage.getItem("appState");
    return JSON.parse(appState);
  }

  refreshToken = async () => {
    var appState = sessionStorage.getItem("appState");
    appState = JSON.parse(appState);
    if (appState === null) {
      this.setAppState('init', '');
      return
    }
    if (typeof appState.patient_name === 'undefined') {
      this.setAppState('patient_name', 'Dummy, Dummy');
    }
    let refreshToken = appState['refresh_token'];
    let token_uri = appState['token_uri']
    var headers = {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    var payload = 'grant_type=refresh_token&refresh_token=' + refreshToken;
    await axios.post(token_uri, payload, { headers: headers })
      .then(async (response) => {
        this.setAppState('access_token', response.data.access_token)
        this.setAppState('id_token', response.data.id_token)
        this.saveState();
        return true;
      }).catch(async (error) => {
        return false;
      })
  }

  setAppState = (key, value) => {
    var newAppState = this.state.appState;
    newAppState[key] = value;
    this.setState({ appState: newAppState })
    this.saveState();
  }
  handleDoctorToggle = () => {
    var isDoctor = this.state.isDoctor;
    this.setState({ isDoctor: !isDoctor })
  }

  componentDidMount() {
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
        <Sidebar {...this.props} handleDoctorToggle={this.handleDoctorToggle} />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <Header {...this.props} handleDoctorToggle={this.handleDoctorToggle} appState={this.state.appState} />
          <Switch>
            {dashboardRoutes.map((prop, key) => {
              if (prop.redirect)
                return <Redirect from={prop.path} to={prop.to} key={key} />;
              return (
                <PropsRoute path={prop.path} component={prop.component} key={key} isDoctor={this.state.isDoctor}
                  setAppState={this.setAppState} appState={this.state.appState} patientData={this.state.patientData}
                  saveState={this.saveState} loadState={this.loadState}
                  refreshToken={this.refreshToken} getAppState={this.getAppState} />
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
