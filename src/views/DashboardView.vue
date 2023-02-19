<template>
  <header class="bg-dark py-3">
    <nav-bar></nav-bar>
  </header>

  <router-view></router-view>
</template>

<script>
import { RouterView } from 'vue-router';
import NavBar from '../components/admin/NavBar.vue';

const { VITE_URL } = import.meta.env;

export default {
  components: {
    RouterView,
    NavBar,
  },
  methods: {
    checkAdmin() {
      this.$http
        .post(`${VITE_URL}/api/user/check`)
        .then(() => {})
        .catch(() => {
          alert('登入失敗');
          this.$router.push('/login');
        });
    },
  },
  created() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexVueWeek3Token\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    this.$http.defaults.headers.common.Authorization = token;
    this.checkAdmin();
  },
};
</script>
