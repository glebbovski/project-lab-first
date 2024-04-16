<template>
  <div>
  <!-- <v-simple-table height="700px"> -->
    <v-simple-table height="700px">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              Name Of Operation
            </th>
            <th class="text-left">
              Text
            </th>
            <th class="text-left">
              End Time
            </th>
            <th class="text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in notifications"
            :key="item.name_of_operation"
          >
            <td>{{ item.name_of_operation }}</td>
            <td>{{ item.text }}</td>
            <td>{{ item.operation_end_datetime }}</td>
            <td :style="{ color: item.status === 'Finished' ? 'green' : 'black' }"><b>{{ item.status }}</b></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-footer absolute id="mainFooter">
            <v-container>
                <br />
                <v-row justify="center" no-gutters class="bg-grey-lighten-1" id="backBtnRow">
                    <v-btn
                    id="backButton"
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
  </div>
</template>



<script>
import swal from 'sweetalert2';
import router from '../../router';
export default {
  data() {
    return {
      notifications: [],
      chatSocket: null,
      backend_url: 'http://192.168.1.105:8000/',
      ws_url: 'ws://192.168.1.105:8000/',
    };
  },
  methods: {
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

      if (this.$session.get("is_superuser") === null || this.$session.get("is_superuser") === false) {
        swal.fire({
          type: 'warning',
          title: 'Error',
          text: 'You can not go to this page!',
          showConfirmButton:true,
          showCloseButton:false,
          timer:3000,
          icon: "error"
          
        })
        router.push("/");
        return false;
      }

      return true;
    },
    closeSocketConnection() {
        console.log('Socket disconnected');
        this.chatSocket.close();
        router.push('/');
      },
  },
mounted: function() {
    var isLogged = this.checkLoggedIn();
    if (isLogged) {
      console.log('logged')
      this.chatSocket = new WebSocket(this.ws_url +'ws/joke/');
      this.chatSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received notification:", event.data);
        var data_text = data['text'];
        if (data_text.length > 32) {
          data_text = data_text.substring(0, 32) + "...";
        }
        this.notifications.push({name_of_operation: data['name_of_operation'], text: data_text, operation_end_datetime: data['operation_end_datetime'], status: data['status']});
      };
    }
  }
}
</script>

