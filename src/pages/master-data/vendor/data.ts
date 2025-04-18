import { Dropdown } from "@/interfaces/dropdown";
import { ref } from "vue";

interface VendorList {
  id: number;
  companyName: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  taxNumber: number;
  contactPerson: string | number;
  type: string;
  status: string;
}

export const dataVendor: VendorList[] = [
  {
    id: 1,
    companyName: "PT Jaya Jaya Jaya",
    name: "Vendor A",
    address: "Dimana ajaaa kunaon deui sihhh",
    phone: "09727389482",
    email: "vendor1@jaya.com",
    taxNumber: 987897123213801,
    contactPerson: "0823937495",
    type: "supplier",
    status: "Aktif",
  },
  {
    id: 2,
    companyName: "PT Harmoni Sentosa",
    name: "Vendor B",
    address: "Dimana ajaaa",
    phone: "09727389482",
    email: "vendor2@jaya.com",
    taxNumber: 987897123213801,
    contactPerson: "0823937495",
    type: "supplier",
    status: "Aktif",
  },
  {
    id: 3,
    companyName: "PT Jaya Jaya Jaya",
    name: "Vendor 3",
    address: "",
    phone: "09727389482",
    email: "vendor3@jaya.com",
    taxNumber: 987897123213801,
    contactPerson: "0823937495",
    type: "supplier",
    status: "Aktif",
  },
];

export let vendorTypeOptions = ref<Dropdown[]>([
  { id: "subcontractor", name: "Subcontractor" },
  { id: "supplier", name: "Supplier" },
]);

export const statusVendorOption = ref<Dropdown[]>([
  { id: "aktif", name: "Aktif" },
  { id: "inactive", name: "Tidak Aktif" },
]);
