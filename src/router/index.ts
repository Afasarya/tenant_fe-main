import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import BodyView from "@/layout/BodyView.vue";
import AuthView from "@/components/common/block/auth/AuthView.vue";
import LoginPage from "@/components/common/block/auth/LoginPage.vue";
import indexDefault from "@/pages/dashbords/indexDefault.vue";
import indexEcommerce from "@/pages/dashbords/indexEcommerce.vue";
import maintenanceView from "@/pages/authentication/maintenanceView.vue";
import indexJabatan from "@/pages/master-data/jabatan/index.vue";
import jabatanForm from "@/pages/master-data/jabatan/form.vue";
import indexDepartemen from "@/pages/master-data/departement/index.vue";
import departemenForm from "@/pages/master-data/departement/form.vue";
import indexJamKerja from "@/pages/master-data/jam-kerja/index.vue";
import jamKerjaForm from "@/pages/master-data/jam-kerja/form.vue";
import indexTarifPajak from "@/pages/master-data/tarif-pajak/index.vue";
import TarifPajakForm from "@/pages/master-data/tarif-pajak/form.vue";
import indexVendor from "@/pages/master-data/vendor/index.vue";
import VendorForm from "@/pages/master-data/vendor/form.vue";
import indexWorkLocation from "@/pages/master-data/work-location/index.vue";
import WorkLocationForm from "@/pages/master-data/work-location/form.vue";
import indexCustomer from "@/pages/master-data/customer/index.vue";
import CustomerForm from "@/pages/master-data/customer/form.vue";
import indexProduct from "@/pages/master-data/product/index.vue";
import ProductForm from "@/pages/master-data/product/form.vue";
import indexProductCategory from "@/pages/master-data/product-category/index.vue";
import ProductCategoryForm from "@/pages/master-data/product-category/form.vue";
import indexApproval from "@/pages/master-data/approval/index.vue";
import ApprovalForm from "@/pages/master-data/approval/form.vue";
import indexBankAccount from "@/pages/master-data/bank-account/index.vue";
import BankAccountForm from "@/pages/master-data/bank-account/form.vue";
import indexEmployee from "@/pages/hcm/employee/index.vue";
import EmployeeForm from "@/pages/hcm/employee/form.vue";
import indexProject from "@/pages/project/index.vue";
import ProjectForm from "@/pages/project/form.vue";
import indexBudget from "@/pages/budget/index.vue";
import BudgetForm from "@/pages/budget/form.vue";
import ManageBudgetForm from "@/pages/budget/addBudget.vue";
import indexCOA from "@/pages/master-data/coa/index.vue";
import BudgetReport from "@/pages/reports/budget.vue";
import FinancialReport from "@/pages/reports/financial.vue";
import CashFlowReport from "@/pages/reports/cashflow.vue";
import ProfitLossReport from "@/pages/reports/profitloss.vue";
import NeracaReport from "@/pages/reports/neraca.vue";
import ARReport from "@/pages/reports/ar.vue";
import APReport from "@/pages/reports/ap.vue";
import InventReport from "@/pages/reports/inventaris.vue";
import UpdateBudgetReport from "@/pages/reports/perubahan-modal.vue";
import TBReport from "@/pages/reports/trial-balance.vue";
import RasioReport from "@/pages/reports/rasio.vue";
import NoteReport from "@/pages/reports/financial-note.vue";
import SalesReport from "@/pages/reports/sales.vue";
import PurchasesReport from "@/pages/reports/purchases.vue";
import AssignUserForm from "@/pages/project/assign-user.vue";
import indexApprovalBudget from "@/pages/budget/approval/index.vue";
import DetailApprovalBudget from "@/pages/budget/approval/detail.vue";
import indexPurchaseRequest from "@/pages/purchases/request/index.vue";
import PurchaseRequestForm from "@/pages/purchases/request/form.vue";
import ManageProductForm from "@/pages/purchases/request/manage-product.vue";
import indexApprovalPurchase from "@/pages/purchases/approval/request/index.vue";
import detailApprovalPurchase from "@/pages/purchases/approval/request/detail.vue";
import indexPaymentRequest from "@/pages/payment/request/index.vue";
import PaymentRequestForm from "@/pages/payment/request/form.vue";
import indexApprovalPayment from "@/pages/payment/approval/request/index.vue";
import detailApprovalPayment from "@/pages/payment/approval/request/detail.vue";
import indexRecommendation from "@/pages/recommendation/request/index.vue";
import RecommendationForm from "@/pages/recommendation/request/form.vue";
import indexApprovalRecommendation from "@/pages/recommendation/approval/request/index.vue";
import detailApprovalRecommendation from "@/pages/recommendation/approval/request/detail.vue";
import indexPoSpk from "@/pages/pospk/request/index.vue";
import PoSpkForm from "@/pages/pospk/request/form.vue";
import indexApprovalPoSpk from "@/pages/pospk/approval/request/index.vue";
import detailApprovalPoSpk from "@/pages/pospk/approval/request/detail.vue";
import indexJournal from "@/pages/journal/index.vue";
import indexPayrollTemplate from "@/pages/hcm/payroll/template/index.vue";
import PayrollTemplateForm from "@/pages/hcm/payroll/template/form.vue";
import indexPayrollComponents from "@/pages/hcm/payroll/components/index.vue";
import PayrollComponentsForm from "@/pages/hcm/payroll/components/form.vue";
import PayrollTemplateDetail from "@/pages/hcm/payroll/template-detail/index.vue";
import indexGeneratePayroll from "@/pages/hcm/payroll/generate/index.vue";
import GeneratePayrollForm from "@/pages/hcm/payroll/generate/form.vue";
import indexApprovalPayroll from "@/pages/hcm/payroll/approval/index.vue";
import DetailApprovalPayroll from "@/pages/hcm/payroll/approval/detail.vue";
import PrintPayrollSlip from "@/pages/hcm/payroll/print/slip.vue";
import PrintPayrollReport from "@/pages/hcm/payroll/print/report.vue";
import PayslipTemplate from "@/pages/hcm/payroll/print/PayslipTemplate.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: "/dashboard/ringkasan_keuangan",
  },
  {
    path: "/",
    name: "home",
    component: BodyView,
    meta: {
      title: "Fico - Manna Jaya",
    },
    children: [
      {
        path: "",
        name: "defaultRoot",
        component: indexDefault,
        meta: {
          title: "Fico - Manna Jaya",
        },
      },
    ],
  },
  {
    path: "/auth",
    component: AuthView,
    children: [
      {
        path: "login",
        name: "login",
        component: LoginPage,
        meta: {
          title: "Fico - Manna Jaya",
        },
      },
    ],
  },
  {
    path: "/dashboard",
    component: BodyView,
    children: [
      {
        path: "ringkasan_keuangan",
        name: "ringkasanKeuangan",
        component: indexEcommerce,
        meta: {
          title: "Dashboards Ringkasan Keuangan | Fico - Manna Jaya",
          crumbs: [{ label: "Dashboard", link: "" }],
        },
      },
    ],
  },
  {
    path: "/anggaran",
    component: BodyView,
    children: [
      {
        path: "daftar_anggaran",
        name: "DaftarAnggaran",
        component: indexBudget,
        meta: {
          title: "Daftar Anggaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Anggaran", link: "" },
            { label: "Daftar", link: "/anggaran/daftar_anggaran" },
          ],
        },
      },
      {
        path: "buat_anggaran",
        name: "BuatAnggaran",
        component: BudgetForm,
        meta: {
          title: "Buat Anggaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Anggaran", link: "" },
            { label: "Daftar", link: "/anggaran/daftar_anggaran" },
            { label: "Buat", link: "/anggaran/buat_anggaran" },
          ],
        },
      },
      {
        path: "edit_anggaran/:id",
        name: "EditAnggaran",
        component: BudgetForm,
        meta: {
          title: "Edit Anggaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Anggaran", link: "" },
            { label: "Daftar", link: "/anggaran/daftar_anggaran" },
            { label: "Edit", link: "/anggaran/edit_anggaran/:id" },
          ],
        },
      },
      {
        path: "detail_anggaran/:id",
        name: "DetailAnggaran",
        component: BudgetForm,
        meta: {
          title: "Detail Anggaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Anggaran", link: "" },
            { label: "Daftar", link: "/anggaran/daftar_anggaran" },
            { label: "Detail", link: "/anggaran/detail_anggaran/:id" },
          ],
        },
      },
      {
        path: "manage_anggaran/:id",
        name: "ManageAnggaran",
        component: ManageBudgetForm,
        meta: {
          title: "Manage Anggaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Anggaran", link: "" },
            { label: "Daftar", link: "/anggaran/daftar_anggaran" },
            { label: "Manage", link: "/anggaran/manage_anggaran/:id" },
          ],
        },
      },
      {
        path: "pengajuan_pengubahan_anggaran",
        name: "PengajuanPengubahanAnggaran",
        component: maintenanceView,
        meta: {
          title: "Pengajuan Pengubahan Anggaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Anggaran", link: "" },
            {
              label: "Pengajuan",
              link: "/anggaran/pengajuan_pengubahan_anggaran",
            },
          ],
        },
      },
      {
        path: "permohonan_perubahan",
        name: "PermohonanPerubahan",
        component: maintenanceView,
        meta: {
          title: "Permohonan Perubahan Anggaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Anggaran", link: "" },
            {
              label: "Permohonan Perubahan",
              link: "/anggaran/permohonan_perubahan",
            },
          ],
        },
      },
      {
        path: "approval_anggaran",
        name: "ApprovalAnggaran",
        component: indexApprovalBudget,
        meta: {
          title: "Approval Anggaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Anggaran", link: "" },
            { label: "Approval", link: "/anggaran/approval_anggaran" },
          ],
        },
      },
      {
        path: "detail_approval_anggaran/:id",
        name: "DetailApprovalAnggaran",
        component: DetailApprovalBudget,
        meta: {
          title: "Detail Approval Anggaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Anggaran", link: "" },
            { label: "Approval", link: "/anggaran/approval_anggaran" },
            { label: "Detail", link: "/anggaran/detail_anggaran/:id" },
          ],
        },
      },
    ],
  },
  {
    path: "/gaji",
    component: BodyView,
    children: [
      {
        path: "data_penggajian",
        name: "DataPenggajian",
        component: maintenanceView,
        meta: {
          title: "Data Penggajian | Fico - Manna Jaya",
          crumbs: [
            { label: "Penggajian", link: "" },
            { label: "Daftar", link: "/gaji/data_penggajian" },
          ],
        },
      },
      {
        path: "proses_penggajian",
        name: "ProsesPenggajian",
        component: maintenanceView,
        meta: {
          title: "Proses Penggajian | Fico - Manna Jaya",
          crumbs: [
            { label: "Penggajian", link: "" },
            { label: "Proses Penggajian", link: "/gaji/proses_penggajian" },
          ],
        },
      },
      {
        path: "pengaturan",
        name: "PengaturanPenggajian",
        component: maintenanceView,
        meta: {
          title: "Pengaturan Penggajian | Fico - Manna Jaya",
          crumbs: [
            { label: "Penggajian", link: "" },
            { label: "Pengaturan", link: "/gaji/pengaturan" },
          ],
        },
      },
    ],
  },
  {
    path: "/master",
    component: BodyView,
    children: [
      {
        path: "rekening_bank",
        name: "DaftarRekeningBank",
        component: indexBankAccount,
        meta: {
          title: "Daftar Rekening Bank | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Rekening Bank", link: "" },
          ],
        },
      },
      {
        path: "buat_rekening_bank",
        name: "BuatRekeningBank",
        component: BankAccountForm,
        meta: {
          title: "Buat Rekening Bank | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Rekening Bank", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_rekening_bank/:id",
        name: "EditRekeningBank",
        component: BankAccountForm,
        meta: {
          title: "Edit Rekening Bank | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Rekening Bank", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_rekening_bank/:id",
        name: "DetailRekeningBnak",
        component: BankAccountForm,
        meta: {
          title: "Detail Rekening Bank | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Rekening Bank", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "approval",
        name: "MasterApproval",
        component: indexApproval,
        meta: {
          title: "Master Approval | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Approval", link: "/master/approval" },
          ],
        },
      },
      {
        path: "detail_approval/:id",
        name: "DetailMasterApproval",
        component: ApprovalForm,
        meta: {
          title: "Detail Master Approval | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Approval", link: "/master/approval" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "jabatan",
        name: "DaftarJabatan",
        component: indexJabatan,
        meta: {
          title: "Daftar Jabatan | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Jabatan", link: "" },
          ],
        },
      },
      {
        path: "buat_jabatan",
        name: "BuatJabatan",
        component: jabatanForm,
        meta: {
          title: "Buat Jabatan | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Jabatan", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_jabatan/:id",
        name: "EditJabatan",
        component: jabatanForm,
        meta: {
          title: "Edit Jabatan | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Jabatan", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_jabatan/:id",
        name: "DetailPerushaan",
        component: jabatanForm,
        meta: {
          title: "Detail Jabatan | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Jabatan", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "jam_kerja",
        name: "DaftarJamKerja",
        component: indexJamKerja,
        meta: {
          title: "Daftar Jam Kerja | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Jam Kerja", link: "" },
          ],
        },
      },
      {
        path: "buat_jam_kerja",
        name: "BuatJamKerja",
        component: jamKerjaForm,
        meta: {
          title: "Buat Jam Kerja | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Jam Kerja", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_jam_kerja/:id",
        name: "EditJamKerja",
        component: jamKerjaForm,
        meta: {
          title: "Edit Jam Kerja | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Jam Kerja", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_jam_kerja/:id",
        name: "DetailJamKerja",
        component: jamKerjaForm,
        meta: {
          title: "Detail Jam Kerja | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Jam Kerja", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "departemen",
        name: "DaftarDepartemen",
        component: indexDepartemen,
        meta: {
          title: "Daftar Departemen | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Departemen", link: "" },
          ],
        },
      },
      {
        path: "buat_departemen",
        name: "BuatDepartemen",
        component: departemenForm,
        meta: {
          title: "Buat Departemen | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Departemen", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_departemen/:id",
        name: "EditDepartemen",
        component: departemenForm,
        meta: {
          title: "Edit Departemen | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Departemen", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_departemen/:id",
        name: "DetailDepartemen",
        component: departemenForm,
        meta: {
          title: "Detail Departemen | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Departemen", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "vendor",
        name: "DaftarVendor",
        component: indexVendor,
        meta: {
          title: "Daftar Vendor | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Vendor", link: "" },
          ],
        },
      },
      {
        path: "buat_vendor",
        name: "BuatVendor",
        component: VendorForm,
        meta: {
          title: "Buat Vendor | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Vendor", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_vendor/:id",
        name: "EditVendor",
        component: VendorForm,
        meta: {
          title: "Edit Vendor | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Vendor", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_vendor/:id",
        name: "DetailVendor",
        component: VendorForm,
        meta: {
          title: "Detail Vendor | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Vendor", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "pajak",
        name: "TarifPajak",
        component: indexTarifPajak,
        meta: {
          title: "Tarif Pajak | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Tarif Pajak", link: "" },
          ],
        },
      },
      {
        path: "buat_pajak",
        name: "BuatTarifPajak",
        component: TarifPajakForm,
        meta: {
          title: "Buat Tarif Pajak | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Tarif Pajak", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_pajak/:id",
        name: "EditTarifPajak",
        component: TarifPajakForm,
        meta: {
          title: "Edit Tarif Pajak | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Tarif Pajak", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_pajak/:id",
        name: "DetailTarifPajak",
        component: TarifPajakForm,
        meta: {
          title: "Detail Tarif Pajak | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Tarif Pajak", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "barang_jasa",
        name: "Barang&Jasa",
        component: indexProduct,
        meta: {
          title: "Barang & Jasa | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Barang & Jasa", link: "" },
          ],
        },
      },
      {
        path: "buat_barang_jasa",
        name: "BuatBarangJasa",
        component: ProductForm,
        meta: {
          title: "Buat Barang & Jasa | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Barang & Jasa", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_barang_jasa/:id",
        name: "EditBarang&Jasa",
        component: ProductForm,
        meta: {
          title: "Edit Barang & Jasa | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Barang & Jasa", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_barang_jasa/:id",
        name: "DetailBarang&Jasa",
        component: ProductForm,
        meta: {
          title: "Detail Barang & Jasa | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Barang & Jasa", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "kategori_produk",
        name: "KategoriProduk",
        component: indexProductCategory,
        meta: {
          title: "Kategori Produk | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Kategori Produk", link: "" },
          ],
        },
      },
      {
        path: "buat_kategori_produk",
        name: "BuatKategoriProduk",
        component: ProductCategoryForm,
        meta: {
          title: "Buat Kategori Produk | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Kategori Produk", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_kategori_produk/:id",
        name: "EditKategoriProduk",
        component: ProductCategoryForm,
        meta: {
          title: "Edit Kategori Produk | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Kategori Produk", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_kategori_produk/:id",
        name: "DetailKategoriProduk",
        component: ProductCategoryForm,
        meta: {
          title: "Detail Kategori Produk | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Kategori Produk", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "customer",
        name: "Customer",
        component: indexCustomer,
        meta: {
          title: "Customer | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Customer", link: "" },
          ],
        },
      },
      {
        path: "buat_customer",
        name: "BuatCustomer",
        component: CustomerForm,
        meta: {
          title: "Buat Customer | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Customer", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_customer/:id",
        name: "EditCustomer",
        component: CustomerForm,
        meta: {
          title: "Edit Customer | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Customer", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_customer/:id",
        name: "DetailCustomer",
        component: CustomerForm,
        meta: {
          title: "Detail Customer | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Customer", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "coa",
        name: "DaftarCOA",
        component: indexCOA,
        meta: {
          title: "Daftar COA | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar COA", link: "" },
          ],
        },
      },
      {
        path: "lokasi_kerja",
        name: "DaftarLokasiKerja",
        component: indexWorkLocation,
        meta: {
          title: "Daftar Lokasi Kerja | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Lokasi Kerja", link: "" },
          ],
        },
      },
      {
        path: "buat_lokasi_kerja",
        name: "BuatLokasiKerja",
        component: WorkLocationForm,
        meta: {
          title: "Buat Lokasi Kerja | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Lokasi Kerja", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_lokasi_kerja/:id",
        name: "EditLokasiKerja",
        component: WorkLocationForm,
        meta: {
          title: "Edit Lokasi Kerja | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Lokasi Kerja", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_lokasi_kerja/:id",
        name: "DetailLokasiKerja",
        component: WorkLocationForm,
        meta: {
          title: "Detail Lokasi Kerja | Fico - Manna Jaya",
          crumbs: [
            { label: "Master Data", link: "" },
            { label: "Daftar Lokasi Kerja", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
    ],
  },
  {
    path: "/hcm",
    component: BodyView,
    children: [
      {
        path: "employee",
        name: "DaftarPegawai",
        component: indexEmployee,
        meta: {
          title: "Datar Pegawai | Fico - Manna Jaya",
          crumbs: [{ label: "Daftar Karyawan", link: "" }],
        },
      },
      {
        path: "buat_pegawai",
        name: "BuatPegawai",
        component: EmployeeForm,
        meta: {
          title: "Buat Pegawai | Fico - Manna Jaya",
          crumbs: [
            { label: "Daftar Karyawan", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_pegawai/:id",
        name: "EditPegawai",
        component: EmployeeForm,
        meta: {
          title: "Edit Pegawai | Fico - Manna Jaya",
          crumbs: [
            { label: "Daftar Karyawan", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_pegawai/:id",
        name: "DetailPegawai",
        component: EmployeeForm,
        meta: {
          title: "Detail Pegawai | Fico - Manna Jaya",
          crumbs: [
            { label: "Daftar Karyawan", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "payroll",
        name: "Payroll",
        component: maintenanceView,
        meta: {
          title: "Payroll | Fico - Manna Jaya",
          crumbs: [{ label: "Payroll Karyawan", link: "" }],
        },
      },
      {
        path: "payroll_template",
        name: "PayrollTemplate",
        component: indexPayrollTemplate,
        meta: {
          title: "Payroll Template | Fico - Manna Jaya",
          crumbs: [
            { label: "Payroll", link: "" },
            { label: "Template", link: "" },
          ],
        },
      },
      {
        path: "buat_payroll_template",
        name: "BuatPayrollTemplate",
        component: PayrollTemplateForm,
        meta: {
          title: "Buat Payroll Template | Fico - Manna Jaya",
          crumbs: [
            { label: "Payroll", link: "" },
            { label: "Template", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_payroll_template/:id",
        name: "EditPayrollTemplate",
        component: PayrollTemplateForm,
        meta: {
          title: "Edit Payroll Template | Fico - Manna Jaya",
          crumbs: [
            { label: "Payroll", link: "" },
            { label: "Template", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_payroll_template/:id",
        name: "DetailPayrollTemplate",
        component: PayrollTemplateForm,
        meta: {
          title: "Detail Payroll Template | Fico - Manna Jaya",
          crumbs: [
            { label: "Payroll", link: "" },
            { label: "Template", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "payroll/template",
        name: "DaftarTemplatePayroll",
        component: indexPayrollTemplate,
        meta: {
          title: "Daftar Template Payroll | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Template", link: "" },
          ],
        },
      },
      {
        path: "payroll/buat_template",
        name: "BuatTemplatePayroll",
        component: PayrollTemplateForm,
        meta: {
          title: "Buat Template Payroll | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Template", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "payroll/edit_template/:id",
        name: "EditTemplatePayroll",
        component: PayrollTemplateForm,
        meta: {
          title: "Edit Template Payroll | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Template", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "payroll/detail_template/:id",
        name: "DetailTemplatePayroll",
        component: PayrollTemplateForm,
        meta: {
          title: "Detail Template Payroll | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Template", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "payroll/components",
        name: "DaftarPayrollComponents",
        component: indexPayrollComponents,
        meta: {
          title: "Daftar Payroll Components | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Components", link: "" },
          ],
        },
      },
      {
        path: "payroll/buat_component",
        name: "BuatPayrollComponent",
        component: PayrollComponentsForm,
        meta: {
          title: "Buat Payroll Component | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Components", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "payroll/edit_component/:id",
        name: "EditPayrollComponent",
        component: PayrollComponentsForm,
        meta: {
          title: "Edit Payroll Component | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Components", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "payroll/detail_component/:id",
        name: "DetailPayrollComponent",
        component: PayrollComponentsForm,
        meta: {
          title: "Detail Payroll Component | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Components", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "payroll/template_detail/:id",
        name: "DetailPayrollTemplateDetail",
        component: PayrollTemplateDetail,
        meta: {
          title: "Detail Payroll Template Detail | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Template Detail", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "payroll/generate",
        name: "GeneratePayroll",
        component: indexGeneratePayroll,
        meta: {
          title: "Generate Payroll | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Generate", link: "" },
          ],
        },
      },
      {
        path: "payroll/generate_form",
        name: "GeneratePayrollForm",
        component: GeneratePayrollForm,
        meta: {
          title: "Generate Payroll Form | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Generate Form", link: "" },
          ],
        },
      },
      {
        path: "payroll/approval",
        name: "ApprovalPayroll",
        component: indexApprovalPayroll,
        meta: {
          title: "Approval Payroll | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Approval", link: "" },
          ],
        },
      },
      {
        path: "payroll/approval_detail/:id",
        name: "DetailApprovalPayroll",
        component: DetailApprovalPayroll,
        meta: {
          title: "Detail Approval Payroll | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Approval Detail", link: "" },
          ],
        },
      },
      {
        path: "payroll/print_slip",
        name: "PrintPayrollSlip",
        component: PrintPayrollSlip,
        meta: {
          title: "Print Payroll Slip | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Print Slip", link: "" },
          ],
        },
      },
      {
        path: "payroll/print_report",
        name: "PrintPayrollReport",
        component: PrintPayrollReport,
        meta: {
          title: "Print Payroll Report | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Print Report", link: "" },
          ],
        },
      },
      {
        path: "payroll/list",
        name: "PayrollList",
        component: indexGeneratePayroll,
        meta: {
          title: "Daftar Payroll | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Daftar Payroll", link: "" },
          ],
        },
      },
      {
        path: "payroll/edit/:id",
        name: "EditPayroll",
        component: GeneratePayrollForm,
        meta: {
          title: "Edit Payroll | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Edit Payroll", link: "" },
          ],
        },
      },
      {
        path: "payroll/detail/:id",
        name: "DetailPayroll",
        component: () => import("@/pages/hcm/payroll/generate/detail.vue"),
        meta: {
          title: "Detail Payroll | Fico - Manna Jaya",
          crumbs: [
            { label: "HCM", link: "" },
            { label: "Payroll", link: "" },
            { label: "Detail Payroll", link: "" },
          ],
        },
      },
    ],
  },
  {
    path: "/user",
    component: BodyView,
    children: [
      {
        path: "daftar_pengguna",
        name: "DaftarPengguna",
        component: maintenanceView,
        meta: {
          title: "Daftar Pengguna | Fico - Manna Jaya",
        },
      },
      {
        path: "roles",
        name: "Roles&Permission",
        component: maintenanceView,
        meta: {
          title: "Roles & Permission | Fico - Manna Jaya",
        },
      },
    ],
  },
  {
    path: "/proyek",
    component: BodyView,
    children: [
      {
        path: "managemen_proyek",
        name: "DaftarProyek",
        component: indexProject,
        meta: {
          title: "Daftar Proyek | Fico - Manna Jaya",
          crumbs: [
            { label: "Proyek", link: "" },
            { label: "Daftar", link: "" },
          ],
        },
      },
      {
        path: "buat_proyek",
        name: "BuatProyek",
        component: ProjectForm,
        meta: {
          title: "Buat Proyek | Fico - Manna Jaya",
          crumbs: [
            { label: "Proyek", link: "" },
            { label: "Daftar", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_proyek/:id",
        name: "EditProyek",
        component: ProjectForm,
        meta: {
          title: "Edit Proyek | Fico - Manna Jaya",
          crumbs: [
            { label: "Proyek", link: "" },
            { label: "Daftar", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_proyek/:id",
        name: "DetailProyek",
        component: ProjectForm,
        meta: {
          title: "Detail Proyek | Fico - Manna Jaya",
          crumbs: [
            { label: "Proyek", link: "" },
            { label: "Daftar", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "assign_proyek/:id",
        name: "AssignProyek",
        component: AssignUserForm,
        meta: {
          title: "Assign Proyek | Fico - Manna Jaya",
          crumbs: [
            { label: "Proyek", link: "" },
            { label: "Daftar", link: "" },
            { label: "Assign Pengguna", link: "" },
          ],
        },
      },
      {
        path: "project_budgeting",
        name: "AnggaranProyek",
        component: maintenanceView,
        meta: {
          title: "Anggaran Proyek | Fico - Manna Jaya",
          crumbs: [
            { label: "Proyek", link: "" },
            { label: "Daftar Anggaran Proyek", link: "" },
          ],
        },
      },
      {
        path: "voucher_proyek",
        name: "Voucher Proyek",
        component: maintenanceView,
        meta: {
          title: "Voucher Proyek | Fico - Manna Jaya",
          crumbs: [
            { label: "Proyek", link: "" },
            { label: "Daftar Voucher", link: "" },
          ],
        },
      },
    ],
  },
  {
    path: "/penjualan",
    component: BodyView,
    children: [
      {
        path: "daftar",
        name: "DaftarPenjualan",
        component: maintenanceView,
        meta: {
          title: "Penjualan | Fico - Manna Jaya",
          crumbs: [{ label: "Daftar Penjualan", link: "" }],
        },
      },
    ],
  },
  {
    path: "/pembelian",
    component: BodyView,
    children: [
      {
        path: "permintaan",
        name: "DaftarPermintaanPembelian",
        component: indexPurchaseRequest,
        meta: {
          title: "Permintaan Pembelian | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembelian", link: "" },
            { label: "Daftar Permohonan", link: "" },
          ],
        },
      },
      {
        path: "buat_permintaan_pembelian",
        name: "BuatPermintaanPembelian",
        component: PurchaseRequestForm,
        meta: {
          title: "Buat Permintaan Pembelian | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembelian", link: "" },
            { label: "Daftar Permohonan", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_permintaan_pembelian/:id",
        name: "EditPermintaanPembelian",
        component: PurchaseRequestForm,
        meta: {
          title: "Edit Permintaan Pembelian | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembelian", link: "" },
            { label: "Daftar Permohonan", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_permintaan_pembelian/:id",
        name: "DetailPermintaanPembelian",
        component: PurchaseRequestForm,
        meta: {
          title: "Detail Permintaan Pembelian | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembelian", link: "" },
            { label: "Daftar Permohonan", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "manage_produk_pembelian/:id",
        name: "ManagePembelianProduk",
        component: ManageProductForm,
        meta: {
          title: "Manage Pembelian Produk | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembelian", link: "" },
            { label: "Daftar Permohonan", link: "" },
            { label: "Manage Produk", link: "" },
          ],
        },
      },
      {
        path: "approval",
        name: "DaftarApprovalPembelian",
        component: indexApprovalPurchase,
        meta: {
          title: "Approval Pembelian | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembelian", link: "" },
            { label: "Daftar Approval", link: "" },
          ],
        },
      },
      {
        path: "detail_approval/:id",
        name: "DetailApprovalPermintaanPembelian",
        component: detailApprovalPurchase,
        meta: {
          title: "Detail Permintaan Pembelian Produk | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembelian", link: "" },
            { label: "Daftar Approval", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
    ],
  },
  {
    path: "/pembayaran",
    component: BodyView,
    children: [
      {
        path: "permintaan",
        name: "DaftarPembayaran",
        component: indexPaymentRequest,
        meta: {
          title: "Pembayaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembayaran", link: "" },
            { label: "Daftar Pembayaran", link: "" },
          ],
        },
      },
      {
        path: "buat_pembayaran",
        name: "BuatPembayaran",
        component: PaymentRequestForm,
        meta: {
          title: "Buat Pembayaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembayaran", link: "" },
            { label: "Daftar Pembayaran", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_pembayaran/:id",
        name: "EditPembayaran",
        component: PaymentRequestForm,
        meta: {
          title: "Edit Pembayaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembayaran", link: "" },
            { label: "Daftar Pembayaran", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_pembayaran/:id",
        name: "DetailPembayaran",
        component: PaymentRequestForm,
        meta: {
          title: "Detail Permintaan Pembelian | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembayaran", link: "" },
            { label: "Daftar Pembayaran", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "approval",
        name: "DaftarApprovalPembayaran",
        component: indexApprovalPayment,
        meta: {
          title: "Approval Pembayaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembayaran", link: "" },
            { label: "Daftar Approval", link: "" },
          ],
        },
      },
      {
        path: "detail_approval/:id",
        name: "DetailApprovalPermintaanPembayaran",
        component: detailApprovalPayment,
        meta: {
          title: "Detail Permintaan Pembayaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Pembayaran", link: "" },
            { label: "Daftar Approval", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
    ],
  },
  {
    path: "/rekomendasi",
    component: BodyView,
    children: [
      {
        path: "daftar",
        name: "DaftarRekomendasi",
        component: indexRecommendation,
        meta: {
          title: "Daftar Rekomemdasi | Fico - Manna Jaya",
          crumbs: [
            { label: "Rekomendasi", link: "" },
            { label: "Daftar", link: "" },
          ],
        },
      },
      {
        path: "buat_rekomendasi",
        name: "BuatRekomemdasi",
        component: RecommendationForm,
        meta: {
          title: "Buat Rekomemdasi | Fico - Manna Jaya",
          crumbs: [
            { label: "Rekomendasi", link: "" },
            { label: "Daftar", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_rekomendasi/:id",
        name: "EditRekomemdasi",
        component: RecommendationForm,
        meta: {
          title: "Edit Rekomemdasi | Fico - Manna Jaya",
          crumbs: [
            { label: "Rekomendasi", link: "" },
            { label: "Daftar", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_rekomendasi/:id",
        name: "DetailRekomemdasi",
        component: RecommendationForm,
        meta: {
          title: "Detail Rekomemdasi | Fico - Manna Jaya",
          crumbs: [
            { label: "Rekomendasi", link: "" },
            { label: "Daftar", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "approval",
        name: "DaftarApprovalRekomemdasi",
        component: indexApprovalRecommendation,
        meta: {
          title: "Approval Rekomemdasi | Fico - Manna Jaya",
          crumbs: [
            { label: "Rekomendasi", link: "" },
            { label: "Daftar Approval", link: "" },
          ],
        },
      },
      {
        path: "detail_approval/:id",
        name: "DetailApprovalRekomemdasi",
        component: detailApprovalRecommendation,
        meta: {
          title: "Detail Rekomemdasi | Fico - Manna Jaya",
          crumbs: [
            { label: "Rekomendasi", link: "" },
            { label: "Daftar Approval", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
    ],
  },
  {
    path: "/pospk",
    component: BodyView,
    children: [
      {
        path: "list",
        name: "DaftarPoSpk",
        component: indexPoSpk,
        meta: {
          title: "Daftar PoSpk | Fico - Manna Jaya",
          crumbs: [
            { label: "POSPK", link: "" },
            { label: "Daftar", link: "" },
          ],
        },
      },
      {
        path: "buat_pospk",
        name: "BuatPoSpk",
        component: PoSpkForm,
        meta: {
          title: "Buat PoSpk | Fico - Manna Jaya",
          crumbs: [
            { label: "POSPK", link: "" },
            { label: "Daftar", link: "" },
            { label: "Buat", link: "" },
          ],
        },
      },
      {
        path: "edit_pospk/:id",
        name: "EditPoPsk",
        component: PoSpkForm,
        meta: {
          title: "Edit POSPK | Fico - Manna Jaya",
          crumbs: [
            { label: "POSPK", link: "" },
            { label: "Daftar", link: "" },
            { label: "Edit", link: "" },
          ],
        },
      },
      {
        path: "detail_pospk/:id",
        name: "DetailPoSpk",
        component: PoSpkForm,
        meta: {
          title: "Detail PoSpk | Fico - Manna Jaya",
          crumbs: [
            { label: "POSPK", link: "" },
            { label: "Daftar", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
      {
        path: "approval",
        name: "DaftarApprovalPoSpk",
        component: indexApprovalPoSpk,
        meta: {
          title: "Approval PoSpk | Fico - Manna Jaya",
          crumbs: [
            { label: "POSPK", link: "" },
            { label: "Daftar Approval", link: "" },
          ],
        },
      },
      {
        path: "detail_approval/:id",
        name: "DetailApprovalPoSpk",
        component: detailApprovalPoSpk,
        meta: {
          title: "Detail PoSpk | Fico - Manna Jaya",
          crumbs: [
            { label: "POSPK", link: "" },
            { label: "Daftar Approval", link: "" },
            { label: "Detail", link: "" },
          ],
        },
      },
    ],
  },
  {
    path: "/jurnal",
    component: BodyView,
    children: [
      {
        path: "daftar",
        name: "DaftarJurnal",
        component: indexJournal,
        meta: {
          title: "Jurnal | Fico - Manna Jaya",
          crumbs: [{ label: "Daftar Jurnal", link: "" }],
        },
      },
    ],
  },
  {
    path: "/monitoring",
    component: BodyView,
    children: [
      {
        path: "cash_flow",
        name: "MonitoringCashFlow",
        component: maintenanceView,
        meta: {
          title: "Monitoring Cash Flow | Fico - Manna Jaya",
          crumbs: [{ label: "Monitoring", link: "" }],
        },
      },
    ],
  },
  {
    path: "/laporan",
    component: BodyView,
    children: [
      {
        path: "anggaran",
        name: "LaporanAnggaran",
        component: BudgetReport,
        meta: {
          title: "Laporan Anggaran | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "Anggaran", link: "" },
          ],
        },
      },
      {
        path: "keuangan_perusahaan",
        name: "LaporanKeuanganPerusahaan",
        component: FinancialReport,
        meta: {
          title: "Laporan Keuangan Perusahaan | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "Keuangan", link: "" },
          ],
        },
      },
      {
        path: "aruskas",
        name: "LaporanArusKas",
        component: CashFlowReport,
        meta: {
          title: "Laporan Arus Kas | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "Arus Kas", link: "" },
          ],
        },
      },
      {
        path: "profit_loss",
        name: "LaporanLabaRugi",
        component: ProfitLossReport,
        meta: {
          title: "Laporan Laba (Rugi) | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "Laba Rugi", link: "" },
          ],
        },
      },
      {
        path: "neraca",
        name: "LaporanNeraca",
        component: NeracaReport,
        meta: {
          title: "Laporan Neraca | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "Neraca", link: "" },
          ],
        },
      },
      {
        path: "ar",
        name: "LaporanAr&Aging",
        component: ARReport,
        meta: {
          title: "Laporan AR & Aging | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "AR", link: "" },
          ],
        },
      },
      {
        path: "ap",
        name: "LaporanAP&Aging",
        component: APReport,
        meta: {
          title: "Laporan AP & Aging | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "AP", link: "" },
          ],
        },
      },
      {
        path: "inventaris",
        name: "LaporanInventaris&Penyusutan",
        component: InventReport,
        meta: {
          title: "Laporan Inventaris & Penyusutan | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "Inventaris", link: "" },
          ],
        },
      },
      {
        path: "modal",
        name: "LaporanPerubahanModal",
        component: UpdateBudgetReport,
        meta: {
          title: "Laporan Perubahan Modal | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "Modal", link: "" },
          ],
        },
      },
      {
        path: "trial_balance",
        name: "TrialBalance",
        component: TBReport,
        meta: {
          title: "Trial Balance | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "Trial Balance", link: "" },
          ],
        },
      },
      {
        path: "note",
        name: "CatatanAtasLaporanKeuangan",
        component: NoteReport,
        meta: {
          title: "Catatan Atas Laporan Keuangan | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "Catatan", link: "" },
          ],
        },
      },
      {
        path: "rasio",
        name: "LaporanRasioKeuangan",
        component: RasioReport,
        meta: {
          title: "Laporan Rasio Keuangan | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "Rasio", link: "" },
          ],
        },
      },
      {
        path: "penjualan",
        name: "LaporanPejualan",
        component: SalesReport,
        meta: {
          title: "Laporan Penjualan / Invoice | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "Penjualan", link: "" },
          ],
        },
      },
      {
        path: "pembelian",
        name: "LaporanPembelian",
        component: PurchasesReport,
        meta: {
          title: "Laporan Pembelian (PO & SPK) | Fico - Manna Jaya",
          crumbs: [
            { label: "Laporan", link: "" },
            { label: "Pembelian", link: "" },
          ],
        },
      },
    ],
  },
  {
    path: "/bantuan",
    component: BodyView,
    children: [
      {
        path: "dokumentasi",
        name: "BantuanDokumentasi",
        component: maintenanceView,
        meta: {
          title: "Bantuan Dokumentasi | Fico - Manna Jaya",
          crumbs: [
            { label: "Bantuan", link: "" },
            { label: "Dokumentasi", link: "" },
          ],
        },
      },
      {
        path: "faq",
        name: "FAQ",
        component: maintenanceView,
        meta: {
          title: "FAQ | Fico - Manna Jaya",
          crumbs: [
            { label: "Bantuan", link: "" },
            { label: "FAQ", link: "" },
          ],
        },
      },
      {
        path: "kontak",
        name: "KontakDukungan",
        component: maintenanceView,
        meta: {
          title: "Kontak Dukungan | Fico - Manna Jaya",
          crumbs: [
            { label: "Bantuan", link: "" },
            { label: "Kontak", link: "" },
          ],
        },
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFOund",
    meta: {
      title: "Not Found | Fico - Manna Jaya",
    },
    component: maintenanceView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  // Set the document title if `to.meta.title` exists
  if (typeof to.meta.title === "string") {
    document.title = to.meta.title;
  }

  // Authentication pages that don't require being logged in
  const publicPaths = ["/auth/login"];

  // Check if token exists in localStorage
  const token = localStorage.getItem("token_user");

  // If the user is navigating to a public path and already has a token, redirect to the desired page
  if (token && publicPaths.includes(to.path)) {
    return next("/");
  }

  // If the user tries to access a restricted route without a token, redirect to login
  if (!token && !publicPaths.includes(to.path)) {
    return next("/auth/login");
  }

  // Allow navigation for all other cases
  next();
});

export default router;
