<template>
  <div>
    <div
      v-if="props.canSearch || props.canCreate"
      class="d-flex flex-column flex-md-row gap-2 justify-content-between pb-4 w-full"
    >
      <div class="d-flex gap-2">
        <input
          v-if="props.canSearch"
          class="form-control w-75"
          id="search"
          type="text"
          placeholder="pencarian"
          v-model="filterQuery"
          @change="onSearch"
        />
        <slot name="additional-filter" />
      </div>
      
      <button
        v-if="props.canCreate"
        class="btn btn-primary"
        data-bs-toggle="tooltip"
        type="button"
        data-bs-original-title="btn btn-primary"
        @click="onAdd"
      >
        {{ buttonName }}
      </button>
    </div>
    <div>
      <div class="table-responsive theme-scrollbar signal-table">
        <table class="table" :class="isHover ? 'table-hover': ''">
          <thead>
            <tr>
              <th v-if="showNo" scope="col" class="no_width">No.</th>
              <th
                scope="col"
                v-for="key in Object.keys(columns)"
                :class="`text-${columns[key]?.align || ''}`"
              >
                {{ columns[key]?.label }}
              </th>
              <th v-if="props.hasAction" scope="col" class="text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td :colspan="Object.keys(columns)?.length +2" :style="{height: '150px'}">
                <Loader />
              </td>
            </tr>
            <tr v-else-if="props.items.length === 0">
              <td
                class="EmptyMessage"
                :colspan="Object.keys(columns).length + 2"
              >
                Tidak ada data yang ditemukan.
              </td>
            </tr>
            <template v-else>
              <template v-if="!props.customBody">
                <tr v-for="(row, index) in props.items" :key="index">
                  <td>{{ rowNumber(pagination?.page ?? 1, index) }}</td>
                  <td
                    v-for="(itemKey, idxItem) in Object.keys(columns)"
                    :class="`text-${columns[itemKey]?.align || ''}`"
                    :key="`item-index-${idxItem}`"
                  >
                    {{ (row as Record<string, any>)[itemKey] }}
                  </td>
                  <td v-if="props.hasAction" class="cursor-pointer d-flex gap-2 justify-content-center">
                    <button
                      v-if="props.canView"
                      class="action btn btn-info btn-md"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Detail"
                      type="button"
                      @click="onView(props.returnObject ? row : (row as Record<string, any>)?.id ?? (row as Record<string, any>)?.code)"
                    >
                      <i class="fa fa-eye" />
                    </button>

                    <button
                      v-if="props.canEdit"
                      class="action btn btn-success btn-md"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Edit"
                      type="button"
                      @click="onEdit((row as Record<string, any>)?.id ?? (row as Record<string, any>)?.code)"
                    >
                      <i class="fa fa-edit" />
                    </button>
                    <button
                      v-if="props.canDelete"
                      class="action btn btn-danger btn-md"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Hapus"
                      type="button"
                      @click="onDelete((row as Record<string, any>)?.id ?? (row as Record<string, any>)?.code)"
                    >
                      <i class="fa fa-trash-o" />
                    </button>
                    <slot name="additional-action" :data="row as any" :index="index" />
                  </td>
                </tr>
              </template>
              <slot name="custom-body" />
            </template>
            <tr>
              <slot name="footer" />
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="usePagination"
        class="pagination mx-2 mt-3 justify-content-between"
      >
        <div class="gap-2 custom-pagination">
          <span>Menampilkan</span>
          <select
            class="form-control"
            :style="{ width: 'auto !important' }"
            v-model="perPage"
            @change="changePerPage"
          >
            <option
              v-for="option in perPageOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <span>per baris</span>
        </div>
        <div class="pagination justify-content-end gap-2 custom-pagination">
          <i
            class="icon-angle-double-left"
            :class="currentPage === 1 ? 'disabled' : 'cursor-pointer'"
            @click="prev"
          />
          <span :style="{ paddingLeft: '10px' }">Halaman</span>
          <input
            class="form-control input-pagination"
            type="number"
            v-model="currentPage"
            @change="onChangePage"
          />
          <span :style="{ paddingRight: '10px' }">
            dari {{ pagination?.totalPage ?? 1 }}</span
          >
          <i
            class="icon-angle-double-right"
            @click="next"
            :class="
              currentPage === pagination?.totalPage
                ? 'disabled'
                : 'cursor-pointer'
            "
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, nextTick, defineAsyncComponent, computed } from "vue";
import Swal from "sweetalert2";

const Loader = defineAsyncComponent(
  () => import("@/components/common/Loader.vue")
);

const emit = defineEmits([
  "search",
  "edit",
  "add",
  "view",
  "update-pagination",
  "fetch"
]);
const props = defineProps({
  buttonName: String,
  items: { type: Array, default: () => [] },
  columns: { type: Object, default: () => ({}) },
  deleteFn: { type: Function },
  canCreate: { type: Boolean, default: true },
  canEdit: { type: Boolean, default: true },
  canView: { type: Boolean, default: true },
  canDelete: { type: Boolean, default: true },
  pagination: { type: Object, default: () => ({}) },
  customBody: { type: Boolean, default: false },
  showNo: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  canSearch: { type: Boolean, default: true },
  usePagination: { type: Boolean, default: true },
  hasAction: { type: Boolean, default: true },
  returnObject: { type: Boolean, default: false },
  isHover: { type: Boolean, default: true },
});

const filterQuery = ref<string>("");
const currentPage = ref<number>(props.pagination?.page ?? 1);
const perPage = ref<number>(props?.pagination?.pageSize ?? 10);
const perPageOptions = ref<Array<number>>([5, 10, 25, 50]);

const onSearch = () => {
  emit("search", filterQuery.value);
};
const prev = () => {
  currentPage.value--;
  emit("update-pagination", currentPage.value, perPage.value);
};
const next = () => {
  currentPage.value++;
  emit("update-pagination", currentPage.value, perPage.value);
};
const onChangePage = () => {
  if (currentPage.value) {
    currentPage.value =
      currentPage.value < 0
        ? 1
        : currentPage.value > props.pagination?.totalPage
        ? props.pagination?.totalPage
        : currentPage.value;
  } else currentPage.value = 1;
};
const onAdd = () => {
  emit("add");
};
const onEdit = (id: string | number) => {
  emit("edit", id);
};
const onView = (id: string | number) => {
  emit("view", id);
};
const changePerPage = () => {
  emit("update-pagination", currentPage.value, perPage.value);
};
const onDelete = (id: string | number) => {
  Swal.fire({
    icon: "warning",
    title: "Apakah anda yakin?",
    text: "Setelah dihapus, Anda tidak akan dapat memulihkan data ini.",
    showCancelButton: true,
    confirmButtonText: "Ok",
    confirmButtonColor: "var(--theme-default)",
    cancelButtonText: "Kembali",
    cancelButtonColor: "#efefef",
  }).then(async (result) => {
    if (result.value) {
      const {success, message} = await props.deleteFn?.(id);
      if (success) {
        nextTick(() => {
          Swal.fire({
            icon: "success",
            text: message ?? "Data berhasil dihapus",
            confirmButtonColor: "var(--theme-default)",
          });
          emit('fetch')
        });
      } else {
        nextTick(() => {
          Swal.fire({
            icon: "error",
            text: message ?? "Terjadi kesalahan, silahkan ulangi beberapa saat lagi",
            confirmButtonColor: "var(--theme-default)",
          });
        });
      }
    }
  });
};
const rowNumber = (page: number, index: number) => {
  if (page > 1) {
    return (page - 1) *10 + (index + 1)
  }

  return index +1
}
</script>

<style lang="css" scoped>
.table-responsive {
  width: 100%;
}
.filter-table {
  display: flex;
}
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
.cursor-pointer {
  cursor: pointer;
}

.action {
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 10px;
  padding-left: 21px;
}

.input-pagination {
  width: 50px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-pagination {
  display: flex;
  align-items: center;
}

.icon-pagination {
  width: 30px;
}

.no_width {
  width: 3rem;
}

.action_width {
  width: 18rem;
}
</style>
