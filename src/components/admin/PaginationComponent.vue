<script>
import { mapState, mapActions } from 'pinia';
import adminOrdersStore from '../../stores/admin/adminOrdersStore';

export default {
  name: 'pagination-component',

  computed: {
    ...mapState(adminOrdersStore, ['pages', 'tempUrl']),
  },
  data() {
    return {
      id: '',
    };
  },
  methods: {
    ...mapActions(adminOrdersStore, ['getOrders']),
  },
  mounted() {
    const { id } = this.$route.params;
    this.id = id;
    this.getOrders('', id);
  },
};
</script>

<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li class="page-item">
        <router-link
          :to="`${tempUrl}${pages.current_page - 1}`"
          @click.prevent="getOrders($event, id, pages.current_page - 1)"
          class="page-link"
          :class="{ disabled: !pages.has_pre }"
          href="#"
          aria-label="Previous"
        >
          <span aria-hidden="true">&laquo;</span>
        </router-link>
      </li>

      <li
        v-for="page in pages.total_pages"
        :key="page + 'page'"
        class="page-item"
        :class="{ 'point-none': page === pages.current_page }"
      >
        <router-link
          :to="`${tempUrl}${page}`"
          @click="getOrders($event, id, page)"
          class="page-link"
          >{{ page }}</router-link
        >
      </li>

      <li class="page-item">
        <router-link
          :to="`${tempUrl}${pages.current_page + 1}`"
          @click.prevent="getOrders($event, id, pages.current_page + 1)"
          class="page-link"
          :class="{ disabled: !pages.has_next }"
          aria-label="Next"
        >
          <span aria-hidden="true">&raquo;</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>
