<template>
  <div class="container-fluid p-0">
    <div class="row m-0">
      <div class="col-12 p-0">
        <div class="login-card login-dark">
          <div>
            <div>
              <a class="logo"
                ><router-link to="/"
                  ><img
                    class="img-fluid for-light"
                    src="@/assets/images/logo/logo_new.png"
                    alt="looginpage" /><img
                    class="img-fluid for-dark"
                    src="@/assets/images/logo/logo_new.png"
                    alt="looginpage" /></router-link
              ></a>
            </div>
            <div class="login-main">
              <form class="theme-form">
                <h4>Create your account</h4>
                <p>Enter your personal details to create account</p>
                <div class="form-group">
                  <label class="col-form-label pt-0">Your Name</label>
                  <div class="row g-2">
                    <div class="col-6">
                      <input
                        class="form-control"
                        type="text"
                        required
                        placeholder="First name"
                      />
                    </div>
                    <div class="col-6">
                      <input
                        class="form-control"
                        type="text"
                        required
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-form-label">Email Address</label>
                  <input
                    class="form-control"
                    type="email"
                    required
                    placeholder="Test@gmail.com"
                  />
                </div>
                <div class="form-group">
                  <label class="col-form-label">Password</label>
                  <div class="form-input position-relative">
                    <input
                      class="form-control"
                      :type="type"
                      name="login[password]"
                      placeholder="*********"
                    />
                    <div class="show-hide">
                      <span class="show" @click="showPassword"></span>
                    </div>
                  </div>
                </div>
                <div class="form-group mb-0">
                  <div class="checkbox p-0">
                    <input id="checkbox1" type="checkbox" />
                    <label class="text-muted" for="checkbox1"
                      >Agree with<a class="ms-2" href="#"
                        >Privacy Policy</a
                      ></label
                    >
                  </div>
                  <button class="btn btn-primary btn-block w-100" type="submit">
                    Create Account
                  </button>
                </div>
                <p class="mt-4 mb-0">
                  Already have an account?<router-link
                    class="ms-2"
                    to="/auth/login"
                    >Sign in</router-link
                  >
                </p>
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
const type = ref<string>("password");
function showPassword() {
  if (type.value === "password") {
    type.value = "text";
  } else {
    type.value = "password";
  }
}
</script>
