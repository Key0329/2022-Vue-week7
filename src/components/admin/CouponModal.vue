<script>
import { mapActions } from 'pinia';
import filtersStore from '@/stores/filtersStore';
import Modal from 'bootstrap/js/dist/modal';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  name: 'coupon-modal',
  props: {
    isNew: {
      type: Boolean,
      required: true,
    },
    tempCoupon: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      bsModal: '',
      coupon: {},
      due_date: '',
    };
  },
  methods: {
    openModal() {
      this.bsModal.show();
    },
    closeModal() {
      this.bsModal.hide();
    },
    addNewCoupon() {
      const data = this.coupon;

      if (
        !this.coupon.title ||
        !this.coupon.code ||
        !this.coupon.due_date ||
        !this.coupon.percent ||
        !this.coupon.is_enabled
      ) {
        alert('標題 / 優惠碼 / 到期日 / 折扣百分比 / 是否啟用 為必填欄位');

        return;
      }
      this.$http
        .post(`${VITE_URL}/api/${VITE_PATH}/admin/coupon`, { data })
        .then((res) => {
          alert(res.data.message);
          this.$emit('get-coupons');
          this.closeModal();
        })
        .catch((err) => {
          console.log(err);
          alert(err.response.data.message);
        });
    },
    updateCoupon() {
      const data = this.coupon;
      const { id } = this.coupon;

      if (
        !this.coupon.title ||
        !this.coupon.category ||
        !this.coupon.unit ||
        !this.coupon.price ||
        !this.coupon.origin_price
      ) {
        alert('標題 / 分類 / 單位 / 原價 / 售價 為必填欄位');
        // eslint-disable-next-line no-useless-return
        return;
      }
      this.$http
        .put(`${VITE_URL}/api/${VITE_PATH}/admin/coupon/${id}`, {
          data,
        })
        .then((res) => {
          alert(res.data.message);
          this.$emit('get-coupons-data');
          this.closeModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    updateCouponHandler() {
      if (this.isNew) {
        this.addNewCoupon();
      } else {
        this.updateCoupon();
      }
    },
    ...mapActions(filtersStore, ['date']),
  },
  watch: {
    tempCoupon() {
      this.coupon = this.tempCoupon;
      // 將時間格式改為 YYYY-MM-DD
      const dateAndTime = new Date(this.coupon.due_date * 1000)
        .toISOString()
        .split('T');
      [this.due_date] = dateAndTime;
    },
    due_date() {
      this.coupon.due_date = Math.floor(new Date(this.due_date) / 1000);
    },
  },
  mounted() {
    this.bsModal = new Modal(this.$refs.couponModal);
  },
};
</script>

<template>
  <div
    id="couponModal"
    ref="couponModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="couponModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <!-- header -->
        <div class="modal-header bg-dark text-white">
          <h5 id="couponModalLabel" class="modal-title">
            <span>{{ isNew ? '新增優惠券' : '編輯優惠券' }}</span>
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
          <div class="mb-3">
            <label for="title" class="form-label">標題</label>
            <input
              id="title"
              type="text"
              class="form-control"
              placeholder="請輸入標題"
              v-model="coupon.title"
            />
          </div>

          <div class="mb-3">
            <label for="code" class="form-label">優惠碼</label>
            <input
              id="code"
              type="text"
              class="form-control"
              placeholder="請輸入優惠碼"
              v-model="coupon.code"
            />
          </div>
          <div class="mb-3">
            <label for="date" class="form-label">到期日</label>
            <input
              id="date"
              type="date"
              class="form-control"
              v-model="due_date"
            />
          </div>

          <div class="mb-3">
            <label for="percent" class="form-label">折扣百分比</label>
            <input
              id="percent"
              type="number"
              min="0"
              class="form-control"
              placeholder="請輸入折扣百分比"
              v-model.number="coupon.percent"
            />
          </div>
          <div class="mb-3">
            <div class="form-check form-switch">
              <input
                id="coupon-is_enabled"
                type="checkbox"
                role="switch"
                class="form-check-input"
                :true-value="1"
                :false-value="0"
                v-model="coupon.is_enabled"
              />
              <label for="coupon-is_enabled" class="form-check-label"
                >是否啟用</label
              >
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
          <button
            type="button"
            class="btn btn-primary"
            @click="updateCouponHandler"
          >
            {{ isNew ? '新增優惠券' : '更新優惠券' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
