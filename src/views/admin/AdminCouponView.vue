<script>
import { mapActions } from 'pinia';

import couponModal from '@/components/admin/CouponModal.vue';
import PaginationComponent from '../../components/admin/PaginationComponent.vue';
import DeleteModal from '../../components/admin/DeleteModal.vue';
import filtersStore from '../../stores/filtersStore';

const { VITE_PATH, VITE_URL } = import.meta.env;

export default {
  components: {
    PaginationComponent,
    couponModal,
    DeleteModal,
  },
  data() {
    return {
      coupons: {},
      tempCoupon: {
        title: '',
        is_enabled: 0,
        percent: 100,
        code: '',
      },
      isNew: false,
      isEnabled: false,
      pages: {},
      tempUrl: '',
    };
  },
  methods: {
    getCoupons(e, page = 1) {
      const loader = this.$loading.show();

      const { id } = this.$route.params;
      let newPage = page;
      if (!e) {
        newPage = parseInt(id, 10);
      }

      this.$http
        .get(`${VITE_URL}/api/${VITE_PATH}/admin/coupons?page=${newPage}`)
        .then((res) => {
          this.coupons = res.data.coupons;
          this.pages = res.data.pagination;
          this.tempUrl = '/admin/coupons/';
          loader.hide();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    modelHandler(button, coupon) {
      if (button === 'createBtn') {
        this.isNew = true;
        this.tempCoupon = { due_date: new Date().getTime() / 1000 };
        this.$refs.couponModal.openModal();
      } else if (button === 'editBtn') {
        this.tempCoupon = { ...coupon };
        this.isNew = false;
        this.$refs.couponModal.openModal();
      } else if (button === 'deleteBtn') {
        this.tempCoupon = { ...coupon };
        this.$refs.delCouponModal.openModal();
      }
    },
    deleteCoupon() {
      const { id } = this.tempCoupon;
      this.$http
        .delete(`${VITE_URL}/api/${VITE_PATH}/admin/coupon/${id}`)
        .then((res) => {
          alert(res.data.message);
          this.getCoupons();
          this.$refs.delCouponModal.closeModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    ...mapActions(filtersStore, ['date']),
  },
  mounted() {
    this.getCoupons();
  },
};
</script>

<template>
  <div class="container py-4">
    <div class="d-flex justify-content-end mb-2">
      <button
        type="button"
        class="btn btn-primary"
        @click="modelHandler('createBtn')"
      >
        建立新優惠券
      </button>
    </div>
    <table class="table text-start">
      <thead>
        <tr>
          <th width="20%">名稱</th>
          <th width="20%">折扣百分比</th>
          <th width="35%">到期日</th>
          <th width="10%">是否啟用</th>
          <th width="15%">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(coupon, key) in coupons" :key="key">
          <td>{{ coupon.title }}</td>
          <td>{{ coupon.percent }}%</td>
          <td>{{ date(coupon.due_date) }}</td>
          <td>
            <span class="text-success" v-if="coupon.is_enabled">已啟用</span>
            <span class="text-danger" v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="modelHandler('editBtn', coupon)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="modelHandler('deleteBtn', coupon)"
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
        @emit-page="getCoupons"
      ></pagination-component>
    </div>
  </div>

  <!-- Modal -->
  <coupon-modal
    ref="couponModal"
    :is-new="isNew"
    :temp-coupon="tempCoupon"
    @get-coupons="getCoupons"
  ></coupon-modal>

  <delete-modal
    ref="delCouponModal"
    :temp-item="tempCoupon"
    @delete-item="deleteCoupon"
  ></delete-modal>
</template>
