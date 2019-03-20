import React, { Component } from "react";
import axios from 'axios';
import qs from 'qs';
import { Route, Redirect } from 'react-router'

class Summary extends Component {

  constructor(props) {
    super(props);

    this.state = {
      done: false
    }
    this.props.loadState();

    const parsed = qs.parse(this.props.location.search.replace(/^\?/, ''));

    var code = parsed.code
    var token_uri = this.props.appState.token_uri;

    var data = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: props.appState.redirect_uri,
      client_id: props.appState.client_id
    }

    var headers = {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }

    var payload = 'grant_type=' + data.grant_type + '&code=' + data.code + '&redirect_uri=' + data.redirect_uri + '&client_id=' + data.client_id;
    let self = this;
    if (code) {
      axios.post(token_uri, payload, { headers: headers }

      ).then(function (response) {
        var patientId = response.data.patient;
        props.setAppState('access_token', response.data.access_token)
        props.setAppState('id_token', response.data.id_token)
        props.setAppState('refresh_token', response.data.refresh_token)
        props.setAppState('tenant', response.data.tenant)
        props.setPatientData('patient_id', patientId);
        props.saveState();
        self.setState({ done: true })
        
      }).catch(function (err) {
        console.log('failure to solidify code');
        console.log(err);
      });
    } else {
      console.log('no code at all, shouldnt be here');
    }
  }
  render() {
    {if (this.state.done)  
      return (<Redirect to="/dashboard"/>);}
    return (
      
      <div>
        loading...
        </div>
    );
  }
}

export default Summary;
