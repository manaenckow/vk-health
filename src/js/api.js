import axios from 'axios';

import { dd, getMessage } from './helpers';

axios.defaults.headers.common = {
    Accept: "application/json, text/plain, */*"
}

export default class API {

    async send(url, method = 'GET', action, data = {}) {
        const response = await axios({
            method,
            url: `${url}${action}`,
            data
        }).catch(error => {
            dd('Error API:', error);
            window.showAlert(getMessage('server_offline'));
          //  return { "status": false, "failed": error.response.data.message }
        });
        return response ? response.data : [];
    }

    async CheckPatient(data) {
        const API_URL 	= 'https://beta.gorzdrav.spb.ru/_api/api/';

        let response = await this.send(API_URL, 'GET', `lpu/${data.lpu}/patient?lastName=${data.lastName}&firstName=${data.firstName}${data.middleName && `&middleName=${data.middleName}`}&birthdate=${data.birthdate}T00:00:00Z`, null);
        dd('API: ', 'CheckPatient', response);

        return [response.success, response.message];
    }

    async GetDistrict(districtId) {
        const API_URL 	= 'https://beta.gorzdrav.spb.ru/_api/api/';

        let response = await this.send(API_URL, 'GET', `district/${districtId}/lpu`, null);
        dd('API: ', 'GetDistrict', response.result);

        if(response.success){
          return response.result;
        } else return [];
    }

    async GetSpecs(lpu) {

        const API_URL 	= 'https://beta.gorzdrav.spb.ru/_api/api/';

        let response = await this.send(API_URL, 'GET', `lpu/${lpu}/speciality`, null);
        dd('API: ', 'GetSpecs', response.result);

        if(response.success){
          return response.result;
        } else return [];
    }

    async GetDocs(lpu, specId) {

        const API_URL 	= 'https://beta.gorzdrav.spb.ru/_api/api/';

        let response = await this.send(API_URL, 'GET', `lpu/${lpu}/doctor?specialityId=${specId}`, null);
        dd('API: ', 'GetDocs', response.result);

        if(response.success){
          return response.result;
        } else return [];
    }
    async GetDoc(lpu, docId) {

        const API_URL 	= 'https://beta.gorzdrav.spb.ru/_api/api/';

        let response = await this.send(API_URL, 'GET', `lpu/${lpu}/appointment?doctorId=${docId}`, null);
        dd('API: ', 'GetDoc', response.result);

        if(response.success){
          return response.result;
        } else return [];
    }
    async Up() {

        const API_URL 	= 'https://cors-anywhere.herokuapp.com/https://roan-nigella.glitch.me/';

        let response = await this.send(API_URL, 'GET', ``, null);
        dd('API: ', 'Up', response.result);

        if(response.success){
          return response.result;
        } else return [];
    }
    async GetDistricts() {
      const API_URL 	= 'https://beta.gorzdrav.spb.ru/_api/api/district';
      var response = await this.send(API_URL, 'GET', ``, null);

        dd('API: ', 'GetDistricts', response.result);

        if(response.success){
          return response.result;
        } else return [];
    }

}
