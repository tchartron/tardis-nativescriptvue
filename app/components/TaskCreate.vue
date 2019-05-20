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
                    <GridLayout rows="auto" columns="auto, *" class="dark-bg">
                        <Label col="0" row="0" class="drawer-header" :text="$appSettings.getString('APP_NAME')"/>
                        <Image col="1" stretch="aspectFit" width="40%" src="~/assets/images/logo-web-white.png"></Image>
                    </GridLayout>

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
                    <StackLayout class="form">
                        <GridLayout rows="auto, auto, auto">
                            <Label row="0" class="title" text="Create a new task" />
                            <StackLayout row="1" class="input-field">
                                <TextField class="input" ref="title" :isEnabled="!processing"
                                    hint="Title" v-model="task.title"
                                    returnKeyType="next" @returnPress="focusDescription"></TextField>
                                <StackLayout class="hr-light"></StackLayout>
                            </StackLayout>

                            <StackLayout row="2" class="input-field">
                                <TextView class="input" ref="description" hint="Description" :isEnabled="!processing"
                                    autocorrect="false" v-model="task.description"
                                    returnKeyType="done"></TextView>
                                <StackLayout class="hr-light"></StackLayout>
                            </StackLayout>

                            <ActivityIndicator rowSpan="3" :busy="processing"></ActivityIndicator>
                        </GridLayout>
                        <Button row="0" text="Create task" @tap="createTask(company, task)" class="btn btn-green m-t-20 text-center"></Button>
                    </StackLayout>
                </FlexboxLayout>
            </RadSideDrawer>
    </Page>
</template>

<script>
    const formatDate = require('date-fns/format');
    export default {
        props: ['data'],
        data() {
            return {
                today: formatDate(new Date(), "DD/MM/YYYY"),
                processing: false,
                user: this.data.user,
                company: this.data.company,
                task: {}
            };
        },
        methods: {
            createTask(company, task) {
                if (!this.task.title || !this.task.description) { //test legth 3 for name and 10 for description
                    this.alert("Please provide both an task title and description.");
                    return;
                }
                this.processing = true;
                this.$backendApi
                .storeTask(company, task)
                .then((response) => {
                    const result = response.content.toJSON();
                    console.log(result)
                    if(result.error) {
                        this.alert(
                            "Something went wrong while adding the task."
                        );
                        this.processing = false
                    } else {
                        this.processing = false
                        this.$goto('task', {task: result, user: this.user})
                    }
                }, (error) => {
                    console.log(error)
                });
            },

            focusDescription() {
                this.$refs.description.nativeView.focus();
            },

            alert(message) {
                return alert({
                    title: "WEB Timer",
                    okButtonText: "OK",
                    message: message
                });
            }
        }
        // mounted: function() {
        //     // console.log(this.user)
        // }
    };
</script>

<style scoped>
    ActionBar {
        background-color: #303030;
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

    .title {
        color: #ffffff;
        font-size: 22px;
        text-align: center;
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

    .task-owner {
        color: #ffffff;
        margin-bottom: 16px;
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
        background-color: #303030;
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
       .logo {
        margin-bottom: 12px;
        height: 400px;
    }

    .header {
        horizontal-align: center;
        font-size: 25;
        font-weight: 600;
        margin-bottom: 70;
        text-align: center;
        color: #ffffff;
    }

    .input-field {
        margin-bottom: 25;
    }

    .input {
        font-size: 18;
        placeholder-color: #A8A8A8;
        color: #ffffff;
    }

    .input:disabled {
        background-color: white;
        opacity: 0.5;
    }
</style>
