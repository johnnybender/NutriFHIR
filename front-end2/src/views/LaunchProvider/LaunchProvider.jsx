import React, { Component } from "react";
import axios from 'axios';
import qs from 'qs';

class LaunchProvider extends Component {

    constructor(props) {
        super(props);

        const parsed = qs.parse(this.props.location.search.replace(/^\?/, ''));
        const iss = parsed.iss
        const launch = parsed.launch

        var _guid = function () {
            var currentDateMilliseconds = new Date().getTime();
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (currentChar) {
                var randomChar = ((currentDateMilliseconds + Math.random() * 16) % 16) | 0;
                currentDateMilliseconds = Math.floor(currentDateMilliseconds / 16);
                return (currentChar === 'x' ? randomChar : (randomChar & (0x7 | 0x8))).toString(16);
            });
        }

        this.props.setAppState('iss', iss);
        this.props.setAppState('launch', encodeURIComponent(launch));
        this.props.setAppState('client_id', 'bd54594a-bda3-4f4d-9e6b-892ffc5a3811');
        this.props.setAppState('scope', 'patient/DocumentReference.read patient/Procedure.read patient/Patient.read patient/Observation.read patient/Condition.read patient/MedicationOrder.read patient/MedicationStatement.read patient/Encounter.read patient/AllergyIntolerance.read launch online_access openid profile')
        this.props.setAppState('redirect_uri', encodeURIComponent('http://127.0.0.1:6001/summary'));
        this.props.setAppState('aud', encodeURIComponent(iss));
        this.props.setAppState('state', encodeURIComponent(_guid()));

        var state = {
            'iss': this.props.appState.iss,
            'launch': this.props.appState.launch,
            'client_id': this.props.appState.client_id,
            'scope': this.props.appState.scope,
            'redirect_uri': this.props.appState.redirect_uri,
            'aud': this.props.appState.aud,
            'state': this.props.appState.state
        }

        var conformance_uri = iss + '/metadata'

        if (iss) {
            axios.get(conformance_uri, {
            })
                .then(function (response) {
                    var conformance_list = response.data.rest[0].security.extension[0].extension;
                    conformance_list.forEach(function (arg, index, array) {
                        if (arg.url === "register") {
                            props.setAppState('register_uri', arg.valueUri);
                        } else if (arg.url === "authorize") {
                            props.setAppState('authorize_uri', arg.valueUri);
                        } else if (arg.url === "token") {
                            props.setAppState('token_uri', arg.valueUri);
                        }
                    });

                    var redirect_to = props.appState.authorize_uri + "?client_id=" + state.client_id + "&response_type=code&scope=" + state.scope + "&redirect_uri=" + state.redirect_uri + "&state=" + state.state + "&aud=" + state.aud + "&launch=" + launch;
                    props.saveState();
                    window.location.href = redirect_to;
                }).catch(function (err) {
                    console.log('error');
                    console.log(err);
                });

        } else {
            console.log("no ISS, this is bad");
        }
    }
    render() {
        return (
            <div className="content">
                <p>Loading...</p>
            </div>
        );
    }
}

export default LaunchProvider;