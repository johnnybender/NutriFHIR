import axios from 'axios';

export default async function GetClinicalNotes(appState) {
    if (typeof appState.patient_id === 'undefined') {
        let errorMessage =  { code : 404, message : 'no patient id' };
        throw errorMessage;
    }

    var dest = appState.iss;
    var patient = '/DocumentReference?patient=' + appState.patient_id;
    var uri = dest + patient;

    var headers = {
        headers: {
            'Authorization': 'Bearer ' + appState.access_token
        }
    }

    return axios.get(uri, headers);
};