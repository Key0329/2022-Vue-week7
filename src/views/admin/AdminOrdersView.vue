<template>
  <div class="container py-4">
    <table class="table text-start">
      <thead>
        <tr>
          <th width="10%">購買時間</th>
          <th width="20%">Email</th>
          <th width="35%">購買款項</th>
          <th width="10%">應付金額</th>
          <th width="10%">是否付款</th>
          <th width="15%">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ date(order.create_at) }}</td>
          <td>{{ order.user.email }}</td>
          <td>
            <ul class="list-unstyled">
              <li v-for="product in order.products" :key="product.id">
                {{ product.product.title }}
                <span class="text-success"
                  >( 數量: {{ product.product.num }}
                  {{ product.product.unit }} )</span
                >
              </li>
            </ul>
          </td>
          <td>{{ order.total }}</td>
          <td>{{ order.isPaid ? '已付款' : '未付款' }}</td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                @click="modelHandler('editBtn', order)"
                class="btn btn-outline-primary"
              >
                檢視
              </button>
              <button
                type="button"
                @click="modelHandler('deleteBtn', order)"
                class="btn btn-outline-danger"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex justify-content-center">
      <pagination-component @emit-page="getOrders"></pagination-component>
    </div>
  </div>

  <!-- Modal -->
  <delete-modal
    ref="delOrderModal"
    :temp-item="tempOrder"
    @delete-item="deleteOrder"
  ></delete-modal>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import PaginationComponent from '../../components/admin/PaginationComponent.vue';
import DeleteModal from '../../components/admin/DeleteModal.vue';
import adminOrdersStore from '../../stores/admin/adminOrdersStore';

// const { VITE_PATH, VITE_URL } = import.meta.env;

export default {
  components: {
    PaginationComponent,
    DeleteModal,
  },
  computed: {
    ...mapState(adminOrdersStore, [
      'orders',
      'tempOrder',
      'isPaid',
      'pages',
      'tempUrl',
    ]),
  },
  methods: {
    date(time) {
      const localDate = new Date(time * 1000);
      return localDate.toLocaleDateString();
    },
    ...mapActions(adminOrdersStore, [
      'getOrders',
      'modelHandler',
      'deleteOrder',
    ]),
  },
  mounted() {},
};
</script>
