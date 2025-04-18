<template>
  <div class="logo-wrapper">
    <router-link to="/">
      <img
        class="img-fluid logo-header"
        src="@/assets/images/logo/logo_new.png"
        alt=""
      />
    </router-link>
    <div class="back-btn" @click="store.toggle_sidebar">
      <i class="fa fa-angle-left"></i>
    </div>
    <div class="toggle-sidebar" @click="store.toggle_sidebar">
      <svg class="stroke-icon sidebar-toggle status_toggle middle">
        <use href="@/assets/svg/icon-sprite.svg#toggle-icon"></use>
      </svg>
      <svg class="fill-icon sidebar-toggle status_toggle middle">
        <use href="@/assets/svg/icon-sprite.svg#fill-toggle-icon"></use>
      </svg>
    </div>
  </div>
  <div class="logo-icon-wrapper">
    <router-link to="/">
      <img
        class="img-fluid logo-icon"
        src="@/assets/images/logo/logo_icon.png"
        alt=""
      />
    </router-link>
  </div>
</template>
<script lang="ts" setup>
import { useMenuStore } from "@/store/menu";
const store = useMenuStore();
</script>

<style lang="css" scoped>
.logo-header {
  width: 170px !important;
}
.logo-icon {
  width: 30px !important;
}
</style>
