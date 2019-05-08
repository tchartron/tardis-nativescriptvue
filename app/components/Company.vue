<template>
    <Page>
        <ActionBar>
            <GridLayout width="100%" columns="auto, *">
                <Label text="Menu" @tap="$refs.drawer.nativeView.showDrawer()" col="0"/>
                <Label class="title" text="Timeinator"  col="1"/>
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
                        <Label class="title" :text="test"></Label>

                        <GridLayout rows="auto, auto, auto">
                            <StackLayout row="0" class="input-field" >
                                <Button text="" @tap="" class="btn btn-primary m-t-20"></Button>
                                <StackLayout class="hr-light"></StackLayout>
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
            test: "test"
        }
    },
    methods: {
        // getCompanies() {
        //     this.$backendApi
        //         .indexCompanies()
        //         .then((response) => {
        //             const result = response.content.toJSON();
        //             this.companies = result;
        //             console.log(result)
        //             this.companies;
        //         }, (error) => {
        //             console.log(error)
        //     });
        // }
    },
    mounted() {
        // this.getCompanies();
        console.log(this.data.name)
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

    .title {
        text-align: left;
        padding-left: 16px;
    }

    .drawer-header {
        padding: 50 16 16 16;
        margin-bottom: 16;
        background-color: #53ba82;
        color: #ffffff;
        font-size: 24;
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
