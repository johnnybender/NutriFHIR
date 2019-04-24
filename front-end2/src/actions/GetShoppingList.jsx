import axios from 'axios';

export default async function GetShoppingList() {

    let uri = "https://cs6440-s19-prj057-backend.apps.hdap.gatech.edu/get_patient_shopping_list/3";

    var headers = {
        headers: {
           
        }
    }

    return axios.get(uri, headers);
};