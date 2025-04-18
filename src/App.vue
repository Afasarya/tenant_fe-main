<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
let router = useRouter();

onMounted(() => {
  let allBgImageCover = document.getElementsByClassName("bg-img-cover");
  setTimeout(() => {
    for (let i = 0; i < allBgImageCover.length; i++) {
      var image = allBgImageCover[i];
      var parentEl: any = allBgImageCover[i].parentElement;
      var src = image.getAttribute("src");
      parentEl.style.backgroundImage = "url(" + src + ")";
      parentEl.style.backgroundSize = "cover";
      parentEl.style.backgroundPosition = "center";
      parentEl.classList.add("bg-size");
      image.classList.add("d-none");
    }
  }, 0);
});
</script>
