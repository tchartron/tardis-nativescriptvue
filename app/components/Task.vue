<template>
    <Page>
        <ActionBar>
            <GridLayout width="100%" columns="auto, *">
                <Image class="logo" src="~/assets/images/menu-white.png" @tap="$refs.drawer.nativeView.showDrawer()" width="85px" height="85px"></Image>
                <Label class="app-title" :text="$appSettings.getString('APP_NAME')"  col="1"/>
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

                        <FlexboxLayout alignItems="center" class="">
                            <StackLayout class="">
                                <GridLayout columns="*, *, *, *, *" class="m-l-20 m-r-20 white timer">
                                    <Label col="0" class="text-center" :text="timer.hours"></Label>
                                    <Label col="1" class="text-center" text=":"></Label>
                                    <Label col="2" class="text-center" :text="timer.minutes"></Label>
                                    <Label col="3" class="text-center" text=":"></Label>
                                    <Label col="4" class="text-center" :text="timer.seconds"></Label>
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
export default {
    props: ['data'],
    data() {
        return {
            // user: {},
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
            user: this.data.user
        }
    },
    methods: {
        //Do we really want to display all timer ? not for now ...
        // getTimers(task) {
        //     this.$backendApi
        //         .getCompany(company)
        //         .then((response) => {
        //             const result = response.content.toJSON();
        //             this.company = result;
        //             console.log(result)
        //         }, (error) => {
        //             console.log(error)
        //     });
        // }
        // runningTimer() {
        //     this.$backendApi
        //         .getLoggedUser()
        //         .then((response) => {
        //             const result = response.content.toJSON();
        //             console.log(result)
        //             this.user = result;
        //         }, (error) => {
        //             console.log(error)
        //     });
        //     this.$backendApi
        //         .getRunningTimers(this.task)
        //         .then((response) => {
        //             const result = response.content.toJSON();
        //             console.log(result)
        //             this.user = result;
        //         }, (error) => {
        //             console.log(error)
        //     });
        // }
        start() {
            let context = this;
            this.processing = true;
            this.$backendApi.startTimer(this.task).then((response) => {
                this.processing = false;
                const result = response.content.toJSON();
                console.log(result)
                if(result.success) {
                    //visually start timer
                    console.log('started')
                    this.interval = setInterval(function() {
                        context.tickTimer();
                    }, 1000);
                    this.timer.isRunning = true;
                    this.createdTimer = result.timer;
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
                this.processing = false;
                const result = response.content.toJSON();
                console.log(result)
                if(result.success) {
                    //visually start timer
                    console.log('stoped')
                    this.timer.isRunning = false;
                    this.timer.seconds = 0;
                    this.timer.minutes = 0;
                    this.timer.hours = 0;
                    clearInterval(this.interval);
                } else {
                    this.alert(
                        "Something went wrong"
                    );
                }
            });
        }
    },
    mounted() {
        // console.log(this.user.email)
        // this.getCompany(this.data)
        console.log(this.task)
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


    .underline {
        text-decoration: underline;
    }

    .task-name {
        color: #ffffff;
        font-size: 22px;
        text-decoration: underline;
    }

    .task-description {
        color: #ffffff;
        margin-bottom: 20px;
        text-decoration: italic;
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
</style>
