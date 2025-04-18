<template>
  <div class="container-fluid p-0">
    <div class="row m-0">
      <div class="col-12 p-0">
        <div class="login-card login-dark">
          <div>
            <div>
              <router-link class="logo" to="/">
                <img
                  class="img-fluid for-light"
                  src="@/assets/images/logo/logo_new.png"
                  alt="looginpage"
                />
                <img
                  class="img-fluid for-dark"
                  src="@/assets/images/logo/logo_new.png"
                  alt="looginpage"
                />
              </router-link>
            </div>
            <div class="login-main">
              <form class="theme-form" @submit.prevent="" novalidate>
                <h4>Sign in to account</h4>
                <p>Enter your email & password to sign in</p>
                <div class="form-group">
                  <label class="col-form-label">Email Address</label>
                  <input
                    v-model="forms.email"
                    class="form-control"
                    type="email"
                    placeholder="email"
                    @change="handleInputEmail"
                  />
                  <div
                    class="invalid-form"
                    v-if="formSubmitted && !forms.email"
                  >
                    Silahkan isi email anda
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-form-label">Password</label>
                  <div class="form-input position-relative">
                    <input
                      v-model="forms.password"
                      :type="type"
                      class="form-control"
                      name="login[password]"
                      placeholder="password"
                    />
                    <div
                      class="show-hide"
                      :class="
                        formSubmitted && !forms.password ? 'icon-position' : ''
                      "
                    >
                      <span class="show" @click="showPassword"> </span>
                    </div>
                    <div
                      class="invalid-form"
                      v-if="formSubmitted && !forms.password"
                    >
                      Silahkan isi password anda
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-form-label">Tenant</label>
                  <select
                    class="form-select input-air-primary digits"
                    placeholder="Pilih Tenant"
                    v-model="forms.tenant_id"
                  >
                    <option value="" disabled selected>Pilih Tenant</option>
                    <option
                      v-for="(item, index) in tenantList"
                      :key="index"
                      :value="item.tenant_id"
                    >
                      {{ item?.tenant_name }}
                    </option>
                  </select>
                  <div
                    class="invalid-form"
                    v-if="formSubmitted && !forms.tenant_id"
                  >
                    Silahkan pilih tenant
                  </div>
                </div>

                <div class="form-group mb-0 margin-button">
                  <div class="text-end mt-3">
                    <button
                      class="btn btn-primary btn-block w-100"
                      type="submit"
                      @click="handleLogin"
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { validate, forms, formSubmitted } from "./login";
import useAxios from "@/composables/axios";
import { showSuccessToast, showErrorToast } from "@/composables/toast";
import axios from "axios";

let type = ref<string>("password");
const { get } = useAxios();

const tenantList = ref<any>([]);

function showPassword() {
  if (type.value === "password") {
    type.value = "text";
  } else {
    type.value = "password";
  }
}

const handleLogin = async () => {
  formSubmitted.value = true;
  const check = validate();
  if (check) {
    try {
      const response = (await axios.post(
        `http://178.128.109.250/${forms.value.tenant_id}/login`,
        {
          ...forms.value,
        }
      )) as any;

      if (response?.data?.success) {
        showSuccessToast(response?.data?.message ?? "Sign in berhasil");
        setLocalStorage(response?.data?.data);
        window.location.href = "/";
      } else
        showErrorToast(
          response?.data?.message ?? "Email/password yang anda masukan salah"
        );
    } catch (e) {
      showErrorToast("Email/password yang anda masukan salah");
    }
  }
};

const setLocalStorage = (data: any) => {
  localStorage.setItem("token_user", data.token?.plainTextToken);
  localStorage.setItem("accessToken", JSON.stringify(data.token?.accessToken));
  localStorage.setItem("current_user", JSON.stringify(data?.users));
  localStorage.setItem("tenant", JSON.stringify(data?.tenant));
  localStorage.setItem(
    "current_project",
    JSON.stringify(data?.users?.last_project_id)
  );
  localStorage.setItem("SidebarType", "compact-wrapper");
};

const handleInputEmail = () => {
  if (forms.value.email) fetchTenantByEmail();
};

const fetchTenantByEmail = async () => {
  const { data } = await get("/api/getTenantByEmail", {
    params: {
      email: forms.value.email,
    },
  });

  if (data.length > 0) tenantList.value = data;
  else showErrorToast("Email yang anda masukan salah atau tidak terdaftar");
};
</script>

<style lang="css" scoped>
.margin-button {
  padding-top: 12px;
}

.invalid-form {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: var(--bs-form-invalid-color);
}

.icon-position {
  top: 30% !important;
}
</style>
