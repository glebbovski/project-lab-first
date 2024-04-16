<template>
    <v-container>
        <v-layout align-center justify-center>
            <v-img :src="imageUrl" max-height="400"></v-img>
        </v-layout>
        <br/>
        <b>Born City: </b>
        <v-text>
            {{ born_city }}
        </v-text>
        <br/>
        <b>About Project: </b>
        <v-text>
            {{ about_project }}
        </v-text>
        <br/>
        <b>Your email: </b>
        <v-text>
            {{ email }}
        </v-text>
        <v-footer absolute id="mainFooter">
            <v-container>
                <br />
                <v-row justify="center" no-gutters class="bg-grey-lighten-1" id="backBtnRow">
                    <v-btn
                    v-for="link in links"
                    :key="link.name"
                    :id="link.id"
                    color="black"
                    variant="text"
                    class="mx-2 white--text"
                    rounded
                    :to="link.href"
                    >
                    {{ link.name }}
                    </v-btn>
                    <v-col class="text-center mt-4" cols="12">
                    {{ new Date().getFullYear() }} — <strong> {{ creator }}</strong>
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>
    </v-container>
</template>





<style scoped>
/* .center {
  margin: auto;
  width: 50%;
  padding: 10px;
} */

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}


#mainFooter {
  background: white;
}

.hero {
  background: url('../../assets/sky_back.png');
  height: 100vh;
}


</style>

<script>

import swal from 'sweetalert2';
import router from '../../router';
import axios from 'axios';
export default {
  name: "About",

  data: () => ({
      born_city: "",
      creator: "",
      about_project: "",
      email: "",
      // backend_url: 'http://127.0.0.1:8000/',
      backend_url: 'http://192.168.1.105:8000/',
      imageUrl: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg',
      links: [
        {name: 'Back to Main Page', href: '/', id: 'backButton'}
        // 'About Us',
        // 'Team',
        // 'Services',
        // 'Blog',
        // 'Contact Us',
      ],
      item_srcs: [
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
          },
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
          },
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
          },
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
          },
        ],
  }),
  async mounted() {
    var success = this.checkLoggedIn();
    if (success) {
        try {
                var access_token = "";

                const res = await axios.post(this.backend_url + 'api/token/refresh/', {
                  "refresh": this.$session.get('refresh')
                });
                access_token = res.data['access'];
                this.$session.set('refresh', res.data['refresh']);
                this.$session.set('access', access_token)

                const config = {
                headers: { 'Authorization': 'Bearer ' + access_token,
                          'Content-Type': 'application/json' 
                         }
                };

                axios.get(this.backend_url + "api/about/", config
                ).then(res => {
                    this.$session.set('ABOUT_creator', res.data['creator']);
                    this.$session.set('ABOUT_about_project', res.data['about_project']);
                    this.$session.set('ABOUT_born_city', res.data['born_city']);
                    this.about_project = res.data['about_project']
                    this.born_city = res.data['born_city']
                    this.creator = res.data['creator']
                    this.email = this.$session.get('email')
                }).catch(e => {
                    swal.fire({
                    type: 'warning',
                    title: 'Error',
                    text: 'Can not load ABOUT information!',
                    showConfirmButton:true,
                    showCloseButton:false,
                    timer:3000,
                    icon: "error"
                    })
                    router.push("/");
                })
        } catch (e) {
                console.log(e);
        }
    }
  },
  methods: {
    checkLoggedIn() {
      this.$session.start();
      if (!this.$session.has("access")) {
        router.push("/login");
        return false;
      }
      return true;
    }
  }
};
</script>