<template>
  <div id="app">
  <v-app>
      <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
          <div>
              <v-tabs v-model="tab" show-arrows background-color="deep-purple accent-4" icons-and-text dark grow>
                  <v-tabs-slider color="purple darken-4"></v-tabs-slider>
                  <v-tab>
                      <v-icon large>{{ tabs[0].icon }}</v-icon>
                      <div class="caption py-1">{{ tabs[0].name }}</div>
                  </v-tab>
                  <v-tab-item>
                      <v-card class="px-4">
                          <v-card-text>
                              <v-form ref="loginForm" v-model="valid" lazy-validation>
                                  <v-row>
                                      <v-col cols="12">
                                          <v-text-field v-model="credentials.email" id="email" :rules="rules.emailRules" label="Email" required></v-text-field>
                                      </v-col>
                                      <v-col cols="12">
                                          <v-text-field v-model="credentials.password" id="password" :rules="rules.password" :append-icon="show1?'eye':'eye-off'" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 4 characters" counter @click:append="show1 = !show1"></v-text-field>
                                      </v-col>
                                      <v-col class="d-flex" cols="12" sm="6" xsm="12">
                                      </v-col>
                                      <v-spacer></v-spacer>
                                      <v-col class="d-flex" cols="12" sm="3" xsm="12">
                                            <v-btn x-large block id="registerButton" color="" @click="sign_up">Sign Up</v-btn>
                                        </v-col>
                                      <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                                          <v-btn x-large block id="loginButton" :disabled="!valid" color="success" @click="login"> Login </v-btn>
                                      </v-col>
                                  </v-row>
                              </v-form>
                          </v-card-text>
                      </v-card>
                  </v-tab-item>
              </v-tabs>
          </div>
      </v-dialog>
  </v-app>
</div>
</template>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css"></link>
<script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
import swal from 'sweetalert2';
import router from '../../router';
import axios from 'axios';
window.swal = swal;
export default {
name: 'Auth',
data: () => ({
  backend_url: 'http://127.0.0.1:8000/',
  credentials: {},
  dialog: true,
  tab: 0,
  tabs: [
      {name:"Login", icon:"mdi-account"},
  ],
  valid: true,
  loading:false,

  show1: false,
  rules: {
        // username: [
        //   v => !!v || "Username is required",
        //   v => (v && v.length > 3) || "A username must be more than 3 characters long",
        //   v => /^[a-z0-9_]+$/.test(v) || "A username can only contain letters and digits"
        // ],
        password: [
          v => !!v || "Password is required",
          v => (v && v.length > 3) || "The password must be longer than 3 characters"
        ],
        emailRules: [
          v => !!v || "Required",
          v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
      }
}),
methods: {
  login() {
          if (this.$refs.loginForm.validate()) {
            this.loading = true;
            axios.post(this.backend_url + 'api/token/', this.credentials).then(res => {
              this.$session.start();
              this.$session.set('access', res.data['access']);
              this.$session.set('refresh', res.data['refresh'])
              const config = {
                  headers: { Authorization: 'Bearer ' + res.data['access']}
              };
              axios.get(this.backend_url + 'api/get_info_by_token/' + res.data['refresh'], config)
              .then(res => { 

                this.$session.set('username', res.data['username']);
                this.$session.set('email', res.data['email']);
                this.$session.set('user_id', res.data['user_id']);
                this.$session.set('sex', res.data['sex']);
                this.$session.set('first_name', res.data['first_name']);
                this.$session.set('last_name', res.data['last_name']);
                this.$session.set('date_of_birth', res.data['date_of_birth']);

                router.push('/');
                swal.fire({
                  type: 'success',
                  title: 'Logged in!',
                  text: 'You are successfully logged in!',
                  showConfirmButton:true,
                  showCloseButton:false,
                  timer:3000,
                  icon: "success"
                })
              }).catch(e => {
                this.loading = false;
                console.log(e);
                swal.fire({
                  type: 'warning',
                  title: 'Error',
                  text: 'Something wrong while getting user by Bearer Token!',
                  showConfirmButton:true,
                  showCloseButton:false,
                  timer:3000,
                  icon: "error"
                })
              })
            }).catch(e => {
              this.loading = false;
              console.log(e);
              swal.fire({
                type: 'warning',
                title: 'Error',
                text: 'Wrong email or password',
                showConfirmButton:true,
                showCloseButton:false,
                timer:3000,
                icon: "error"
              })
            })
          }
      },
      sign_up() {
        router.push('/register');
      }
},
}
</script>