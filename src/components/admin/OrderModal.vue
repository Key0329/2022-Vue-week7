<script>
import Modal from 'bootstrap/js/dist/modal';
import { mapActions } from 'pinia';
import filtersStore from '../../stores/filtersStore';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  props: {
    tempOrder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      bsModal: '',
      order: {},
    };
  },
  methods: {
    openModal() {
      this.bsModal.show();
    },
    closeModal() {
      this.bsModal.hide();
    },
    updateOrder() {
      const data = this.order;
      const { id } = this.order;

      this.$http
        .put(`${VITE_URL}/api/${VITE_PATH}/admin/order/${id}`, {
          data,
        })
        .then((res) => {
          alert(res.data.message);
          this.$emit('get-orders');
          this.closeModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    ...mapActions(filtersStore, ['date', 'currency']),
  },
  watch: {
    tempOrder: {
      handler(newVal) {
        this.order = JSON.parse(JSON.stringify(newVal));
      },
      deep: true,
    },
  },
  mounted() {
    this.bsModal = new Modal(this.$refs.orderModal);
  },
};
</script>
<template>
  <div
    id="orderModal"
    ref="orderModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="orderModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <!-- header -->
        <div class="modal-header bg-dark text-white">
          <h5 id="orderModalLabel" class="modal-title">
            <span>訂單細節</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <!-- body -->
        <div class="modal-body text-start">
          <div class="row">
            <div class="col-sm-4">
              <h2>用戶資料</h2>
              <table class="table">
                <tbody v-if="order.user">
                  <tr>
                    <th>姓名</th>
                    <td>{{ order.user.name }}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{{ order.user.email }}</td>
                  </tr>
                  <tr>
                    <th>電話</th>
                    <td>{{ order.user.tel }}</td>
                  </tr>
                  <tr>
                    <th>地址</th>
                    <td>{{ order.user.address }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-sm-8">
              <h2>訂單細節</h2>
              <table class="table">
                <tbody>
                  <tr>
                    <th>訂單編號</th>
                    <td>{{ order.id }}</td>
                  </tr>
                  <tr>
                    <th>下單時間</th>
                    <td>{{ date(order.create_at) }}</td>
                  </tr>
                  <tr>
                    <th>付款時間</th>
                    <td>
                      <span v-if="order.paid_date">
                        {{ date(order.paid_date) }}
                      </span>
                      <span v-else>時間不正確</span>
                    </td>
                  </tr>
                  <tr>
                    <th>付款狀態</th>
                    <td>
                      <span v-if="order.is_paid" class="text-success"
                        >已付款</span
                      ><span v-else class="text-danger">尚未付款</span>
                    </td>
                  </tr>
                  <tr>
                    <th>總金額</th>
                    <td>{{ currency(order.total) }}</td>
                  </tr>
                </tbody>
              </table>
              <h2>選購商品</h2>
              <table class="table">
                <tbody>
                  <tr v-for="product in order.products" :key="product.id">
                    <th>{{ product.product.title }}</th>
                    <td>{{ product.qty }} / {{ product.product.unit }}</td>
                    <td>{{ date(product.final_total) }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="d-flex justify-content-end">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="orderIsPaid"
                    v-model="order.is_paid"
                  />
                  <label class="form-check-label" for="orderIsPaid">
                    <span v-if="order.is_paid">已付款</span>
                    <span v-else>未付款</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="updateOrder">
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
