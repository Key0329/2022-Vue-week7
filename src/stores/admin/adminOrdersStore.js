import { defineStore } from 'pinia';
import axios from 'axios';

const { VITE_PATH, VITE_URL } = import.meta.env;

export default defineStore('orders', {
  state: () => ({
    orders: {},
    tempOrder: {},
    isPaid: false,
    pages: {},
    tempUrl: '',
  }),
  actions: {
    getOrders(e, id, page = 1) {
      let newPage = page;
      if (!e) {
        newPage = parseInt(id, 10);
      }

      axios
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
      axios
        .delete(`${VITE_URL}/api/${VITE_PATH}/admin/order/${id}`)
        .then((res) => {
          alert(res.data.message);
          // this.getOrders();
          this.$refs.delOrderModal.closeModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
});
