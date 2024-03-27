<template>
    <v-app>
      <v-main>
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="text-center">WebSocket Via Channels</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="submitForm">
                    <v-text-field v-model="roomName" label="Room name" required></v-text-field>
                    <v-text-field v-model="username" label="Username" required></v-text-field>
                    <v-btn type="submit" color="info">Submit</v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  export default {
    data() {
      return {
        roomName: '',
        username: ''
      }
    },
    methods: {
      submitForm() {
        if (this.roomName && this.username) {
          window.location.replace(this.roomName + '/?username=' + this.username);
        } else {
          alert('Please fill in all fields');
        }
      }
    }
  }
  </script>
  
  <style>
  /* Add your styles here if needed */
  </style>
  