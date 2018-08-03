<template>
<div class="admin">
 <v-card flat>
    <v-toolbar
      color="primary"
      dark
      extended
      flat
    >
    <v-toolbar-title class="body-2 grey--text">Admin Dashboard</v-toolbar-title>
    </v-toolbar>

    <v-layout row pb-2 style="margin-top: -5vh">
      <v-flex xs8 offset-xs2>
        <v-card class="card--flex-toolbar" style="height:80vh; ">
          <v-toolbar card prominent>
            <v-toolbar-title class="body-2 grey--text">Admin</v-toolbar-title>

            <v-spacer></v-spacer>

          </v-toolbar>

          <v-divider></v-divider>

          <v-layout row justify-center>
            <v-input @keyup.enter.native="changeTimer"
              v-model="timer"
              label="timer"
            ></v-input>
          </v-layout>

        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
  <v-layout>

  </v-layout>
</div>

</template>


<script>
import Login from '@/components/Login';
import firebase from '../config/firebaseinit';

export default {
  components: {
    Login,
  },
  data() {
    return {
      timer: 600000,
    };
  },
  methods: {
    changeTimer() {},
  },
  created() {
    console.log('Admin');
  },
};
</script>

<style scoped>
</style>

