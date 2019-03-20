import axios from 'axios';

export default async function GetObservation(patientData, appState, nextUrl) {
    var dest = appState.iss;
    var patient = '/Observation?patient=' + patientData.patient_id;
    var uri = dest + patient;

    if (nextUrl !== null) {
        uri = nextUrl;
    }

    var headers = {
        headers: {
            'Authorization': 'Bearer ' + appState.access_token
        }
    }

    return axios.get(uri, headers);
};