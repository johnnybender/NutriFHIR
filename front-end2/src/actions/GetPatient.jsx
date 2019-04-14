import axios from 'axios';

export default async function GetPatient(appState) {
    var dest = appState.iss;
    var patient = '/Patient/' + appState.patient_id;
    var uri = dest + patient;

    if (typeof appState.patient_id === 'undefined') {
        let errorMessage =  { code : 404, message : 'no patient id' };
        throw errorMessage;
    }

    if (appState.test === true) {
        let iss = 'https://hapi.fhir.org/baseDstu3/Patient/'
        let patient_id =  708511
        uri = iss + patient_id; 
    }

    var headers = {
        headers: {
            'Authorization': 'Bearer ' + appState.access_token
        }
    }

    return axios.get(uri, headers);
};