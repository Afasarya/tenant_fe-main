<template>
  <div class="payslip-container" :id="'payslip-' + employeeId">
    <div class="header">
      <div class="company-logo" v-if="hasLogo">
        <img :src="companyLogo" alt="Company Logo">
      </div>
      <div class="company-info">
        <h3>{{ companyName }}</h3>
        <p>{{ companyAddress }}</p>
      </div>
    </div>
    
    <div class="title-section">
      <h4>SLIP GAJI KARYAWAN</h4>
      <p>Periode: {{ formatPeriod }}</p>
    </div>
    
    <div class="employee-info">
      <div class="info-row">
        <div class="info-col">
          <div class="info-item">
            <label>Nama:</label>
            <span>{{ employeeName }}</span>
          </div>
          <div class="info-item">
            <label>ID Karyawan:</label>
            <span>{{ employeeId }}</span>
          </div>
          <div class="info-item">
            <label>Department:</label>
            <span>{{ department }}</span>
          </div>
        </div>
        <div class="info-col">
          <div class="info-item">
            <label>Jabatan:</label>
            <span>{{ position }}</span>
          </div>
          <div class="info-item">
            <label>NPWP:</label>
            <span>{{ taxId || '-' }}</span>
          </div>
          <div class="info-item">
            <label>Bank / No. Rekening:</label>
            <span>{{ bankName }} / {{ bankAccount || '-' }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="salary-section">
      <div class="salary-column">
        <h5>Pendapatan</h5>
        <div class="salary-item">
          <label>Gaji Pokok</label>
          <span>Rp {{ formatCurrency(basicSalary) }}</span>
        </div>
        <div class="salary-item" v-for="(allowance, index) in allowances" :key="'allowance-'+index">
          <label>{{ allowance.name }}</label>
          <span>Rp {{ formatCurrency(allowance.amount) }}</span>
        </div>
        <div class="salary-total">
          <label>Total Pendapatan</label>
          <span>Rp {{ formatCurrency(totalAllowance + basicSalary) }}</span>
        </div>
      </div>
      
      <div class="salary-column">
        <h5>Potongan</h5>
        <div class="salary-item" v-for="(deduction, index) in deductions" :key="'deduction-'+index">
          <label>{{ deduction.name }}</label>
          <span>Rp {{ formatCurrency(deduction.amount) }}</span>
        </div>
        <div v-if="!deductions.length" class="salary-item">
          <label>-</label>
          <span>Rp 0</span>
        </div>
        <div class="salary-total">
          <label>Total Potongan</label>
          <span>Rp {{ formatCurrency(totalDeduction) }}</span>
        </div>
      </div>
    </div>
    
    <div class="salary-summary">
      <div class="net-salary">
        <label>Gaji Bersih</label>
        <span>Rp {{ formatCurrency(netSalary) }}</span>
      </div>
      <div class="net-salary-text">
        <span><i>{{ amountInWords }}</i></span>
      </div>
    </div>
    
    <div class="signature-section">
      <div class="signature-date">
        <p>{{ currentDate }}</p>
      </div>
      <div class="signature-boxes">
        <div class="signature-box">
          <p class="signature-title">Dibuat Oleh,</p>
          <div class="signature-line"></div>
          <p>HR Manager</p>
        </div>
        <div class="signature-box">
          <p class="signature-title">Diketahui Oleh,</p>
          <div class="signature-line"></div>
          <p>Finance Manager</p>
        </div>
        <div class="signature-box">
          <p class="signature-title">Diterima Oleh,</p>
          <div class="signature-line"></div>
          <p>{{ employeeName }}</p>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>*Slip gaji ini dicetak secara elektronik dan sah tanpa tanda tangan</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'PayslipTemplate',
  props: {
    employeeId: {
      type: String,
      required: true
    },
    employeeName: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    period: {
      type: String,
      required: true
    },
    basicSalary: {
      type: Number,
      required: true
    },
    allowances: {
      type: Array,
      default: () => []
    },
    deductions: {
      type: Array,
      default: () => []
    },
    totalAllowance: {
      type: Number,
      required: true
    },
    totalDeduction: {
      type: Number,
      required: true
    },
    netSalary: {
      type: Number,
      required: true
    },
    bankName: {
      type: String,
      default: '-'
    },
    bankAccount: {
      type: String,
      default: '-'
    },
    taxId: {
      type: String,
      default: ''
    },
    companyName: {
      type: String,
      default: 'PT. Manna Jaya'
    },
    companyAddress: {
      type: String,
      default: 'Jl. Contoh No. 123, Jakarta'
    },
    companyLogo: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const hasLogo = computed(() => props.companyLogo && props.companyLogo !== '');
    
    const formatPeriod = computed(() => {
      try {
        const date = new Date(props.period);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      } catch (error) {
        return props.period;
      }
    });
    
    const currentDate = computed(() => {
      const date = new Date();
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    });
    
    const formatCurrency = (amount: number): string => {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    
    const amountInWords = computed(() => {
      const sayNumber = (number: number): string => {
        const words = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
        
        if (number < 12) {
          return words[number];
        } else if (number < 20) {
          return sayNumber(number - 10) + ' Belas';
        } else if (number < 100) {
          return sayNumber(Math.floor(number / 10)) + ' Puluh ' + sayNumber(number % 10);
        } else if (number < 200) {
          return 'Seratus ' + sayNumber(number - 100);
        } else if (number < 1000) {
          return sayNumber(Math.floor(number / 100)) + ' Ratus ' + sayNumber(number % 100);
        } else if (number < 2000) {
          return 'Seribu ' + sayNumber(number - 1000);
        } else if (number < 1000000) {
          return sayNumber(Math.floor(number / 1000)) + ' Ribu ' + sayNumber(number % 1000);
        } else if (number < 1000000000) {
          return sayNumber(Math.floor(number / 1000000)) + ' Juta ' + sayNumber(number % 1000000);
        } else {
          return sayNumber(Math.floor(number / 1000000000)) + ' Milyar ' + sayNumber(number % 1000000000);
        }
      };
      
      return props.netSalary > 0 ? sayNumber(props.netSalary) + ' Rupiah' : 'Nol Rupiah';
    });
    
    return {
      hasLogo,
      formatPeriod,
      currentDate,
      formatCurrency,
      amountInWords
    };
  }
});
</script>

<style scoped>
.payslip-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  border: 1px solid #ddd;
  background-color: #fff;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.company-logo {
  width: 80px;
  margin-right: 20px;
}

.company-logo img {
  width: 100%;
  height: auto;
}

.company-info h3 {
  margin: 0;
  font-size: 20px;
}

.company-info p {
  margin: 5px 0 0;
  font-size: 14px;
}

.title-section {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #333;
}

.title-section h4 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.title-section p {
  margin: 5px 0 0;
  font-size: 14px;
}

.employee-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
}

.info-col {
  flex: 1;
}

.info-item {
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item label {
  font-weight: bold;
  margin-right: 5px;
  min-width: 120px;
  display: inline-block;
}

.salary-section {
  display: flex;
  margin-bottom: 20px;
}

.salary-column {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
}

.salary-column:first-child {
  margin-right: 10px;
}

.salary-column h5 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.salary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
}

.salary-total {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 5px;
  border-top: 1px solid #ddd;
  font-weight: bold;
  font-size: 14px;
}

.salary-summary {
  margin-bottom: 30px;
}

.net-salary {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f0f0f0;
  font-weight: bold;
  font-size: 16px;
}

.net-salary-text {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}

.signature-section {
  margin-top: 40px;
}

.signature-date {
  text-align: right;
  margin-bottom: 20px;
  font-size: 14px;
}

.signature-boxes {
  display: flex;
  justify-content: space-around;
}

.signature-box {
  text-align: center;
  width: 30%;
}

.signature-title {
  margin-bottom: 40px;
  font-size: 14px;
}

.signature-line {
  border-bottom: 1px solid #333;
  margin-bottom: 5px;
}

.footer {
  margin-top: 40px;
  text-align: center;
  font-size: 12px;
  font-style: italic;
  color: #666;
}

@media print {
  .payslip-container {
    border: none;
    padding: 0;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
}
</style>