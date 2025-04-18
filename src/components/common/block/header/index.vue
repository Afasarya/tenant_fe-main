<template>
  <LogoView />

  <BreadCrumbs />
  <div class="header-wrapper col m-0">
    <div class="row">
      <HeaderLogo />
      <div
        class="nav-right col-xxl-8 col-xl-6 col-md-7 col-8 pull-right right-header p-0 ms-auto d-flex gap-4"
      >
        <div class="col-xxl-8 col-xl-8 col-md-8 col-8">
          <BaseSelect
            :options="projectList"
            :value="defaultProjectId"
            required
            @change="(val: any) => handleSwitchProject(val)"
          />
        </div>
        <ul class="nav-menus">
          <li class="onhover-dropdown">
            <ModeView />
          </li>
          <li>
            <ModeView />
          </li>
          <li class="profile-nav onhover-dropdown px-0 py-0">
            <ProfileView />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  defineAsyncComponent,
  defineEmits,
  nextTick,
  onMounted,
  ref,
} from "vue";
import useAxios from "@/composables/axios";
import { currentProjectId, currentUser } from "@/composables/helpers";

const LogoView = defineAsyncComponent(
  () => import("@/components/common/block/header/LogoView.vue")
);
const HeaderLogo = defineAsyncComponent(
  () => import("@/components/common/block/header/HeaderLogo.vue")
);
const ModeView = defineAsyncComponent(
  () => import("@/components/common/block/header/ModeView.vue")
);
const ProfileView = defineAsyncComponent(
  () => import("@/components/common/block/header/ProfileView.vue")
);
const BreadCrumbs = defineAsyncComponent(
  () => import("@/layout/BreadCrumbs.vue")
);
const BaseSelect = defineAsyncComponent(
  () => import("@/components/common/Select.vue")
);
const emit = defineEmits(["click"]);
const { get, put } = useAxios();
const projectList = ref<any>([]);
const defaultProjectId = ref<any>(null);
const fromForm = ref(false);

const fetchProjetcList = async () => {
  if (currentUser.value?.is_admin) {
    const { data, success } = await get("/project/search");
    if (success) {
      const projects = [{ id: "", name: "Head Office" }, ...data];
      return (projectList.value = projects ?? []);
    }
  } else {
    const { data, success } = await get("/projectUserAccess/search", {
      params: {
        user_id: currentUser.value?.id,
      },
    });
    if (success) {
      if (
        data?.length > 0 &&
        (currentProjectId.value == null || currentProjectId.value == "")
      ) {
        const { success } = await put(
          "/projectUserAccess/updateLastProjectId",
          {
            user_id: currentUser.value?.id,
            project_id: data?.[0].project_id,
          }
        );
        if (success) {
          defaultProjectId.value = data?.[0].project_id;
          localStorage.setItem("current_project", data?.[0].project_id);
        }
      }

      return (projectList.value =
        data.map((d: any) => {
          return {
            id: d?.project_id,
            name: d?.project_name,
          };
        }) ?? []);
    }
  }
};

const handleSwitchProject = async (data: any) => {
  if (fromForm.value) {
    if (data?.id != currentProjectId.value) {
      const { success } = await put("/projectUserAccess/updateLastProjectId", {
        user_id: currentUser.value?.id,
        project_id: data?.id,
      });
      if (success) {
        localStorage.setItem("current_project", data?.id);
        nextTick(() => window.location.reload());
      }
    }
  } else {
    fromForm.value = true;
  }
};

onMounted(async () => {
  await fetchProjetcList();
  defaultProjectId.value =
    currentProjectId.value == null ? "" : currentProjectId.value;
});
</script>
