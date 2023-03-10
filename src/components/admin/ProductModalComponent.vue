<script>
import Modal from 'bootstrap/js/dist/modal';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  name: 'product-modal-component',
  props: {
    isNew: {
      type: Boolean,
      required: true,
    },
    tempProduct: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      bsModal: '',
      product: {},
    };
  },
  methods: {
    openModal() {
      this.bsModal.show();
    },
    closeModal() {
      this.bsModal.hide();
    },
    addImage() {
      this.product.imagesUrl.push('');
    },
    createImage() {
      this.product.imagesUrl = [];
      this.product.imagesUrl.push('');
    },
    deleteImage() {
      this.product.imagesUrl.pop();
    },
    updateImage(key, e) {
      this.product.imagesUrl[key] = e;
    },
    addNewProduct() {
      const data = this.product;

      if (
        !this.product.title ||
        !this.product.category ||
        !this.product.unit ||
        !this.product.price ||
        !this.product.origin_price
      ) {
        alert('標題 / 分類 / 單位 / 原價 / 售價 為必填欄位');

        // eslint-disable-next-line no-useless-return
        return;
      }
      this.$http
        .post(`${VITE_URL}/api/${VITE_PATH}/admin/product`, { data })
        .then((res) => {
          alert(res.data.message);
          this.$emit('get-products-data');
          this.closeModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    updateProduct() {
      const data = this.product;
      const { id } = this.product;

      if (
        !this.product.title ||
        !this.product.category ||
        !this.product.unit ||
        !this.product.price ||
        !this.product.origin_price
      ) {
        alert('標題 / 分類 / 單位 / 原價 / 售價 為必填欄位');
        // eslint-disable-next-line no-useless-return
        return;
      }
      this.$http
        .put(`${VITE_URL}/api/${VITE_PATH}/admin/product/${id}`, {
          data,
        })
        .then((res) => {
          alert(res.data.message);
          this.$emit('get-products-data');
          this.closeModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    updateProductHandler() {
      if (this.isNew) {
        this.addNewProduct();
      } else {
        this.updateProduct();
      }
    },
    handleSubmit(type, key, e) {
      const form = new FormData(e.target);
      this.sendFormData(type, key, form);
    },
    sendFormData(type, key, form) {
      this.$http
        .post(`${VITE_URL}/api/${VITE_PATH}/admin/upload`, form)
        .then((res) => {
          const url = res.data.imageUrl;
          if (type === 'multi') {
            this.product.imagesUrl[key] = url;
          } else if (type === 'main') {
            this.product.imageUrl = url;
          }
        })
        .catch((err) => {
          alert(err.message);
        });
    },
  },
  watch: {
    tempProduct: {
      handler(newVal) {
        this.product = JSON.parse(JSON.stringify(newVal));
      },
      deep: true,
    },
  },
  mounted() {
    this.bsModal = new Modal(this.$refs.productModal);
  },
};
</script>

<template>
  <div
    id="productModal"
    ref="productModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <!-- header -->
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span>{{ isNew ? '新增產品' : '編輯產品' }}</span>
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
              <!-- 主要圖片 -->
              <h3 class="mb-3">主要圖片</h3>
              <div class="mb-3">
                <div class="mb-3">
                  <form
                    class="mt-2"
                    @submit.prevent="handleSubmit('main', 'null', $event)"
                    action="https://vue3-course-api.hexschool.io/v2/api/key0329/admin/upload"
                    enctype="multipart/form-data"
                    method="post"
                  >
                    <div v-if="!product.imageUrl" class="form-group mb-2">
                      <label class="mb-2" for="uploadImageFile">上傳圖片</label>
                      <input
                        id="uploadImageFile"
                        class="form-control mb-1"
                        type="file"
                        name="file-to-upload"
                      />
                      <input
                        class="form-control"
                        type="submit"
                        value="確認上傳"
                      />
                    </div>
                    <div class="form-group">
                      <label
                        v-if="!product.imageUrl"
                        for="uploadImageUrl"
                        class="form-label"
                        >或輸入圖片網址</label
                      >
                      <input
                        type="text"
                        id="uploadImageUrl"
                        class="form-control"
                        placeholder="請輸入圖片連結"
                        v-model="product.imageUrl"
                      />
                    </div>
                  </form>
                </div>
                <img
                  class="img-fluid"
                  :src="product.imageUrl"
                  alt="mainImg"
                  v-if="product.imageUrl"
                />
              </div>
              <!-- 多圖新增 -->
              <h3 class="mb-3">多圖新增</h3>
              <!-- 因為內層直接用 length 判斷會造成渲染錯誤，所以要多包一層 if 讓 imagesUrl 確定有東西才渲染 -->
              <div v-if="Array.isArray(product.imagesUrl)">
                <div
                  class="mb-4 pb-2 border-1 border-bottom"
                  v-for="(img, key) in product.imagesUrl"
                  :key="key"
                >
                  <div class="mb-3">
                    <form
                      class="mt-2"
                      @submit.prevent="handleSubmit('multi', key, $event)"
                      action="https://vue3-course-api.hexschool.io/v2/api/key0329/admin/upload"
                      enctype="multipart/form-data"
                      method="post"
                    >
                      <div
                        v-if="!product.imagesUrl[key]"
                        class="form-group mb-2"
                      >
                        <label class="mb-2" for="uploadImagesFile"
                          >上傳圖片</label
                        >
                        <input
                          id="uploadImagesFile"
                          class="form-control mb-1"
                          type="file"
                          name="file-to-upload"
                        />
                        <input
                          class="form-control"
                          type="submit"
                          value="確認上傳"
                        />
                      </div>
                      <div class="form-group">
                        <label
                          v-if="!product.imagesUrl[key]"
                          for="uploadImagesUrl"
                          class="form-label"
                          >或輸入圖片網址</label
                        >
                        <input
                          type="text"
                          id="uploadImagesUrl"
                          class="form-control"
                          placeholder="請輸入圖片連結"
                          v-model="product.imagesUrl[key]"
                        />
                      </div>
                    </form>
                  </div>
                  <img
                    v-if="this.product.imagesUrl[key]"
                    class="img-fluid"
                    :src="img"
                    :alt="'img' + key"
                  />
                </div>
                <!-- 判斷是否有陣列或是陣列最後一筆是否有值 -->
                <div
                  v-if="
                    !product.imagesUrl.length ||
                    product.imagesUrl[product.imagesUrl.length - 1]
                  "
                >
                  <button
                    class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="addImage"
                  >
                    新增圖片
                  </button>
                </div>
                <div v-else>
                  <button
                    class="btn btn-outline-danger btn-sm d-block w-100"
                    @click="deleteImage"
                  >
                    刪除圖片
                  </button>
                </div>
              </div>
              <div v-else>
                <button
                  class="btn btn-outline-primary btn-sm d-block w-100"
                  @click="createImage"
                >
                  新增圖片
                </button>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input
                  id="title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                  v-model="product.title"
                />
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input
                    id="category"
                    type="text"
                    class="form-control"
                    placeholder="請輸入分類"
                    v-model="product.category"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input
                    id="unit"
                    type="text"
                    class="form-control"
                    placeholder="請輸入單位"
                    v-model="product.unit"
                  />
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input
                    id="origin_price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入原價"
                    v-model.number="product.origin_price"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入售價"
                    v-model.number="product.price"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="review" class="form-label">評價</label>
                  <input
                    id="review"
                    type="number"
                    min="0"
                    max="5"
                    class="form-control"
                    placeholder="請輸入星級"
                    v-model.number="product.review"
                  />
                </div>
              </div>
              <hr />
              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  id="description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入產品描述"
                  v-model="product.description"
                  style="height: 100px"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  id="description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入說明內容"
                  v-model="product.content"
                  style="height: 150px"
                ></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    :true-value="1"
                    :false-value="0"
                    v-model="product.is_enabled"
                  />
                  <label class="form-check-label" for="is_enabled"
                    >是否啟用</label
                  >
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
          <button
            type="button"
            class="btn btn-primary"
            @click="updateProductHandler"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
