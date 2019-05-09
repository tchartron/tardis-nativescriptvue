<template>
    <Page>
        <ActionBar>
            <GridLayout width="100%" columns="auto, *">
                <Label text="Menu" @tap="$refs.drawer.nativeView.showDrawer()" col="0"/>
                <Label class="pad" text="Timeinator"  col="1"/>
            </GridLayout>
        </ActionBar>

            <RadSideDrawer ref="drawer">
                <StackLayout ~drawerContent backgroundColor="#ffffff">
                    <Label class="drawer-header" text="Drawer"/>

                    <Label class="drawer-item" text="Logout"/>
                    <Label class="drawer-item" text="About"/>
                </StackLayout>

                <FlexboxLayout ~mainContent class="page">
                    <GridLayout rows="auto, *">
                        <StackLayout row="0" class="">
                            <Label class="pad page-title" :text="task.title"></Label>
                            <Label class="pad company-description" :text="task.description"></Label>
                        </StackLayout>

                        <StackLayout row="1" class="form white">
                            <Label col="0" class="" :text="timer.hours"></Label>
                            <Label col="1" class="" :text="timer.minutes"></Label>
                            <Label col="2" class="" :text="timer.seconds"></Label>
                            <Button text="Start" v-show="!timer.isRunning" @tap="start" class="btn btn-primary m-t-20"></Button>
                            <Button text="Stop" v-show="timer.isRunning" @tap="stop" class="btn btn-primary m-t-20"></Button>
                        </StackLayout>

                    </GridLayout>
                </FlexboxLayout>
            </RadSideDrawer>

    </Page>
</template>

<script>
export default {
    props: ['data'],
    data() {
        return {
            task: this.data,
            timer: {
                hours: 0,
                minutes: 0,
                seconds: 0,
                isRunning: false
            },
            interval: null,
            createdTimer: null
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
        start() {
            let context = this;
            this.$backendApi.startTimer(this.task).then((response) => {
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
            this.$backendApi.stopTimer(this.createdTimer, this.task.company_id).then((response) => {
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
        // this.getCompany(this.data)
        console.log(this.task)
    },
    computed: {

    }

};
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .pad {
        text-align: left;
        padding-left: 16px;
    }

    .white {
        color: #ffffff;
    }

    .red {
        color: #ff0000;
    }

    .underline {
        text-decoration: underline;
    }

    .page-title {
        color: #ffffff;
        font-size: 18px;
        text-decoration: underline;
    }

    .form {
        margin-left: 30px;
        margin-right: 30px;
        flex-grow: 2;
        vertical-align: middle;
    }

    .company-description {
        color: #ffffff;
    }

    .drawer-header {
        padding: 50 16 16 16;
        margin-bottom: 16px;
        background-color: #53ba82;
        color: #ffffff;
        font-size: 24px;
    }

    .drawer-item {
        padding: 8 16;
        color: #333333;
        font-size: 16;
    }

    .page {
        align-items: center;
        flex-direction: column;
    }
</style>
