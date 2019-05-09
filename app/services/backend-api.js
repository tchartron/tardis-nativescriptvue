// import http from 'http';

const httpModule = require("tns-core-modules/http");
const appSettings = require("tns-core-modules/application-settings");
// const remoteAddr = "http://91.165.62.227:47777";

////////////////////
// Configurations //
////////////////////
const remoteAddr = "http://192.168.0.52";
const apiPrefix = "/api";
const apiUrl = remoteAddr + apiPrefix;

export default class BackendApi {
    ////////
    //API //
    ////////
    isLoggedIn() {
    }

    login(user) {
        return httpModule.request({
            url: apiUrl + "/login",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });
    }

    logout() {
    }

    register(user) {
    }

    //////////////
    //Resources //
    //////////////
    getCompanies() {
        // console.log({"Authorization": "Bearer " + appSettings.getString("access_token")});
        return httpModule.request({
            url: apiUrl + "/companies",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + appSettings.getString("access_token"),
                "Content-Type": "application/json",
            }
        });
    }
    getCompany(company) {
        return httpModule.request({
            url: apiUrl + "/companies/" + company.id,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + appSettings.getString("access_token"),
                "Content-Type": "application/json",
            }
        });
    }

    startTimer(task) {
        return httpModule.request({
            url: apiUrl + "/companies/" + task.company_id + "/tasks/" + task.id + "/timers",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + appSettings.getString("access_token"),
                "Content-Type": "application/json",
            }
        });
    }
    stopTimer() {

    }
     // storeCompany() {

     // }
     // updateCompany() {

     // }
     // destroyCompany() {

     // }
}

