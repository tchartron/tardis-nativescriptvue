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
                    <Label class="drawer-header" :text="$appSettings.getString('APP_NAME')"/>

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
                            <Label row="0" class="pad user-name" textWrap="true" :text="'Welcome ' + user.name"></Label>
                        </GridLayout>

                        <FlexboxLayout alignItems="center" class="">
                            <StackLayout class="">
                                <GridLayout rows="auto, *" class="m-l-20 m-r-20 white timer">
                                    <StackLayout row="1" class="input-field" >
                                        <Button :text="company.name" @tap="$goto('company', {company: company, user: user})" class="btn btn-green m-t-20" v-for="company in companies" :key="company.id"></Button>
                                    </StackLayout>
                                </GridLayout>
                            </StackLayout>
                            <ActivityIndicator :busy="processing"></ActivityIndicator>
                        </FlexboxLayout>
                    </StackLayout>
                </FlexboxLayout>
            </RadSideDrawer>

    </Page>
</template>

<script>
const formatDate = require('date-fns/format');
export default {
    data() {
        return {
            today: formatDate(new Date(), "DD/MM/YYYY"),
            companies: [],
            user: {},
            processing: false
        }
    },
    methods: {
        getCompanies() {
            this.processing = true;
            this.$backendApi
                .getCompanies()
                .then((response) => {
                    const result = response.content.toJSON();
                    this.companies = result;
                    this.processing = false;
                    // console.log(result)
                }, (error) => {
                    console.log(error)
            });
        },
        getUser() {
            this.processing = true;
            this.$backendApi
                .getLoggedUser()
                .then((response) => {
                    const result = response.content.toJSON();
                    // console.log(result)
                    this.user = result;
                    this.processing = false;
                }, (error) => {
                    console.log(error)
            });
        }
    },
    mounted() {
        this.getCompanies();
        this.getUser();
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

    .pad {
        text-align: left;
        padding-left: 16px;
    }
    .user-name {
        color: #ffffff;
        font-size: 22px;
        margin-top: 20px;
    }

    .page-title {
        color: #ffffff;
        font-size: 18px;
        text-decoration: underline;
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

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20px;
        color: #333333;
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
