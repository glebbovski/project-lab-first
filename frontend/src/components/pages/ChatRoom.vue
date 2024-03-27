<template>
    <v-container>
        <section class="section">
        <div class="container">
            <div class="columns is-multiline">
            <div class="column is-6 is-offset-3 mb-6">
                <section class="hero is-primary">
                <div class="hero-body">
                    <p class="title">
                    WebSocket Chat
                    </p>
                </div>
                </section>
            </div>
    
            <div class="column is-6 is-offset-3">
                <div class="box">
                <div id="chat-messages" style="max-height: 300px; overflow-y: scroll;">
                    <div v-for="(message, index) in messages" :key="index">
                    [{{ message.date_added }}] - <b>{{ message.username }}</b>: {{ message.content }}<br>
                    </div>
                </div>
                </div>
    
                <div class="field">
                <div class="control">
                  <v-text-field class="input" type="text" placeholder="Message" v-model="newMessage">
                    <!-- <input class="input" type="text" placeholder="Message" v-model="newMessage"> -->
                  </v-text-field>
                </div>
                </div>
    
                <div class="field">
                <div class="control">
                    <v-btn class="button is-info white--text" @click="sendMessage" color="black">Submit</v-btn>
                </div>
                </div>
    
                <small class="has-text-grey-light">Your username: <b>{{ username }}</b></small>
            </div>
            </div>
        </div>
        </section>
        <v-footer absolute id="mainFooter">
            <v-container>
                <!-- <v-row>
                    <v-carousel hide-delimiters style="width:75%" class="center">
                        <v-carousel-item
                        v-for="(item,i) in item_srcs"
                        :key="i"
                        :src="item.src"
                        cover
                        ></v-carousel-item>
                    </v-carousel>
                </v-row> -->
                <br />
                <v-row justify="center" no-gutters class="bg-grey-lighten-1" id="backBtnRow">
                    <v-btn
                    color="black"
                    variant="text"
                    class="mx-2 white--text"
                    rounded
                    @click="closeSocketConnection"
                    >
                    Back to Main Page
                    </v-btn>
                    <v-col class="text-center mt-4" cols="12">
                        {{ new Date().getUTCFullYear() }}
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>
    </v-container>
  </template>
  

<script>
import swal from 'sweetalert2';
import router from '../../router';
import axios from 'axios';
  export default {
    data() {
      return {
        backend_url: 'http://127.0.0.1:8000/',
        username: '',
        messages: [], // assuming messages is an array of objects {username: string, content: string}
        newMessage: '',
        roomName: 'chatroom', // initialize with the value passed from Django template
        user_id: null, // initialize with the value passed from Django template
        chatSocket: null,
        // links: [
        //     {name: 'Back to Main Page', href: '/'}
        // ],
      }
    },
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
                    this.username = this.$session.get('username');
                    this.user_id = this.$session.get('user_id');
                    // this.messages = []
                    axios.get(this.backend_url + 'api/chatmessages/?room=' + this.roomName, config)
                    .then(messages => {
                    for (let i = 0; i < messages.data.length; i++) {
                        axios.get(this.backend_url + 'api/users/' + messages.data[i]['user'], config)
                        .then(user => {
                            this.messages.push({ username: user.data['username'], content: messages.data[i]['content'], date_added:  messages.data[i]['date_added']});
                        })
                        
                    }
                    })
                    // this.messages.push({ username: data.username, content: data.message });

                    this.scrollToBottom();
                    this.connectWebSocket();

            } catch (e) {
                console.log(e);
            }
        }
    },
    methods: {
      closeSocketConnection() {
        console.log('Socket disconnected');
        this.chatSocket.close();
        router.push('/');
      },
      scrollToBottom() {
        let objDiv = document.getElementById("chat-messages");
        objDiv.scrollTop = objDiv.scrollHeight;
      },
      connectWebSocket() {
        this.chatSocket = new WebSocket(
          'ws://127.0.0.1:8000/ws/' + this.roomName + '/?token=' + this.$session.get('access')
        );
  
        this.chatSocket.onmessage = (e) => {
            console.log('onmessage');
        const data = JSON.parse(e.data);
        if (data.message) {
          this.messages.push({ username: data.username, content: data.message, date_added: this.formatDate(new Date()) });
          this.scrollToBottom();
        } else {
          alert('The message is empty!');
        }
        };
  
        this.chatSocket.onclose = () => {
          console.log('The socket close unexpectedly');
        };
  
      },
      sendMessage() {
        if (this.newMessage.trim() !== '') {
          this.chatSocket.send(JSON.stringify({
            'message': this.newMessage,
            'username': this.username,
            'user_id': this.user_id,
            'room': this.roomName
          }));
          this.newMessage = '';
        } else {
          alert('Message cannot be empty');
        }
      },
      checkLoggedIn() {
        this.$session.start();
        if (!this.$session.has("refresh") || this.$session.get("refresh") === null) {
            router.push("/login");
            return false;
        }
        return true;
      },
      formatDate(date) {
      const year = date.getFullYear();
      const month = this.padZero(date.getMonth() + 1);
      const day = this.padZero(date.getDate());
      const hours = this.padZero(date.getHours());
      const minutes = this.padZero(date.getMinutes());
      const seconds = this.padZero(date.getSeconds());
      const milliseconds = date.getMilliseconds();
      const timezoneOffset = date.getTimezoneOffset();

      const timezoneOffsetSign = timezoneOffset > 0 ? '-' : '+';
      const timezoneOffsetHours = this.padZero(Math.abs(Math.floor(timezoneOffset / 60)));
      const timezoneOffsetMinutes = this.padZero(Math.abs(timezoneOffset % 60));

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffsetSign}${timezoneOffsetHours}:${timezoneOffsetMinutes}`;
    },
    padZero(num) {
      return num < 10 ? '0' + num : num;
    }
    }
  }
  </script>
  
  <style scoped>

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
  
  
  </style>
  