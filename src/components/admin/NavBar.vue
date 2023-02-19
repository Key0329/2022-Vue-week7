<template>
  <nav class="container">
    <ul class="list-unstyled d-flex gap-4 mb-0 align-items-center">
      <li>
        <h1 class="text-start fs-5 mb-0">
          <router-link
            class="text-decoration-none text-white"
            to="/admin/products/1"
            >Steam 後台頁面</router-link
          >
        </h1>
      </li>
      <li>
        <router-link
          class="text-white text-decoration-none"
          to="/admin/products/1"
          >產品</router-link
        >
      </li>
      <li>
        <router-link class="text-white text-decoration-none" to="/admin/orders"
          >訂單</router-link
        >
      </li>
      <li>
        <router-link class="text-white text-decoration-none" to="/admin/coupon"
          >優惠券</router-link
        >
      </li>
      <li>
        <router-link
          class="text-white text-decoration-none"
          to="/admin/articles"
          >貼文</router-link
        >
      </li>
      <li>
        <router-link class="text-white text-decoration-none" to="/"
          >回到前台</router-link
        >
      </li>
      <li>
        <a
          class="text-white text-decoration-none"
          href="#"
          @click.prevent="logout"
          >登出</a
        >
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    logout() {
      document.cookie = `hexVueWeek3Token=;expires=${new Date()};`;
      this.$router.push('/login');
    },
  },
};
</script>
