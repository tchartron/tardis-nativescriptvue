// import http from 'http';
import Vue from 'nativescript-vue'
import Login from '../components/Login'
const httpModule = require("tns-core-modules/http");
const appSettings = require("tns-core-modules/application-settings");

////////////////////
// Configurations //
////////////////////
// const remoteAddr = "http://192.168.0.52";
const remoteAddr = "http://91.165.62.227:47777";
const apiPrefix = "/api";
const apiUrl = remoteAddr + apiPrefix;

export default class BackendApi {
    ////////
    //API //
    ////////
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
        console.log('pressed')
        httpModule.request({
            url: apiUrl + "/logout",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + appSettings.getString("access_token"),
                "Content-Type": "application/json",
            }
        }).then((response) => {
            const result = response.content.toJSON();
            console.log(result)
            if(result.message) {
                console.log('yay')
                Vue.navigateTo(Login);
                appSettings.clear();
                // $goto('login');
            }
        }, (error) => {
            console.log(error)
            // this.processing = false;
            this.alert(
                "Something went wrong"
            );
        });
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
    stopTimer(timer, companyId) {
        return httpModule.request({
            url: apiUrl + "/companies/" + companyId + "/tasks/" + timer.task_id + "/timers/" + timer.id,
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + appSettings.getString("access_token"),
                "Content-Type": "application/json",
            }
        });
    }
     // storeCompany() {

     // }
     // updateCompany() {

     // }
     // destroyCompany() {

     // }
}

