<template>
  <div class="container py-4">
    <div class="d-flex justify-content-end mb-2">
      <button type="button" class="btn btn-danger" @click="deleteAllOrders">
        刪除全部訂單
      </button>
    </div>
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
          <td>{{ currency(order.total) }}</td>
          <td>
            <span v-if="order.is_paid" class="text-success">已付款</span
            ><span v-else class="text-danger">尚未付款</span>
          </td>
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
      <pagination-component
        :pages="pages"
        :temp-url="tempUrl"
        @emit-page="getOrders"
      ></pagination-component>
    </div>
  </div>

  <!-- Modal -->
  <order-modal
    ref="orderModal"
    :temp-order="tempOrder"
    @get-orders="getOrders"
  ></order-modal>

  <delete-modal
    ref="delOrderModal"
    :temp-item="tempOrder"
    @delete-item="deleteOrder"
  ></delete-modal>
</template>

<script>
import { mapActions } from 'pinia';
import filtersStore from '../../stores/filtersStore';
import PaginationComponent from '../../components/admin/PaginationComponent.vue';
import DeleteModal from '../../components/admin/DeleteModal.vue';
import OrderModal from '../../components/admin/OrderModal.vue';

const { VITE_PATH, VITE_URL } = import.meta.env;

export default {
  components: {
    PaginationComponent,
    DeleteModal,
    OrderModal,
  },
  data() {
    return {
      orders: {},
      tempOrder: {},
      isPaid: false,
      pages: {},
      tempUrl: '',
    };
  },
  methods: {
    getOrders(e, page = 1) {
      const { id } = this.$route.params;
      let newPage = page;
      if (!e) {
        newPage = parseInt(id, 10);
      }

      this.$http
        .get(`${VITE_URL}/api/${VITE_PATH}/admin/orders?page=${newPage}`)
        .then((res) => {
          this.orders = res.data.orders;
          this.pages = res.data.pagination;
          this.tempUrl = '/admin/orders/';
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    modelHandler(button, order) {
      if (button === 'editBtn') {
        this.tempOrder = { ...order };
        this.$refs.orderModal.openModal();
      } else if (button === 'deleteBtn') {
        this.tempOrder = { ...order };
        this.$refs.delOrderModal.openModal();
      }
    },
    deleteOrder() {
      const { id } = this.tempOrder;
      this.$http
        .delete(`${VITE_URL}/api/${VITE_PATH}/admin/order/${id}`)
        .then((res) => {
          alert(res.data.message);
          this.getOrders();
          this.$refs.delOrderModal.closeModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteAllOrders() {
      this.$http
        .delete(`${VITE_URL}/api/${VITE_PATH}/admin/orders/all`)
        .then((res) => {
          alert(res.data.message);
          this.getOrders();
          this.$refs.delOrderModal.closeModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    ...mapActions(filtersStore, ['date', 'currency']),
  },
  watch: {
    '$route.params': {
      handler(newParams) {
        if (parseInt(newParams.id, 10) === 1) {
          this.getOrders();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>
