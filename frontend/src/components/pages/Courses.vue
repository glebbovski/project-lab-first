<!-- <template>
    <div>
      <b>
        Courses Page
      </b>
    </div>
</template>

<script>
import router from "../../router";
export default {
  name: "Courses",
  mounted() {
    this.checkLoggedIn();
  },
  methods: {
    checkLoggedIn() {
      this.$session.start();
      if (!this.$session.has("access_huk")) {
        router.push("/login");
      }
    }
  }
};
</script> -->