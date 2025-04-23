<template>
  <div class="payslip-container">
    <div class="header">
      <h3 class="text-center">{{ company.name }}</h3>
      <p class="text-center mb-1">{{ company.address }}</p>
      <p class="text-center mb-3">{{ company.phone }} | {{ company.email }}</p>
      <h4 class="text-center mb-4">SLIP GAJI</h4>
    </div>

    <div class="employee-info mb-4">
      <div class="row">
        <div class="col-md-6">
          <table class="table table-borderless">
            <tr>
              <th>Nama</th>
              <td>: {{ data.name }}</td>
            </tr>
            <tr>
              <th>NIP</th>
              <td>: {{ data.employee_id }}</td>
            </tr>
            <tr>
              <th>Jabatan</th>
              <td>: {{ data.position }}</td>
            </tr>
          </table>
        </div>
        <div class="col-md-6">
          <table class="table table-borderless">
            <tr>
              <th>Departemen</th>
              <td>: {{ data.department }}</td>
            </tr>
            <tr>
              <th>Periode</th>
              <td>: {{ period }}</td>
            </tr>
            <tr>
              <th>Tanggal</th>
              <td>: {{ getCurrentDate() }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-success text-white">
            <h6 class="mb-0">Pendapatan</h6>
          </div>
          <div class="card-body p-0">
            <table class="table table-striped mb-0">
              <tr>
                <th>Gaji Pokok</th>
                <td class="text-right">Rp {{ formatNumber(data.basic_salary) }}</td>
              </tr>
              <tr v-for="(allowance, index) in data.allowances" :key="'a-' + index">
                <th>{{ allowance.name }}</th>
                <td class="text-right">Rp {{ formatNumber(allowance.amount) }}</td>
              </tr>
              <tr class="table-success">
                <th>Total Pendapatan</th>
                <td class="text-right font-weight-bold">Rp {{ formatNumber(data.basic_salary + data.total_allowance) }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-danger text-white">
            <h6 class="mb-0">Potongan</h6>
          </div>
          <div class="card-body p-0">
            <table class="table table-striped mb-0">
              <tr v-for="(deduction, index) in data.deductions" :key="'d-' + index">
                <th>{{ deduction.name }}</th>
                <td class="text-right">Rp {{ formatNumber(deduction.amount) }}</td>
              </tr>
              <tr v-if="data.deductions.length === 0">
                <td colspan="2" class="text-center">Tidak ada potongan</td>
              </tr>
              <tr class="table-danger">
                <th>Total Potongan</th>
                <td class="text-right font-weight-bold">Rp {{ formatNumber(data.total_deduction) }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h6 class="mb-0">Total Gaji Bersih</h6>
          </div>
          <div class="card-body">
            <h5 class="text-right mb-0">Rp {{ formatNumber(data.net_salary) }}</h5>
            <p class="text-right text-muted mb-0"><small>{{ amountInWords(data.net_salary) }}</small></p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-md-8">
        <p>* Slip gaji ini dibuat secara otomatis oleh sistem</p>
        <p>* Jika ada pertanyaan silahkan hubungi departemen HRD</p>
      </div>
      <div class="col-md-4 text-center">
        <p>______________________</p>
        <p>HR Manager</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { formatDate, getCurrentDate as getDateUtil } from "@/composables/dateFormatter";
import { formatCurrency } from "@/composables/dateFormatter";

interface PayrollItem {
  id?: string;
  employee_id: string;
  name: string;
  department: string;
  position: string;
  basic_salary: number;
  allowances: Array<{name: string, amount: number}>;
  deductions: Array<{name: string, amount: number}>;
  total_allowance: number;
  total_deduction: number;
  net_salary: number;
}

interface Company {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export default defineComponent({
  name: "PayslipTemplate",
  props: {
    data: {
      type: Object as PropType<PayrollItem>,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    company: {
      type: Object as PropType<Company>,
      required: true,
    }
  },
  setup() {
    const formatNumber = (number: number): string => {
      return formatCurrency(number);
    };

    // Helper function to convert numbers to words (in Indonesian)
    const amountInWords = (amount: number): string => {
      const units = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
      
      if (amount < 12) {
        return units[amount];
      } else if (amount < 20) {
        return units[amount % 10] + " Belas";
      } else if (amount < 100) {
        return units[Math.floor(amount / 10)] + " Puluh " + units[amount % 10];
      } else if (amount < 200) {
        return "Seratus " + amountInWords(amount - 100);
      } else if (amount < 1000) {
        return units[Math.floor(amount / 100)] + " Ratus " + amountInWords(amount % 100);
      } else if (amount < 2000) {
        return "Seribu " + amountInWords(amount - 1000);
      } else if (amount < 1000000) {
        return amountInWords(Math.floor(amount / 1000)) + " Ribu " + amountInWords(amount % 1000);
      } else if (amount < 1000000000) {
        return amountInWords(Math.floor(amount / 1000000)) + " Juta " + amountInWords(amount % 1000000);
      } else {
        return amountInWords(Math.floor(amount / 1000000000)) + " Milyar " + amountInWords(amount % 1000000000);
      }
    };
    
    const getCurrentDate = (): string => {
      return getDateUtil();
    };

    return {
      formatNumber,
      amountInWords,
      getCurrentDate,
    };
  }
});
</script>

<style scoped>
.payslip-container {
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
}
@media print {
  .payslip-container {
    border: none;
  }
}
</style>