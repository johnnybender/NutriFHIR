import axios from 'axios';

export default async function GetAllergies(patientData, appState) {
    var dest = appState.iss;
    var patient = '/AllergyIntolerance?patient=' + patientData.patient_id;
    var uri = dest + patient;

    var headers = {
        headers: {
            'Authorization': 'Bearer ' + appState.access_token
        }
    }

    return axios.get(uri, headers);
};