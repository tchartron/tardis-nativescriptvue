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
                    <StackLayout class="form">
                        <Label class="pad page-title" :text="data.name"></Label>
                        <Label class="pad company-description" :text="data.description"></Label>

                        <GridLayout rows="auto, *">
                            <StackLayout row="0" class="">
                                <Label textWrap="true" class="pad red" v-if="company.tasks && !company.tasks.length" text="No task found for this company please create a task first"></Label>
                                <Label row="0" class="white underline" v-if="company.tasks && company.tasks.length" text="Task list : " />
                            </StackLayout>
                            <StackLayout row="1" class="">
                                <ListView row="1" class="list-group" v-for="task in company.tasks" separatorColor="white">
                                    <v-template>
                                        <GridLayout rows="auto, auto, auto" columns="2*, *" class="white">
                                            <Label row="0" col="0" :text="task.id" class=""/>
                                            <Label row="1" col="0" :text="task.title" textWrap="true"/>
                                            <Label row="3" col="0" :text="task.description" textWrap="true"/>
                                            <Button col="1" text="Go" @tap="$goto('task', task)" class="btn btn-primary m-t-20"></Button>
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
            company: {}
        }
    },
    methods: {
        getCompany(company) { //We fetch company again to have its tasks
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
        // this.getCompanies();
        // console.log(this.data.name)
        // this.company = this.data;
        this.getCompany(this.data)
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
