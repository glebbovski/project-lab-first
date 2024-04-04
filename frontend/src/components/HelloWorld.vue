<template>
    <v-layout>
      <v-navigation-drawer
        theme="dark"
        rail
        permanent
        color="blue-grey darken-3"
      >
      <v-list-item
          nav
      >
        <v-icon large>{{ "mdi-account" }}</v-icon>
        <v-card-text class="pt-5 white--text" > Hello, <b>{{ username }}</b>! </v-card-text>
      </v-list-item>

        <v-divider></v-divider>

        <v-list
          density="compact"
          nav
        >
          <v-list-item>
            <v-btn href="/websocket-chat" id="chatButton">
              Chat
            </v-btn>
          </v-list-item>

          <v-list-item>
            <v-btn href="/about" id="aboutButton">
              About
            </v-btn>
          </v-list-item>

          <v-list-item>
            <v-btn @click="openProfileAndHideOthers" id="profileButton">
              Profile
            </v-btn>
          </v-list-item>

          <v-list-item>
            <v-btn @click="openDashboardAndHideOthers" id="coursesButton">
              All Courses
            </v-btn>
          </v-list-item>

        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block @click="logout" id="logoutButton">
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-container fluid>
      <v-row>
        <v-layout column v-show="isProfileContainerVisible">
            <v-card>
                <v-card-text >
                    <v-text-field
                        label="First Name" id="firstName" v-model="first_name"></v-text-field>
                    <v-text-field
                        label="Last Name" id="lastName" v-model="last_name"></v-text-field>
                    <v-text-field
                        label="Email Address" id="emailAddress" v-model="email" :readonly=true></v-text-field>
                    <v-select
                      item-text="name"
                      label="Sex"
                      id="sexSelection"
                      v-model="defaultSelectedSex['name']"
                      :items="sex_arr"
                      >
                    </v-select>
                    <v-menu
                        v-model="fromDateMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            id="datePicker"
                            label="Date of birth"
                            readonly
                            :value="fromDateDisp"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker 
                          locale="en-in"
                          :min="minDate"
                          :max="maxDate"
                          v-model="fromDateVal"
                          no-title
                          @input="fromDateMenu = false"
                        ></v-date-picker>
                    </v-menu>
                </v-card-text>
                <v-card-actions>
                    <v-btn id="saveChangesButton" color="primary" @click="saveChangedProfileAttributes">
                        Save Changes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-layout>
        <v-container class="bg-surface-variant" v-show="isDashboardContainerVisible">
          <v-row no-gutters>
            <v-card
              v-for="course in allCourses"
              :id="'course-' + course['id']"
              :key="course['id']"
              cols="12"
              sm="4"
              class="card-with-margin d-flex flex-column"
            >
              <v-card-item>
                <div class="text-h6 ma-2 pa-2">
                  {{ course['title'] }}
                </div>
              </v-card-item>
              <v-sheet class="ma-2 pa-2 description">
                  {{  course['description'] }}
              </v-sheet>
              <v-spacer></v-spacer>
              <v-card-actions>
                    <v-btn @click="handleCourseButtonClick(course)" color="black" class="white--text" :id="'button-' + course['title']">
                      Learn More
                    </v-btn>

              </v-card-actions>
            </v-card>
          </v-row>
        </v-container>

      </v-row>
    </v-container>
  </v-layout>
</template>


<style>
.card-with-margin {
  width: 300px; /* Фиксированная ширина */
  height: auto; /* Автоматическая высота */
  margin-bottom: 10px; /* Регулируйте значение, чтобы получить нужный вам промежуток снизу */
  margin-right: 10px; /* Регулируйте значение, чтобы получить нужный вам промежуток справа */
}


.description {
  font-size: 14px; /* Регулируйте размер шрифта по вашему усмотрению */
}


/* Для мобильных устройств */
@media screen and (max-width: 600px) {
  .card-with-margin {
    width: 100%; /* 100% ширины экрана для мобильных устройств */
    height: auto; /* Автоматическая высота */
    margin-bottom: 1px; /* Регулируйте значение, чтобы получить нужный вам промежуток снизу */
    margin-right: 5px; /* Регулируйте значение, чтобы получить нужный вам промежуток справа */
  }
}

</style>

<script>
import { onMounted } from 'vue';
import swal from 'sweetalert2';
import router from '../router';
import axios from 'axios';
export default {
  name: 'HelloWorld',
  data: () => ({
    backend_url: 'http://127.0.0.1:8000/',
    username: "",
    email: "",
    user_id: -1,
    sex: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    allCourses: [],
    loading: false,
    isProfileContainerVisible: false,
    isDashboardContainerVisible: false,

    fromDateMenu: false,
    fromDateVal: null,
    minDate: "1970-01-01",
    maxDate: "2222-01-01",



    defaultSelectedSex: {
      name: "",
    },
    sex_arr: [
      {
        name: "Male",
      },
      {
        name: "Female",
      }
    ]
  }),
  methods: {
            foo: function() {
              console.log("button")
            },
            handleCourseButtonClick(course) {
              this.$session.set('course', course);
              router.push(course['short_href']);
            },
            async logout() {
              this.loading = true;

              try {
                var access_token = "";

                const res = await axios.post(this.backend_url + 'api/token/refresh/', {
                  "refresh": this.$session.get('refresh')
                });
                access_token = res.data['access'];
                this.$session.set('refresh', res.data['refresh']);

                const config = {
                headers: { 'Authorization': 'Bearer ' + access_token,
                          'Content-Type': 'application/json' 
                         }
                };

                axios.post(this.backend_url + 'api/logout/', {
                  "refresh": this.$session.get('refresh')
                }, config)
                .then(res => {
                  console.log(res.data);
                  router.push('/login').catch(()=>{});

                  this.$session.set('access', null);
                  this.$session.set('refresh', null);

                  swal.fire({
                    type: 'success',
                    title: 'Logged out!',
                    text: 'You are successfully logged out!',
                    showConfirmButton:true,
                    showCloseButton:false,
                    timer:3000,
                    icon: "success"
                })
                }).catch(e => {
                  console.log(e);
                  if (e.response){
                    console.log(e.response.data); // => the response payload 
                    if (e.response.data['code'] === 'user_not_found') {
                      this.$session.set('access', null);
                      this.$session.set('refresh', null);
                      router.push('/login').catch(()=>{});

                      swal.fire({
                          type: 'warning',
                          title: 'Logged out with non found user!',
                          text: 'User not found!',
                          showConfirmButton:true,
                          showCloseButton:false,
                          timer:3000,
                          icon: "success"
                      })
                    }
                  }
                });
              } catch (e) {
                console.log(e);
              }

            }, 
            checkLoggedIn() {
              this.$session.start();
              if (!this.$session.has("refresh") || this.$session.get("refresh") === null) {
                swal.fire({
                  type: 'warning',
                  title: 'Error',
                  text: 'You are not authenticated!',
                  showConfirmButton:true,
                  showCloseButton:false,
                  timer:3000,
                  icon: "error"
                })
                router.push("/login");
                return false;
              } 
              return true;
            },
            // updateChangedSex() {
            //   this.changedSex = this.changedSex === 'M' ? 'F' : 'M';
            //   console.log(this.changedSex);
              
            // },
            async getAllCourses() {
              
              this.loading = true;

              try {
                var access_token = "";

                const res = await axios.post(this.backend_url + 'api/token/refresh/', {
                  "refresh": this.$session.get('refresh')
                });
                access_token = res.data['access'];
                this.$session.set('refresh', res.data['refresh']);

                const config = {
                headers: { 'Authorization': 'Bearer ' + access_token,
                          'Content-Type': 'application/json' 
                        }
                };

                axios.get(this.backend_url + 'api/courses/', config)
                .then(res => {

                  this.$session.set('access', access_token);

                  this.allCourses = []

                  for (let i = 0; i < res.data.length; i++) {
                    var tmp = { "id": res.data[i]['id'],
                                "title": res.data[i]['title'],
                                "description": res.data[i]['description'],
                                "short_href": res.data[i]['short_href'],
                                "url_for_image": res.data[i]['url_for_image'],
                                "long_description":  res.data[i]['long_description']}
                    this.allCourses.push(tmp);
                  }

                  
                }).catch(e => {
                  console.log(e);
                  if (e.response){
                    console.log(e.response.data); // => the response payload 
                    if (e.response.data['code'] === 'user_not_found') {
                      this.$session.set('access', null);
                      this.$session.set('refresh', null);
                      router.push('/login');

                      swal.fire({
                          type: 'warning',
                          title: 'Logged out with non found user!',
                          text: 'User not found!',
                          showConfirmButton:true,
                          showCloseButton:false,
                          timer:3000,
                          icon: "success"
                      })
                    }
                  }
                });
              } catch (e) {
                console.log(e);
              }

            },
            async openProfileAndHideOthers() {
// added not so far
              const res = await axios.post(this.backend_url + 'api/token/refresh/', {
                  "refresh": this.$session.get('refresh')
                });
                this.$session.set('refresh', res.data['refresh']);

              const resGet = await axios.get(this.backend_url + 'api/get_info_by_token/' + this.$session.get('refresh'));
              this.$session.set('username', resGet.data['username']);
              this.$session.set('email', resGet.data['email']);
              this.$session.set('user_id', resGet.data['user_id']);
              this.$session.set('sex', resGet.data['sex']);
              this.$session.set('first_name', resGet.data['first_name']);
              this.$session.set('last_name', resGet.data['last_name']);
              this.$session.set('date_of_birth', resGet.data['date_of_birth']);

              this.session_username = this.$session.get('username')
              this.session_email = this.$session.get('email')
              this.session_user_id = this.$session.get('user_id')
              this.session_sex = this.$session.get('sex')
              this.session_first_name = this.$session.get('first_name')
              this.session_last_name = this.$session.get('last_name')
              this.session_date_of_birth = this.$session.get('date_of_birth')
              
// added not so far

              this.sex = this.session_sex
              this.first_name = this.session_first_name
              this.last_name = this.session_last_name
              this.date_of_birth = this.session_date_of_birth
              this.fromDateVal = this.session_date_of_birth
              
              if (this.sex === 'M') {
                this.defaultSelectedSex['name'] = 'Male'
              } else {
                this.defaultSelectedSex['name'] = 'Female'
              }

              this.isDashboardContainerVisible = false;
              this.isProfileContainerVisible = true;

              
            },
            openDashboardAndHideOthers() {
              this.isProfileContainerVisible = false;
              this.isDashboardContainerVisible = true;

              this.getAllCourses();
            },
            async saveChangedProfileAttributes() {
              const newAttrs = {
                "first_name": this.first_name,
                "last_name": this.last_name,
                "sex": this.defaultSelectedSex['name'].charAt(0),
                "date_of_birth": this.fromDateVal,
              }

              this.loading = true;

              try {
                var access_token = "";

                const res = await axios.post(this.backend_url + 'api/token/refresh/', {
                  "refresh": this.$session.get('refresh')
                });
                access_token = res.data['access'];
                this.$session.set('refresh', res.data['refresh']);

                const config = {
                headers: { 'Authorization': 'Bearer ' + access_token,
                          'Content-Type': 'application/json' 
                        }
                };

                axios.patch(this.backend_url + 'api/users/' + this.user_id + '/', newAttrs, config)
                .then(res => {
                  console.log(res.data);

                  this.$session.set('access', access_token);

                  this.sex = this.defaultSelectedSex['name'].charAt(0);
                  this.date_of_birth = this.fromDateVal

                  this.$session.set('first_name', this.first_name);
                  this.$session.set('last_name', this.last_name);
                  this.$session.set('sex', this.sex);
                  this.$session.set('date_of_birth', this.date_of_birth);


                  this.session_sex = this.sex
                  this.session_first_name = this.first_name
                  this.session_last_name = this.last_name
                  this.session_date_of_birth = this.date_of_birth


                  swal.fire({
                    type: 'success',
                    title: 'You successfully changed your profile attributes!',
                    showConfirmButton:true,
                    showCloseButton:false,
                    timer:3000,
                    icon: "success"
                })
                }).catch(e => {
                  console.log(e);
                });
              } catch (e) {
                console.log(e);
              }
              
            }
        },
  mounted: function() {
    var isLoggedIn = this.checkLoggedIn();
    if (isLoggedIn) {
      this.username = this.$session.get('username')
      this.email = this.$session.get('email')
      this.user_id = this.$session.get('user_id')
      this.sex = this.$session.get('sex')
      this.first_name = this.$session.get('first_name')
      this.last_name = this.$session.get('last_name')
      this.date_of_birth = this.$session.get('date_of_birth')
      this.fromDateVal = this.date_of_birth

      if (this.sex === 'M') {
        this.defaultSelectedSex['name'] = 'Male'
      } else {
        this.defaultSelectedSex['name'] = 'Female'
      }

      this.session_username = this.$session.get('username')
      this.session_email = this.$session.get('email')
      this.session_user_id = this.$session.get('user_id')
      this.session_sex = this.$session.get('sex')
      this.session_first_name = this.$session.get('first_name')
      this.session_last_name = this.$session.get('last_name')
      this.session_date_of_birth = this.$session.get('date_of_birth')
      this.getAllCourses();
    }
  },
  computed: {
      fromDateDisp() {
        return this.fromDateVal;
        // format date, apply validations, etc. Example below.
        // return this.fromDateVal ? this.formatDate(this.fromDateVal) : "";
      },
  },
}
</script>

