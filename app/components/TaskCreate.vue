<template>
    <Page actionBarHidden="true">
        <FlexboxLayout class="page">
            <StackLayout class="form">
                <Image class="logo" src="~/assets/images/logo-web-white.png"></Image>
                <Label class="header" :text="$appSettings.getString('APP_NAME')"></Label>

                <GridLayout rows="auto, auto, auto">

                    <StackLayout row="0" class="input-field">
                        <TextField class="input" ref="name" :isEnabled="!processing"
                            hint="Name" v-model="task.name"
                            returnKeyType="next" @returnPress="focusDescription"></TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <StackLayout row="1" class="input-field">
                        <TextView class="input" ref="description" hint="Description" :isEnabled="!processing"
                            autocorrect="false" v-model="task.description"
                            returnKeyType="next" @returnPress="focusWatch"></TextView>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <StackLayout row="2" class="input-field">
                        <TextField class="input" ref="watch" :isEnabled="!processing"
                            hint="Watch FS" v-model="task.watch"
                            :returnKeyType"done"></TextField>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>

                    <ActivityIndicator rowSpan="3" :busy="processing"></ActivityIndicator>
                </GridLayout>

                <Button :text="Create Task" :isEnabled="!processing"
                    @tap="submit" class="btn btn-green m-t-20"></Button>
                <Label v-show="isLoggingIn" text="Forgot your password?"
                    class="login-label" @tap="createTask()"></Label>
            </StackLayout>
        </FlexboxLayout>
    </Page>
</template>

<script>
    import { containsKey } from "../services/helpers";

    export default {
        data() {
            return {
                isLoggingIn: true,
                processing: false,
                user: {
                    name: "",
                    email: "thomas.chartron@gmail.com",
                    password: "thomasthomas",
                    confirmPassword: "thomasthomas"
                }
            };
        },
        methods: {
            createTask() {
                if (!this.task.name || !this.task.description) { //test legth 3 for name and 10 for description
                    this.alert("Please provide both an task name and description.");
                    return;
                }
                this.processing = true;
                this.$backendApi



                    .login(this.user)
                    .then((response) => {
                        const result = response.content.toJSON();
                        if(result.error) {
                            this.alert(
                                "Unfortunately we could not find your account."
                            );
                            this.processing = false
                        } else {
                            //Setting authentication data
                            this.$appSettings.setString("access_token", result.access_token);
                            this.$appSettings.setString("token_type", result.token_type);
                            this.$appSettings.setNumber("expires_in", result.expires_in);

                            this.processing = false
                            this.$goto('home')
                        }
                    }, (error) => {
                        console.log(error)
                    });
            },

            focusDescription() {
                this.$refs.password.nativeView.focus();
            },
            focusWatch() {
                this.$refs.confirmPassword.nativeView.focus();
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
        //     containsKey(Object, 'string');
        // }
    };
</script>

<style scoped>
    .page {
        align-items: center;
        flex-direction: column;
    }

    .form {
        margin-left: 30px;
        margin-right: 30px;
        flex-grow: 2;
        vertical-align: middle;
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

    .btn-primary {
        margin: 30 5 15 5;
    }

    .login-label {
        horizontal-align: center;
        color: #A8A8A8;
        font-size: 16;
    }

    .sign-up-label {
        margin-bottom: 20;
    }

    .bold {
        color: #000000;
    }
</style>
