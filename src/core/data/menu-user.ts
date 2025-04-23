interface MenuItem {
  headTitle1?: string;
  headTitle2?: string;
  title?: string;
  icon?: string;
  icon1?: string;
  type: string;
  badgeType?: string;
  active?: boolean;
  isPinned?: boolean;
  path?: string;
  children?: MenuItem[];
  bookmark?: boolean;
  badgeValue?: any;
}

export const menuUser: MenuItem[] = [
  {
    path: "/dashboard/ringkasan_keuangan",
    title: "Dashboard",
    icon: "stroke-home",
    icon1: "fill-home",
    type: "link",
    badgeType: "light-danger",
    bookmark: true,
  },
  {
    title: "Master Data",
    icon: "stroke-bonus-kit",
    icon1: "fill-bonus-kit",
    type: "sub",
    badgeType: "light-primary",
    active: false,
    isPinned: false,
    children: [
      {
        path: "/master/jabatan",
        title: "Daftar Jabatan",
        type: "link",
      },
      {
        path: "/master/jam_kerja",
        title: "Daftar Jam Kerja",
        type: "link",
      },
      {
        path: "/master/departemen",
        title: "Daftar Departemen",
        type: "link",
      },
      {
        path: "/master/coa",
        title: "Daftar COA",
        type: "link",
      },
      {
        path: "/master/vendor",
        title: "Daftar Vendor/Subkon",
        type: "link",
      },
      {
        path: "/master/pajak",
        title: "Tarif Pajak",
        type: "link",
      },
      {
        path: "/master/kategori_produk",
        title: "Kategori Barang & Jasa",
        type: "link",
      },
      {
        path: "/master/barang_jasa",
        title: "Barang & Jasa",
        type: "link",
      },
      {
        path: "/master/customer",
        title: "Customer",
        type: "link",
      },
    ],
  },
  {
    title: "Penganggaran",
    icon: "stroke-icons",
    icon1: "fill-icons",
    type: "sub",
    badgeType: "light-primary",
    active: false,
    isPinned: false,
    children: [
      {
        path: "/anggaran/daftar_anggaran",
        title: "Daftar Anggaran",
        type: "link",
      },
      {
        path: "/anggaran/pengajuan_pengubahan_anggaran",
        title: "Pengajuan Pengubahan Anggaran",
        type: "link",
      },
      {
        path: "/anggaran/permohonan_perubahan",
        title: "Permohonan Perubahan",
        type: "link",
      },
      {
        path: "/anggaran/approval_anggaran",
        title: "Approval Penganggaran",
        type: "link",
      },
    ],
  },
  {
    title: "Pejualan",
    path: "/penjualan/daftar",
    icon: "stroke-form",
    icon1: "fill-form",
    type: "link",
    badgeType: "light-primary",
  },
  {
    title: "Pembelian",
    icon: "stroke-form",
    icon1: "fill-form",
    type: "sub",
    badgeType: "light-primary",
    active: false,
    isPinned: false,
    children: [
      {
        path: "/pembelian/permintaan",
        title: "List",
        type: "link",
      },
      {
        path: "/pembelian/approval",
        title: "Approval",
        type: "link",
      },
    ],
  },
  {
    title: "Penggajian",
    icon: "stroke-bonus-kit",
    icon1: "fill-bonus-kit",
    type: "sub",
    badgeType: "light-primary",
    active: false,
    isPinned: false,
    children: [
      {
        path: "/hcm/payroll/template",
        title: "Template Payroll",
        type: "link",
      },
      {
        path: "/hcm/payroll/components",
        title: "Komponen Payroll",
        type: "link",
      },
      {
        path: "/hcm/payroll/generate",
        title: "Generate Payroll",
        type: "link",
      },
      {
        path: "/hcm/payroll/approval",
        title: "Approval Payroll",
        type: "link",
      },
      {
        path: "/hcm/payroll/print_slip",
        title: "Cetak Slip Gaji",
        type: "link",
      },
      {
        path: "/hcm/payroll/print_report",
        title: "Cetak Laporan Payroll",
        type: "link",
      },
    ],
  },
  {
    path: "/jurnal/daftar",
    title: "Jurnal",
    icon: "stroke-blog",
    icon1: "fill-blog",
    type: "link",
    badgeType: "light-danger",
    bookmark: true,
  },
  {
    path: "/monitoring/cash_flow",
    title: "Monitoring Cash Flow",
    icon: "stroke-file",
    icon1: "fill-file",
    type: "link",
    badgeType: "light-danger",
    bookmark: true,
  },
  {
    title: "Laporan Keuangan",
    icon: "stroke-charts",
    icon1: "fill-charts",
    type: "sub",
    badgeType: "light-primary",
    active: false,
    isPinned: false,
    children: [
      {
        path: "/laporan/anggaran",
        title: "Laporan Anggaran",
        type: "link",
      },
      {
        path: "/laporan/keuangan_perusahaan",
        title: "Laporan Keuangan Perusahaan",
        type: "link",
      },
      {
        path: "/laporan/aruskas",
        title: "Laporan Arus Kas",
        type: "link",
      },
      {
        path: "/laporan/profit_loss",
        title: "Laporan Laba (Rugi)",
        type: "link",
      },
      {
        path: "/laporan/neraca",
        title: "Laporan Neraca",
        type: "link",
      },
      {
        path: "/laporan/ar",
        title: "Laporan AR & Aging",
        type: "link",
      },
      {
        path: "/laporan/ap",
        title: "Laporan AP & Aging",
        type: "link",
      },
      {
        path: "/laporan/inventaris",
        title: "Laporan Inventaris & Penyusutan",
        type: "link",
      },
      {
        path: "/laporan/modal",
        title: "Laporan Perubahan Modal",
        type: "link",
      },
      {
        path: "/laporan/trial_balance",
        title: "Trial Balance",
        type: "link",
      },
      {
        path: "/laporan/note",
        title: "Catatan Atas Laporan Keuangan",
        type: "link",
      },
      {
        path: "/laporan/rasio",
        title: "Laporan Rasio Keuangan	",
        type: "link",
      },
      {
        path: "/laporan/penjualan",
        title: "Laporan Penjualan / Invoice",
        type: "link",
      },
      {
        path: "/laporan/pembelian",
        title: "Laporan Pembelian (PO & SPK)",
        type: "link",
      },
    ],
  },
  {
    title: "Bantuan",
    icon: "stroke-knowledgebase",
    icon1: "fill-knowledgebase",
    type: "sub",
    badgeType: "light-primary",
    active: false,
    isPinned: false,
    children: [
      {
        path: "/bantuan/dokumentasi",
        title: "Dokumentasi Pengguna",
        type: "link",
      },
      {
        path: "/bantuan/faq",
        title: "FAQ",
        type: "link",
      },
      {
        path: "/bantuan/kontak",
        title: "Kontak Dukungan",
        type: "link",
      },
    ],
  },
];
