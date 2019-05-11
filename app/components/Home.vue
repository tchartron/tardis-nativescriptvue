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
                    <Label class="drawer-header" :text="$appSettings.getString('APP_NAME')"/>

                    <Label class="drawer-item" @tap="$backendApi.logout()" text="Logout"/>
                    <Label class="drawer-item" text="About"/>
                </StackLayout>

                <FlexboxLayout ~mainContent class="page">
                    <StackLayout class="form">
                        <Label class="pad page-title" text="Available companies :"></Label>

                        <GridLayout rows="auto">
                            <StackLayout row="0" class="input-field" >
                                <Button :text="company.name" @tap="$goto('company', company)" class="btn btn-primary m-t-20" v-for="company in companies" :key="company.id"></Button>
                            </StackLayout>
                        </GridLayout>

                    </StackLayout>
                </FlexboxLayout>
            </RadSideDrawer>

    </Page>
</template>

<script>
export default {
    data() {
        return {
            companies: []
        }
    },
    methods: {
        getCompanies() {
            this.$backendApi
                .getCompanies()
                .then((response) => {
                    const result = response.content.toJSON();
                    this.companies = result;
                    // console.log(result)
                }, (error) => {
                    console.log(error)
            });
        }
    },
    mounted() {
        // this.companies = this.getCompanies();
        // console.log(this.companies)
        this.getCompanies();
    }
    // computed: {
    //     mountCompany() {
    //         return {
    //             props: {
    //                 company: company
    //             }
    //         }
    //     }
    // }

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

    .pad {
        text-align: left;
        padding-left: 16px;
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

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20px;
        color: #333333;
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
