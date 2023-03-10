<template>
  <div class="container">
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="modelHandler('createBtn')">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">評價星級</th>
          <th width="100">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td class="text-start">NT$ {{ currency(product.origin_price) }}</td>
          <td class="text-start">NT$ {{ currency(product.price) }}</td>
          <td class="text-center">{{ product.review }}</td>
          <td>
            <span v-if="product.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="modelHandler('editBtn', product)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="modelHandler('deleteBtn', product)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <pagination-component
      :pages="pages"
      :temp-url="tempUrl"
      @emit-page="getProductsData"
    ></pagination-component>
  </div>

  <!-- Modal-->
  <product-modal-component
    ref="productModal"
    :is-new="isNew"
    :temp-product="tempProduct"
    @get-products-data="getProductsData"
  ></product-modal-component>

  <delete-modal
    ref="delProductModal"
    :temp-item="tempProduct"
    @delete-item="deleteProduct"
  ></delete-modal>
</template>

<script>
import { mapActions } from 'pinia';
import filtersStore from '../../stores/filtersStore';
import PaginationComponent from '../../components/admin/PaginationComponent.vue';
import ProductModalComponent from '../../components/admin/ProductModalComponent.vue';
import DeleteModal from '../../components/admin/DeleteModal.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  data() {
    return {
      products: [],
      tempProduct: {},
      isNew: false,
      pages: {},
      tempUrl: '',
    };
  },
  components: {
    PaginationComponent,
    ProductModalComponent,
    DeleteModal,
  },
  methods: {
    getProductsData(e, page = 1) {
      const loader = this.$loading.show();

      const { id } = this.$route.params;
      let newPage = page;
      if (!e) {
        newPage = parseInt(id, 10);
      }

      this.$http
        .get(`${VITE_URL}/api/${VITE_PATH}/admin/products?page=${newPage}`)
        .then((res) => {
          this.products = res.data.products;
          this.pages = res.data.pagination;
          this.tempUrl = '/admin/products/';
          loader.hide();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    modelHandler(button, product) {
      if (button === 'createBtn') {
        this.isNew = true;
        this.tempProduct = {};
        this.$refs.productModal.openModal();
      } else if (button === 'editBtn') {
        this.tempProduct = { ...product };
        this.isNew = false;
        this.$refs.productModal.openModal();
      } else if (button === 'deleteBtn') {
        this.tempProduct = { ...product };
        this.$refs.delProductModal.openModal();
      }
    },
    deleteProduct() {
      const { id } = this.tempProduct;
      this.$http
        .delete(`${VITE_URL}/api/${VITE_PATH}/admin/product/${id}`)
        .then((res) => {
          alert(res.data.message);
          this.getProductsData();
          this.$refs.delProductModal.closeModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    ...mapActions(filtersStore, ['currency']),
  },
  watch: {
    '$route.params': {
      handler(newParams) {
        if (parseInt(newParams.id, 10) === 1) {
          this.getProductsData();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getProductsData();
  },
};
</script>
