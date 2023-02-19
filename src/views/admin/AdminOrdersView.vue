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
      <pagination-component
        :pages="pages"
        :temp-url="tempUrl"
        @emit-page="getOrders"
      ></pagination-component>
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
import PaginationComponent from '../../components/admin/PaginationComponent.vue';
import DeleteModal from '../../components/admin/DeleteModal.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  components: {
    PaginationComponent,
    DeleteModal,
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
        this.$refs.productModal.openModal();
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
    date(time) {
      const localDate = new Date(time * 1000);
      return localDate.toLocaleDateString();
    },
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
