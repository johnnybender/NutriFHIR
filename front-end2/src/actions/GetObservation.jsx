import axios from 'axios';

export default async function GetObservation(appState, nextUrl = null) {

    if (typeof appState.patient_id === 'undefined') {
        let errorMessage =  { code : 404, message : 'no patient id' };
        throw errorMessage;
    }

    //option for non-scoped down view.
    var dest = appState.iss;
    var patient = '/Observation?patient=' + appState.patient_id;
    var vital_loinc_codes = [
        '74728-7',
        '59408-5',
        '3141-9',
        '8287-5',
        '8302-2',
        '8306-3',
        '8310-5',
        '8462-4',
        '8480-6',
        '8867-4',
        '9279-1',
        '3140-1',
        '39156-5'
    ]

    var chol_loinc_codes = [
        '2086-7',
    ]

    //https://www.labcorp.com/test-menu/30441/lipid-panel
    var lipid_panel_codes = [
        '2093-3',
        '2571-8',
        '2085-9',
        '13458-5',
        '13457-7',
        '77202-0'
    ]

    var hemoglobin_h1c = [
        '4548-4' 
    ]

    //todo
    var vitamin_d = [

    ]

    var codes = [].concat.apply([], [vital_loinc_codes, chol_loinc_codes, lipid_panel_codes, hemoglobin_h1c, vitamin_d])
    codes = codes.map((ele, idx) => 'http://loinc.org|'+ele);

    var args = "&_count=100&code=" + codes.join();
    var uri = dest + patient + args;

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