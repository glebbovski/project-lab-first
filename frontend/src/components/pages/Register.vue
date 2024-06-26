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
                                <v-form ref="registerForm" v-model="valid" lazy-validation>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="firstName" id="firstNameInput" :rules="[rules.required]" label="First Name" maxlength="20" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="lastName" id="lastNameInput" :rules="[rules.required]" label="Last Name" maxlength="20" required></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="username" id="usernameInput" :rules="[rules.required]" label="Username" maxlength="20" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="email" id="emailInput" :rules="emailRules" label="E-mail" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="password" id="passwordInput" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 4 characters" counter @click:append="show1 = !show1"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field block v-model="verify" id="verifyInput" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, passwordMatch]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Confirm Password" counter @click:append="show1 = !show1"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                          <v-select id="sexSelect"
                                              label="Sex"
                                              v-model="sex"
                                              :items="['Male', 'Female']"
                                          ></v-select>
                                          <v-menu
                                            v-model="fromDateMenu"
                                            :close-on-content-click="false"
                                            :rules="[rules.required]"
                                            :nudge-right="40"
                                            transition="scale-transition"
                                            offset-y
                                            max-width="290px"
                                            min-width="290px"
                                          >
                                            <template v-slot:activator="{ on }">
                                              <v-text-field id="dateMenu"
                                                label="Date of birth"
                                                readonly
                                                :rules="[rules.required]"
                                                :value="fromDateDisp"
                                                v-on="on"
                                              ></v-text-field>
                                            </template>
                                            <v-date-picker
                                              locale="en-in"
                                              :min="minDate"
                                              :max="maxDate"
                                              :rules="[rules.required]"
                                              v-model="fromDateVal"
                                              no-title
                                              @input="fromDateMenu = false"
                                            ></v-date-picker>
                                        </v-menu>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col class="d-flex mr-auto" cols="12" sm="3" xsm="12">
                                            <v-btn x-large block color="" @click="sign_in" id="goToLogin">Sign In</v-btn>
                                        </v-col>
                                        <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                                            <v-btn x-large block :disabled="!valid" color="success" @click="validate_and_register" id="registerButton">Register</v-btn>
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

<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.18/vue.min.js"></script> -->

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css"></link>
<script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
import router from '../../router';
import axios from 'axios';
import swal from 'sweetalert2';
export default {
  name: 'Register',
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    },
    fromDateDisp() {
        return this.fromDateVal;
        // format date, apply validations, etc. Example below.
        // return this.fromDateVal ? this.formatDate(this.fromDateVal) : "";
    },
  },
  methods: {
    validate_and_register() {
      if (this.$refs.registerForm.validate()) {
        
        const user_info = {
              "first_name": this.firstName,
              "last_name": this.lastName,
              "username": this.username,
              "email": this.email,
              "password": this.password,
              "password2": this.password,
              "sex": this.sex.charAt(0),
              "date_of_birth": this.fromDateVal
        }

        axios.post(this.backend_url + "api/register/", user_info).then(res => {
          this.$session.start();
          this.$session.set('access', res.data['access']);
          this.$session.set('refresh', res.data['refresh'])

          if ('email' in res.data && res.data['email'] === this.email) {

            this.$session.set('username', this.username);
            this.$session.set('email', this.email);
            this.$session.set('user_id', res.data['id']);
            this.$session.set('sex', this.sex);
            this.$session.set('first_name', this.firstName);
            this.$session.set('last_name', this.lastName);
            this.$session.set('date_of_birth', this.fromDateVal);

            router.push('/login');

            swal.fire({
              type: 'success',
              title: 'Registered!',
              text: 'You are successfully registered. Now perform Log in!',
              showConfirmButton:true,
              showCloseButton:false,
              timer:3000,
              icon: "success"
            })
          } else {
            swal.fire({
              type: 'warning',
              title: 'You are not registered!',
              text: 'Please, provide your information more correctly!',
              showConfirmButton:true,
              showCloseButton:false,
              timer:3000,
              icon: "error"
            })
          }

        }).catch(e => {
          console.log(e);
          swal.fire({
                  type: 'warning',
                  title: 'Error',
                  text: 'Something wrong while registration. Try again!',
                  showConfirmButton:true,
                  showCloseButton:false,
                  timer:3000,
                  icon: "error"
          })
        });
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    sign_in() {
      router.push('/login');
    },
    
  },
  data: () => ({
    dialog: true,
    tab: 0,
    tabs: [
        {name:"Register", icon:"mdi-account-outline"}
    ],
    valid: true,
    
    fromDateMenu: false,
    fromDateVal: null,
    minDate: "1970-01-01",
    maxDate: "2222-01-01",
    // backend_url: 'http://127.0.0.1:8000/',
    backend_url: 'http://192.168.1.105:8000/',
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    verify: "",
    sex: "",
    emailRules: [
      v => !!v || "Required",
      v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
    ],

    show1: false,
    rules: {
      required: value => !!value || "Required.",
      min: v => (v && v.length >= 4) || "Min 4 characters"
    }
  })
}
</script>