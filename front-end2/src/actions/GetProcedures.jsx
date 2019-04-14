import axios from 'axios';

export default async function GetProcedures(appState) {
    var dest = appState.iss;
    var patient = '/Procedure?patient=' + appState.patient_id;
    var uri = dest + patient;

    if (typeof appState.patient_id === 'undefined') {
        let errorMessage =  { code : 404, message : 'no patient id' };
        throw errorMessage;
    }

    var headers = {
        headers: {
            'Authorization': 'Bearer ' + appState.access_token
        }
    }

    return axios.get(uri, headers);
};