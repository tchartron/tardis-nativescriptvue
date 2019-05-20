// import http from 'http';
// import Vue from 'nativescript-vue'
// import Login from '../components/Login'
import router from './../router/router'
const httpModule = require("tns-core-modules/http");
const appSettings = require("tns-core-modules/application-settings");

////////////////////
// Configurations //
////////////////////
// const remoteAddr = "http://91.165.62.227:47777";
const remoteAddr = "http://192.168.0.52";
// const remoteAddr = "http://192.168.0.24";
const apiPrefix = "/api";
const apiUrl = remoteAddr + apiPrefix;

export default class BackendApi {
    constructor(inst) {
        this.vueNativeInstance = inst;
    }
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
        // console.log(this.vue.prototype.$navigateTo())
        // console.log(Vue.prototype.$navigateTo)
        // const proto = this.vue.prototype;
        // console.log(proto)
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
                //Don't clear all storage we keep information upon restarting app
                appSettings.remove("access_token");
                appSettings.remove("token_type");
                appSettings.remove("expires_in");
                // $goto('login');
                 var options = {
                    clearHistory: true,
                    backstackVisible: true,
                    transition: {
                        name: "fade",
                        duration: 700,
                        curve: "easeIn"
                    }
                }
                this.vueNativeInstance.prototype.$navigateTo(router['login'], options);
        }, (error) => {
            console.log(error)
        });
    }

    getLoggedUser() {
        return httpModule.request({
            url: apiUrl + "/me",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + appSettings.getString("access_token"),
                "Content-Type": "application/json",
            }
        });
    }

    register(user) {
        return httpModule.request({
            url: apiUrl + "/register",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            content: JSON.stringify({
                name: user.name,
                email: user.email,
                password: user.password
            })
        });
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

    getTimers(task) {
        return httpModule.request({
            url: apiUrl + "/companies/" + task.company_id + "/tasks/" + task.id + "/timers",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + appSettings.getString("access_token"),
                "Content-Type": "application/json",
            }
        });
    }

    getServerTime() {
        return httpModule.request({
            url: apiUrl + "/now",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + appSettings.getString("access_token")
            }
        });
    }

    getUser(user_id) {
        return httpModule.request({
            url: apiUrl + "/users/" + user_id,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + appSettings.getString("access_token")
            }
        });
    }

    storeTask(company, task) {
        console.log('call' + apiUrl + "/companies/" + company.id + "/tasks")
        return httpModule.request({
            url: apiUrl + "/companies/" + company.id + "/tasks",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + appSettings.getString("access_token"),
                "Content-Type": "application/json"
            },
            content: JSON.stringify({
                title: task.title,
                description: task.description
            })
        });
    }
}

