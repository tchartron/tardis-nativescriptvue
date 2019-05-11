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
                </StackLayout>

                <FlexboxLayout ~mainContent class="page">
                    <StackLayout class="form">
                        <Label class="pad company-name" textWrap="true" :text="company.name"></Label>
                        <Label class="pad company-description" textWrap="true" :text="company.description"></Label>

                        <GridLayout rows="auto, *">
                            <StackLayout row="0" class="pad">
                                <Label textWrap="true" class="pad red" v-if="company.tasks && !company.tasks.length" text="No task found for this company please create a task first"></Label>
                                <Label row="0" class="white" v-if="company.tasks && company.tasks.length" :text="company.name + ' task list'" />
                            </StackLayout>
                            <StackLayout row="1" class="pad m-t-20">
                                <ListView row="1" class="list-group" for="task in company.tasks" separatorColor="white">
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
                                                    <Button row="0" text="Go" @tap="$goto('task', {task: task, user: user})" class="btn btn-primary m-t-20 text-center"></Button>
                                                </GridLayout>
                                            </StackLayout>
                                        </GridLayout>
                                    </v-template>
                                </ListView>
                            </StackLayout>
                        </GridLayout>

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
            company: {},
            user: this.data.user
        }
    },
    methods: {
        getCompanyAndTasks(company) { //We fetch company again to have its tasks
            this.$backendApi
                .getCompany(company)
                .then((response) => {
                    const result = response.content.toJSON();
                    this.company = result;
                    console.log(result)
                }, (error) => {
                    console.log(error)
            });
        }
    },
    mounted() {
        // console.log(this.user.name)
        // this.getCompanies();
        // console.log(this.data.name)
        // this.company = this.data;
        this.getCompanyAndTasks(this.data.company)
    },
    computed: {
        // mountCompany(company) {
        //     return {
        //         props: {
        //             company: company
        //         }
        //     }
        // }
    }

};
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
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
