<template>
  <div class="container-fluid default-dashboard">
    <div class="row widget-grid">
      <OpeningLeaflets
        doller="Rp"
        col="col-xl-6 col-md-6 proorder-xl-2 proorder-md-2"
      />
      <ShiftsOverview />
      <CustomerTransaction />
      <ProjectData />
      <NotificationsData />
      <ActiveMembers />
      <SalesStatistic />
      <SaleProduct />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from "vue";
const OpeningLeaflets = defineAsyncComponent(
  () => import("@/components/common/OpeningLeaflets.vue")
);
const ShiftsOverview = defineAsyncComponent(
  () => import("@/components/theme/dashboards/default/ShiftsOverview.vue")
);
const CustomerTransaction = defineAsyncComponent(
  () => import("@/components/theme/dashboards/default/CustomerTransaction.vue")
);
const NotificationsData = defineAsyncComponent(
  () => import("@/components/theme/dashboards/default/NotificationsData.vue")
);
const ActiveMembers = defineAsyncComponent(
  () => import("@/components/theme/dashboards/default/ActiveMembers.vue")
);
const SalesStatistic = defineAsyncComponent(
  () => import("@/components/theme/dashboards/default/SalesStatistic.vue")
);
const SaleProduct = defineAsyncComponent(
  () => import("@/components/theme/dashboards/default/SaleProduct.vue")
);
const ProjectData = defineAsyncComponent(
  () => import("@/components/theme/dashboards/default/ProjectData.vue")
);
</script>
