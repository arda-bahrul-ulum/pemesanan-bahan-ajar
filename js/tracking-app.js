const dummyData = {
  upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
  kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
  pengirimanList: [
    { kode: "REG", nama: "JNE Regular" },
    { kode: "EXP", nama: "JNE Express" },
  ],
  paket: [
    {
      kode: "PAKET-UT-001",
      nama: "PAKET IPS Dasar",
      isi: ["EKMA4116", "EKMA4115"],
      harga: 120000,
    },
    {
      kode: "PAKET-UT-002",
      nama: "PAKET IPA Dasar",
      isi: ["BIOL4201", "FISIP4001"],
      harga: 140000,
    },
  ],
  tracking: {
    "DO2025-0001": {
      nim: "123456789",
      nama: "Rina Wulandari",
      status: "Dalam Perjalanan",
      ekspedisi: "JNE Regular (3-5 hari)",
      tanggalKirim: "2025-08-25",
      paket: "PAKET-UT-001",
      total: 120000,
      perjalanan: [
        {
          waktu: "2025-08-25 10:12:20",
          keterangan: "Penerimaan di Loket: TANGSEL",
        },
        { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
        {
          waktu: "2025-08-26 08:44:01",
          keterangan: "Diteruskan ke Kantor Tujuan",
        },
      ],
    },
  },
};

var trackingApp = new Vue({
  el: "#tracking-app",
  data: {
    pengirimanList: dummyData.pengirimanList,
    paket: dummyData.paket,
    tracking: JSON.parse(JSON.stringify(dummyData.tracking)),

    // Form data
    formData: {
      nim: "",
      nama: "",
      ekspedisi: "",
      paketKode: "",
      tanggalKirim: "",
    },
    formErrors: {},
    showForm: false,

    selectedPaketDetail: null,

    searchNoDO: "",
  },

  computed: {
    nextDONumber() {
      const currentYear = new Date().getFullYear();
      const doKeys = Object.keys(this.tracking).filter((key) =>
        key.startsWith(`DO${currentYear}-`)
      );

      if (doKeys.length === 0) {
        return `DO${currentYear}-0001`;
      }

      const numbers = doKeys.map((key) => {
        const match = key.match(/DO\d+-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });

      const maxNumber = Math.max(...numbers);
      const nextNumber = maxNumber + 1;
      const paddedNumber = String(nextNumber).padStart(4, "0");

      return `DO${currentYear}-${paddedNumber}`;
    },

    totalHarga() {
      if (!this.formData.paketKode) {
        return 0;
      }
      const selectedPaket = this.paket.find(
        (p) => p.kode === this.formData.paketKode
      );
      return selectedPaket ? selectedPaket.harga : 0;
    },

    filteredTracking() {
      if (!this.searchNoDO.trim()) {
        return Object.keys(this.tracking);
      }
      return Object.keys(this.tracking).filter((noDO) =>
        noDO.toLowerCase().includes(this.searchNoDO.toLowerCase())
      );
    },

    trackingList() {
      return this.filteredTracking.map((noDO) => ({
        noDO: noDO,
        data: this.tracking[noDO],
      }));
    },
  },

  watch: {
    // Watcher 1: Update selectedPaketDetail ketika paket dipilih
    "formData.paketKode"(newVal) {
      if (newVal) {
        this.selectedPaketDetail = this.paket.find((p) => p.kode === newVal);
      } else {
        this.selectedPaketDetail = null;
      }
    },

    // Watcher 2: Auto-set tanggal kirim jika kosong
    "formData.tanggalKirim"(newVal) {
      if (!newVal) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        this.formData.tanggalKirim = `${year}-${month}-${day}`;
      }
    },

    // Watcher 3: Monitor perubahan tracking untuk logging
    tracking: {
      handler(newTracking) {
        const count = Object.keys(newTracking).length;
        console.log(`Total DO: ${count}`);
      },
      deep: true,
    },
  },

  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
      if (!this.showForm) {
        this.resetForm();
      } else {
        if (!this.formData.tanggalKirim) {
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          this.formData.tanggalKirim = `${year}-${month}-${day}`;
        }
      }
    },

    // Reset form
    resetForm() {
      this.formData = {
        nim: "",
        nama: "",
        ekspedisi: "",
        paketKode: "",
        tanggalKirim: "",
      };
      this.formErrors = {};
      this.selectedPaketDetail = null;
    },

    // Validasi form
    validateForm() {
      this.formErrors = {};
      let isValid = true;

      if (!this.formData.nim.trim()) {
        this.formErrors.nim = "NIM wajib diisi";
        isValid = false;
      } else if (!/^\d+$/.test(this.formData.nim.trim())) {
        this.formErrors.nim = "NIM harus berupa angka";
        isValid = false;
      }

      if (!this.formData.nama.trim()) {
        this.formErrors.nama = "Nama wajib diisi";
        isValid = false;
      }

      if (!this.formData.ekspedisi) {
        this.formErrors.ekspedisi = "Ekspedisi wajib dipilih";
        isValid = false;
      }

      if (!this.formData.paketKode) {
        this.formErrors.paketKode = "Paket Bahan Ajar wajib dipilih";
        isValid = false;
      }

      if (!this.formData.tanggalKirim) {
        this.formErrors.tanggalKirim = "Tanggal Kirim wajib diisi";
        isValid = false;
      }

      return isValid;
    },

    // Tambah DO baru
    addDO() {
      if (!this.validateForm()) {
        return;
      }

      const selectedEkspedisi = this.pengirimanList.find(
        (e) => e.kode === this.formData.ekspedisi
      );
      const selectedPaket = this.paket.find(
        (p) => p.kode === this.formData.paketKode
      );

      const newDO = {
        nim: this.formData.nim.trim(),
        nama: this.formData.nama.trim(),
        status: "Dalam Perjalanan",
        ekspedisi: selectedEkspedisi
          ? selectedEkspedisi.nama
          : this.formData.ekspedisi,
        tanggalKirim: this.formData.tanggalKirim,
        paket: this.formData.paketKode,
        total: this.totalHarga,
        perjalanan: [
          {
            waktu: new Date().toISOString().slice(0, 19).replace("T", " "),
            keterangan: `Penerimaan di Loket: ${
              selectedEkspedisi ? selectedEkspedisi.nama : "UT"
            }`,
          },
        ],
      };

      const noDO = this.nextDONumber;
      this.tracking[noDO] = newDO;

      this.resetForm();
      this.showForm = false;
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `DO ${noDO} berhasil ditambahkan!`,
        confirmButtonColor: "#60a5fa",
        background: "rgba(255, 255, 255, 0.05)",
        backdrop: "rgba(0, 0, 0, 0.6)",
        color: "#e0e0e0",
      });
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    formatDateTime(dateTimeString) {
      if (!dateTimeString) return "-";
      const date = new Date(dateTimeString);
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },

    getPaketDetail(kode) {
      return this.paket.find((p) => p.kode === kode);
    },
  },

  mounted() {
    if (!this.formData.tanggalKirim) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      this.formData.tanggalKirim = `${year}-${month}-${day}`;
    }
  },
});
