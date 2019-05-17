<template>
    <Page>
        <ActionBar>
            <GridLayout width="100%" columns="auto, *, auto">
                <Image class="logo" src="~/assets/images/menu-white.png" @tap="$refs.drawer.nativeView.showDrawer()" width="85px" height="85px"></Image>
                <Label class="app-title" :text="$appSettings.getString('APP_NAME')"  col="1"/>
                <Label class="date" :text="today"  col="2"/>
            </GridLayout>
        </ActionBar>

            <RadSideDrawer ref="drawer">
                <StackLayout ~drawerContent backgroundColor="#ffffff">
                    <Label class="drawer-header" :text="$appSettings.getString('APP_NAME')" />

                    <Label class="drawer-item" @tap="$backendApi.logout()" text="Logout"/>
                    <Label class="drawer-item" text="About"/>

                    <Label class="drawer-info underline" text="User infos"/>
                    <Label class="drawer-info" :text="user.name"/>
                    <Label class="drawer-info" :text="user.email"/>
                    <Label class="drawer-info underline" text="Api infos"/>
                    <Label class="drawer-info" :text="$appSettings.getString('access_token')"/>
                    <Label class="drawer-info" :text="$appSettings.getString('token_type')"/>
                    <Label class="drawer-info" :text="$appSettings.getNumber('expires_in')"/>
                </StackLayout>

                <FlexboxLayout ~mainContent class="page">
                    <StackLayout class="">
                        <GridLayout rows="auto, auto" class="m-l-20 m-r-20">
                            <Label row="0" class="pad task-name" textWrap="true" :text="task.title"></Label>
                            <Label row="1" class="pad task-description" textWrap="true" :text="task.description"></Label>
                        </GridLayout>
                        <StackLayout class="hr-light"></StackLayout>
                        <GridLayout rows="auto, auto, auto" class="m-l-20 m-r-20 m-t-10 m-b-10 user-stats">
                            <Label row="0" class="pad white underline" textWrap="true" text="Your statistics on this task"></Label>
                            <Label row="1" textWrap="true" class="pad white">
                                <FormattedString>
                                    <Span text="Timers : " style="text-decoration: underline;" />
                                    <Span :text="userTaskTimers.length"/>
                                </FormattedString>
                            </Label>
                            <Label row="2" textWrap="true" class="pad white">
                                <FormattedString>
                                    <Span text="Time total : " style="text-decoration: underline;" />
                                    <Span :text="timeSpentByUser.h + ' H ' + timeSpentByUser.m  + ' M ' + timeSpentByUser.s + ' S'"/>
                                </FormattedString>
                            </Label>
                        </GridLayout>
                        <StackLayout class="hr-light"></StackLayout>
                        <FlexboxLayout flexDirection="column" class="m-l-20 m-r-20 m-t-10 m-b-10 user-stats" v-if="otherPeopleWorking.length > 0">
                            <Label text="Also working on this task : " class="pad white underline"/>
                            <Label v-for="userWorking in otherPeopleWorking" class="white" :text="'- ' + userWorking.name + ' (' + userWorking.email  + ')'"/>
                        </FlexboxLayout>
                        <StackLayout class="hr-light"></StackLayout>

                        <FlexboxLayout alignItems="center" class="">
                            <StackLayout class="">
                                <GridLayout columns="*, *, *, *, *" class="m-l-20 m-r-20 white timer">
                                    <Label col="0" class="text-center" :text="leadingZero(timer.hours)"></Label>
                                    <Label col="1" class="text-center" text=":"></Label>
                                    <Label col="2" class="text-center" :text="leadingZero(timer.minutes)"></Label>
                                    <Label col="3" class="text-center" text=":"></Label>
                                    <Label col="4" class="text-center" :text="leadingZero(timer.seconds)"></Label>
                                </GridLayout>
                                <GridLayout rows="auto" class="m-t-30">
                                    <Button row="0" text="Start" v-show="!timer.isRunning" :isEnabled="!processing" @tap="start" class="btn btn-green m-t-20"></Button>
                                    <Button row="0" text="Stop" v-show="timer.isRunning" :isEnabled="!processing" @tap="stop" class="btn btn-green m-t-20"></Button>
                                </GridLayout>
                                <ActivityIndicator :busy="processing"></ActivityIndicator>
                            </StackLayout>
                        </FlexboxLayout>
                    </StackLayout>
                </FlexboxLayout>
            </RadSideDrawer>

    </Page>
</template>

<script>
const diffInSeconds = require('date-fns/difference_in_seconds');
const formatDate = require('date-fns/format');

export default {
    props: ['data'],
    data() {
        return {
            today: formatDate(new Date(), "DD/MM/YYYY"),
            now: new Date(),
            user: this.data.user,
            task: this.data.task,
            timer: {
                hours: 0,
                minutes: 0,
                seconds: 0,
                isRunning: false
            },
            interval: null,
            createdTimer: null,
            processing: false,
            userTaskTimers: [],
            timeSpentByUser: {
                h: 0,
                m: 0,
                s: 0
            },
            otherPeopleWorking: []
        }
    },
    methods: {
        getTaskTimers(task) {
            this.processing = true;
            this.$backendApi
                .getTimers(task)
                .then((response) => {
                    const result = response.content.toJSON();
                    // console.log(result)
                    this.userTaskTimers = this.getUserTaskTimers(result); //filter users only timers
                    // console.log(this.userTaskTimers)
                    let secondsSpentByUser = this.totalSecondsSpent(this.userTaskTimers);
                    // this.userTaskTimers = result;
                    // console.log('SECONDS ' + secondsSpentByUser)
                    // console.log("TIME SPENT" + timeSpentToHms.h + ":" + timeSpentToHms.m + ":" + timeSpentToHms.s)
                    this.timeSpentByUser = this.secondsToHms(secondsSpentByUser)
                    this.processing = false;
                }, (error) => {
                    console.log(error)
            });
        },
        getUserTaskTimers(timers) {
            let userTimers = [];
            // let context = this; // no need if using es6 arrow function
            if(timers.length > 0) {
                timers.forEach((elem, index) => {
                    if(elem.task_id == this.task.id && elem.user_id == this.user.id) {
                        userTimers.push(elem);
                        if(elem.created_at === elem.finished_at) { //timer is running ?
                            let startedAt = new Date(elem.created_at);
                            let secondsFromNow = diffInSeconds(this.now, startedAt);
                            // console.log(secondsFromNow)
                            this.timer.hours = Math.trunc(secondsFromNow / 3600);
                            this.timer.minutes = Math.trunc((secondsFromNow % 3600) / 60);
                            this.timer.seconds = Math.trunc(secondsFromNow % 60);
                            this.timer.isRunning = true;
                            this.interval = setInterval(() => { //using arrow makes us keep 'this' context
                                this.tickTimer();
                            }, 1000);
                            this.createdTimer = elem; // to be able to stop it
                            // this.runningTimer = elem;
                        }
                    } else if (elem.task_id == this.task.id && elem.created_at === elem.finished_at) {
                        this.$backendApi.getUser(elem.user_id)
                        .then((response) => {
                            let result = response.content.toJSON();
                            let found = this.otherPeopleWorking.some(el => el.id === result.id);
                            if(!found) {
                                this.otherPeopleWorking.push(result);
                            }
                            console.log(this.otherPeopleWorking);
                        });
                    }
                });
            }
            return userTimers;
        },
        start() {
            let context = this;
            this.processing = true;
            this.$backendApi.startTimer(this.task).then((response) => {
                const result = response.content.toJSON();
                console.log(result)
                if(result.success) {
                    //visually start timer
                    // console.log('started')
                    this.interval = setInterval(function() {
                        context.tickTimer();
                    }, 1000);
                    this.timer.isRunning = true;
                    this.createdTimer = result.timer;
                    // this.getTaskTimers(this.task); // No need to redo all the things in this function just push the new timer in timer array to update the timers amount
                    this.userTaskTimers.push(this.createdTimer);
                    this.processing = false;
                } else {
                    this.alert(
                        "Something went wrong"
                    );
                }
            });
        },
        tickTimer() {
            this.timer.seconds++;
            if(this.timer.seconds > 59) {
                this.timer.minutes++;
                this.timer.seconds = 0;
                if(this.timer.minutes > 59) {
                    this.timer.hours++;
                    this.timer.minuts = 0;
                }
            }
        },
        stop() {
            this.processing = true;
            this.$backendApi.stopTimer(this.createdTimer, this.task.company_id).then((response) => {
                const result = response.content.toJSON();
                console.log(result)
                if(result.success) {
                    //visually start timer
                    // console.log('stoped')
                    this.timer.isRunning = false;
                    this.timer.seconds = 0;
                    this.timer.minutes = 0;
                    this.timer.hours = 0;
                    clearInterval(this.interval);
                    //Updates user stats on this task
                    this.getTaskTimers(this.task) // To update the information about how many time the user has spent on this task
                    this.processing = false;
                } else {
                    this.alert(
                        "Something went wrong"
                    );
                }
            });
        },
        leadingZero(n) {
            return (n < 10) ? ("0" + n) : n;
        },
        totalSecondsSpent(timers) {
            let totalSecond = 0;
            if(timers.length > 0) {
                // console.log("called")
                timers.forEach((elem, index) => {
                    let created = new Date(elem.created_at);
                    let finished = new Date(elem.finished_at);
                    let secondsBetween = diffInSeconds(finished, created);
                    // console.log("BETWEEN" + secondsBetween)
                    totalSecond += secondsBetween;
                });
            }
            return totalSecond;
        },
        secondsToHms(seconds) {
            let h = seconds / 3600;
            let m = (seconds % 3600) / 60;
            let s = seconds % 60;
            return {s: Math.trunc(s), m: Math.trunc(m), h: Math.trunc(h)};
        }
    },
    mounted() {
        // console.log(this.user.email)
        // this.getCompany(this.data)
        // console.log(this.task)
        this.$backendApi.getServerTime().then((response) => {
            const result = response.content.toJSON();
            if(result.now) {
                this.now = result.now;
                this.getTaskTimers(this.task)
            }
        });
    },
    computed: {
    }
};
</script>

<style scoped>
    ActionBar {
        background-color: #2d2d2d;
        color: #ffffff;
    }

    .app-title {
        color: white;
        font-size: 26px;
        text-align: center;
        margin-left: -15px;
    }

    .timer {
        font-size: 40px;
        font-weight: bold;
    }

    .pad {
        text-align: left;
        padding-left: 16px;
    }

    .white {
        color: #ffffff;
    }

    .text-center {
        text-align: center;
    }

    .user-stats {
        font-size: 16px;
    }

    .underline {
        text-decoration: underline;
    }

    .task-name {
        color: #ffffff;
        font-size: 22px;
    }

    .task-description {
        color: #ffffff;
        margin-bottom: 20px;
        font-style: italic;
    }

    .form {
        margin-left: 30px;
        margin-right: 30px;
        flex-grow: 2;
        vertical-align: middle;
    }

    .drawer-header {
        padding: 50 16 16 16;
        margin-bottom: 16px;
        background-color: #2d2d2d;
        color: #ffffff;
        font-size: 24px;
    }

    .drawer-item {
        padding: 8 16;
        color: #333333;
        font-size: 18px;
        font-weight: bold;
    }

    .drawer-info {
        padding: 8 16;
        color: #333333;
        font-size: 16px;
    }

    .page {
        align-items: center;
        flex-direction: column;
    }

    .date {
        color: #ffffff;
        text-align: right;
        font-size: 16px;
    }
</style>
