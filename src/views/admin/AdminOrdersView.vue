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
          <td>{{ order.create_at }}</td>
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
              <button class="btn btn-outline-primary">檢視</button>
              <button class="btn btn-outline-danger">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <pagination-component></pagination-component>
</template>

<script>
import PaginationComponent from '../../components/admin/PaginationComponent.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  components: {
    PaginationComponent,
  },
  data() {
    return {
      orders: {},
      tempOrder: {},
      isPaid: false,
      pages: {},
    };
  },
  methods: {
    getOrders() {
      this.$http
        .get(`${VITE_URL}/api/${VITE_PATH}/admin/orders`)
        .then((res) => {
          this.orders = res.data.orders;
          console.log(this.orders);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>
