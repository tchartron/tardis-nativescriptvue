// import { Kinvey } from "kinvey-nativescript-sdk";
// Kinvey.init({
//     appKey: "kid_SyY8LYO8M",
//     appSecret: "09282985d7c540f7b076a9c7fd884c77"
// });
//
// import http from 'http';

const httpModule = require("http");


export default class BackendApi {

    isLoggedIn() {
        // return !!Kinvey.User.getActiveUser();
    }

    hello() {
        console.log('hello')
    }

    login(user) {
        // return Kinvey.User.login(user.email, user.password);
        return httpModule.request({
            url: "http://91.165.62.227:47777/api/login",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });
    }

    logout() {
        // return Kinvey.User.logout();
    }

    register(user) {
        // return Kinvey.User.signup({ username: user.email, password: user.password });
    }
}

