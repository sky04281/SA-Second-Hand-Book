<script setup>
import { onMounted } from "vue";

//example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";

//image
import image from "@/assets/img/upload2.jpg";

//material components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialTextArea from "@/components/MaterialTextArea.vue";
import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});
</script>
<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <DefaultNavbar
          :sticky="true"
          :action="{
            route: 'https://www.creative-tim.com/product/vue-material-kit-pro',
            color: 'bg-gradient-success',
            label: 'Buy Now',
          }"
        />
      </div>
    </div>
  </div>
  <section>
    <div class="page-header min-vh-100">
      <div class="container">
        <div class="row">
          <div
            class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column"
          >
            <div
              class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
              :style="{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
              }"
              loading="lazy"
            ></div>
          </div>
          <div
            class="mt-8 col-xl-5 col-lg-6 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5"
          >
            <div
              class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
            >
              <div
                class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent"
              >
                <div
                  class="bg-gradient-success shadow-success border-radius-lg p-3"
                >
                  <h3 class="text-white text-success mb-0">上架書籍</h3>
                </div>
              </div>
              <div class="card-body">
                <p class="pb-3">
                  請填寫書籍相關資訊。
                </p>
                <form id="contact-form" method="post" autocomplete="off">
                  <div class="card-body p-0 my-3">
                    <div class="row">
                      <div class="col-md-12">
                        <MaterialInput
                          class="input-group-static mb-4"
                          type="text"
                          label="書籍名稱"
                          placeholder="書籍名稱"
                        />
                      </div>
                      <div class="col-md-12">
                        <MaterialInput
                          class="input-group-static mb-4"
                          type="text"
                          label="作者"
                          placeholder="作者"
                        />
                      </div>
                      <div class="col-md-12">
                        <MaterialInput
                          class="input-group-static mb-4"
                          type="text"
                          label="出版社"
                          placeholder="出版社"
                        />
                      </div>
                      <div class="col-md-12">
                        <MaterialInput
                          class="input-group-static mb-4"
                          type="text"
                          label="ISBN"
                          placeholder="ISBN"
                        />
                      </div>
                      <div class="col-md-12">
                        <MaterialInput
                          class="input-group-static mb-4"
                          type="text"
                          label="價格"
                          placeholder="價格"
                        />
                      </div>
                      <div class="col-md-12">
                        <MaterialInput
                          class="input-group-static mb-4"
                          type="text"
                          label="類別"
                          placeholder="類別"
                        />
                      </div>
                    </div>
                    <div class="form-group mb-0 mt-md-0 mt-4">
                      <MaterialTextArea
                        id="message"
                        class="input-group-static mb-4"
                        :rows="6"
                        placeholder="描述您所上架書籍之詳細資訊，如書況等"
                        >詳細資訊</MaterialTextArea
                      >
                    </div>
                    <div class="row">
                      <div class="col-md-12 text-center">
                        <MaterialButton
                          variant="gradient"
                          color="success"
                          class="mt-3 mb-0"
                          >上架書籍</MaterialButton
                        >
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <DefaultFooter />
</template>
