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
                        <Label class="pad company-name" textWrap="true" :text="company.name"></Label>
                        <Label class="pad company-description" textWrap="true" :text="company.description"></Label>

                        <GridLayout rows="auto, *">
                            <StackLayout row="0" class="pad">
                                <Label textWrap="true" class="pad red" v-if="companyAndTasks.tasks && !companyAndTasks.tasks.length" text="No task found for this company please create a task first"></Label>
                                <Label row="0" class="white" v-if="companyAndTasks.tasks && companyAndTasks.tasks.length" :text="companyAndTasks.name + ' task list'" />
                            </StackLayout>
                            <StackLayout row="1" class="pad m-t-20">
                                <ListView class="list-group" for="task in companyAndTasks.tasks" separatorColor="white">
                                    <v-template>
                                        <GridLayout columns="2*, *" class="white">
                                            <StackLayout col="0" class="">
                                                <GridLayout rows="auto, auto, auto" class="white">
                                                    <Label row="0" col="0" :text="task.id" class=""/>
                                                    <Label row="1" col="0" :text="task.title" textWrap="true"/>
                                                    <Label row="3" col="0" :text="task.description" textWrap="true"/>
                                                </GridLayout>
                                            </StackLayout>
                                            <StackLayout col="1">
                                                <GridLayout rows="*" class="white">
                                                    <Button row="0" text="Go" @tap="$goto('task', {task: task, user: user})" class="btn btn-green m-t-20 text-center"></Button>
                                                </GridLayout>
                                            </StackLayout>
                                        </GridLayout>
                                    </v-template>
                                </ListView>
                            </StackLayout>
                            <ActivityIndicator :busy="processing"></ActivityIndicator>
                        </GridLayout>

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
            user: this.data.user,
            company: this.data.company,
            companyAndTasks: {},
            processing: false
        }
    },
    methods: {
        getCompanyAndTasks(company) { //We fetch company again to have its tasks
            this.processing = true;
            this.$backendApi
                .getCompany(company)
                .then((response) => {
                    const result = response.content.toJSON();
                    this.companyAndTasks = result;
                    this.processing = false;
                    // console.log(result)
                }, (error) => {
                    console.log(error)
            });
        }
    },
    mounted() {
        this.getCompanyAndTasks(this.data.company)
    },
    computed: {
    }
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

    .text-center {
        text-align: center;
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

    .form {
        margin-left: 30px;
        margin-right: 30px;
        flex-grow: 2;
        vertical-align: middle;
    }

    .company-name {
        color: #ffffff;
        font-size: 22px;
        text-decoration: underline;
    }

    .company-description {
        color: #ffffff;
        margin-bottom: 20px;
        font-style: italic;
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
</style>
