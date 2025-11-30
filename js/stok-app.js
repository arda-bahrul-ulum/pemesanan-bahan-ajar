const dummyData = {
  upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
  kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
  stok: [
    {
      kode: "EKMA4116",
      judul: "Pengantar Manajemen",
      kategori: "MK Wajib",
      upbjj: "Jakarta",
      lokasiRak: "R1-A3",
      harga: 65000,
      qty: 28,
      safety: 20,
      catatanHTML: "<em>Edisi 2024, cetak ulang</em>",
    },
    {
      kode: "EKMA4115",
      judul: "Pengantar Akuntansi",
      kategori: "MK Wajib",
      upbjj: "Jakarta",
      lokasiRak: "R1-A4",
      harga: 60000,
      qty: 7,
      safety: 15,
      catatanHTML: "<strong>Cover baru</strong>",
    },
    {
      kode: "BIOL4201",
      judul: "Biologi Umum (Praktikum)",
      kategori: "Praktikum",
      upbjj: "Surabaya",
      lokasiRak: "R3-B2",
      harga: 80000,
      qty: 12,
      safety: 10,
      catatanHTML: "Butuh <u>pendingin</u> untuk kit basah",
    },
    {
      kode: "FISIP4001",
      judul: "Dasar-Dasar Sosiologi",
      kategori: "MK Pilihan",
      upbjj: "Makassar",
      lokasiRak: "R2-C1",
      harga: 55000,
      qty: 2,
      safety: 8,
      catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder",
    },
  ],
};

var stokApp = new Vue({
  el: "#stok-app",
  data: {
    stok: JSON.parse(JSON.stringify(dummyData.stok)),
    upbjjList: dummyData.upbjjList,
    kategoriList: dummyData.kategoriList,

    // Filter data
    filterUpbjj: "",
    filterKategori: "",
    filterLowStock: false,

    // Sort data
    sortBy: "",
    sortOrder: "asc",

    // Form tambah data
    formData: {
      kode: "",
      judul: "",
      kategori: "",
      upbjj: "",
      lokasiRak: "",
      harga: "",
      qty: "",
      safety: "",
      catatanHTML: "",
    },
    formErrors: {},
    showForm: false,

    // Edit data
    editingIndex: -1,
    editData: {},
    editErrors: {},
    showEditModal: false,
  },

  computed: {
    // filter
    filteredKategoriList() {
      if (!this.filterUpbjj) {
        return this.kategoriList;
      }

      const kategoriSet = new Set();
      this.stok.forEach((item) => {
        if (item.upbjj === this.filterUpbjj) {
          kategoriSet.add(item.kategori);
        }
      });
      return Array.from(kategoriSet);
    },

    filteredAndSortedStok() {
      let result = [...this.stok];

      if (this.filterUpbjj) {
        result = result.filter((item) => item.upbjj === this.filterUpbjj);
      }

      if (this.filterKategori) {
        result = result.filter((item) => item.kategori === this.filterKategori);
      }

      if (this.filterLowStock) {
        result = result.filter(
          (item) => item.qty < item.safety || item.qty === 0
        );
      }

      // Sort
      if (this.sortBy) {
        result.sort((a, b) => {
          let aVal, bVal;

          if (this.sortBy === "judul") {
            aVal = a.judul.toLowerCase();
            bVal = b.judul.toLowerCase();
          } else if (this.sortBy === "stock") {
            aVal = a.qty;
            bVal = b.qty;
          } else if (this.sortBy === "harga") {
            aVal = a.harga;
            bVal = b.harga;
          }

          if (this.sortOrder === "asc") {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      return result;
    },
  },

  watch: {
    // Watcher 1: Reset filter kategori ketika UT-Daerah diubah
    filterUpbjj(newVal) {
      if (!newVal) {
        this.filterKategori = "";
      } else {
        if (
          this.filterKategori &&
          !this.filteredKategoriList.includes(this.filterKategori)
        ) {
          this.filterKategori = "";
        }
      }
    },

    // Watcher 2: Monitor perubahan stok untuk logging atau validasi
    stok: {
      handler(newStok) {
        const lowStockCount = newStok.filter(
          (item) => item.qty < item.safety || item.qty === 0
        ).length;
        if (lowStockCount > 0 && this.filterLowStock === false) {
          // Bisa digunakan untuk notifikasi atau alert
          console.log(`Ada ${lowStockCount} item dengan stok rendah`);
        }
      },
      deep: true,
    },

    // Watcher 3: Validasi form saat data berubah
    "formData.kode"(newVal) {
      if (newVal && this.isKodeExists(newVal)) {
        this.formErrors.kode = "Kode sudah ada";
      } else {
        delete this.formErrors.kode;
      }
    },
  },

  methods: {
    // Method untuk mendapatkan status
    getItemStatus(item) {
      if (item.qty === 0) {
        return { text: "Kosong", class: "status-kosong" };
      } else if (item.qty < item.safety) {
        return { text: "Menipis", class: "status-menipis" };
      } else {
        return { text: "Aman", class: "status-aman" };
      }
    },

    // Reset semua filter
    resetFilters() {
      this.filterUpbjj = "";
      this.filterKategori = "";
      this.filterLowStock = false;
      this.sortBy = "";
      this.sortOrder = "asc";
    },

    // Toggle form tambah data
    toggleForm() {
      this.showForm = !this.showForm;
      if (!this.showForm) {
        this.resetForm();
      }
    },

    // Reset form
    resetForm() {
      this.formData = {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: "",
        qty: "",
        safety: "",
        catatanHTML: "",
      };
      this.formErrors = {};
    },

    // Validasi form
    validateForm() {
      this.formErrors = {};
      let isValid = true;

      if (!this.formData.kode.trim()) {
        this.formErrors.kode = "Kode wajib diisi";
        isValid = false;
      } else if (this.isKodeExists(this.formData.kode)) {
        this.formErrors.kode = "Kode sudah ada";
        isValid = false;
      }

      if (!this.formData.judul.trim()) {
        this.formErrors.judul = "Judul wajib diisi";
        isValid = false;
      }

      if (!this.formData.kategori) {
        this.formErrors.kategori = "Kategori wajib dipilih";
        isValid = false;
      }

      if (!this.formData.upbjj) {
        this.formErrors.upbjj = "UT-Daerah wajib dipilih";
        isValid = false;
      }

      if (!this.formData.lokasiRak.trim()) {
        this.formErrors.lokasiRak = "Lokasi Rak wajib diisi";
        isValid = false;
      }

      if (!this.formData.harga || this.formData.harga <= 0) {
        this.formErrors.harga = "Harga harus lebih dari 0";
        isValid = false;
      }

      if (this.formData.qty === "" || this.formData.qty < 0) {
        this.formErrors.qty = "Jumlah stok harus >= 0";
        isValid = false;
      }

      if (this.formData.safety === "" || this.formData.safety < 0) {
        this.formErrors.safety = "Safety stock harus >= 0";
        isValid = false;
      }

      return isValid;
    },

    // Cek apakah kode sudah ada
    isKodeExists(kode) {
      return this.stok.some((item) => item.kode === kode);
    },

    // Tambah data baru
    addStok() {
      if (!this.validateForm()) {
        return;
      }

      const newItem = {
        kode: this.formData.kode.trim(),
        judul: this.formData.judul.trim(),
        kategori: this.formData.kategori,
        upbjj: this.formData.upbjj,
        lokasiRak: this.formData.lokasiRak.trim(),
        harga: parseInt(this.formData.harga),
        qty: parseInt(this.formData.qty),
        safety: parseInt(this.formData.safety),
        catatanHTML: this.formData.catatanHTML.trim() || "",
      };

      this.stok.push(newItem);
      this.resetForm();
      this.showForm = false;
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil ditambahkan!",
        confirmButtonColor: "#60a5fa",
        background: "rgba(255, 255, 255, 0.05)",
        backdrop: "rgba(0, 0, 0, 0.6)",
        color: "#e0e0e0",
      });
    },

    // Edit data
    editStok(index) {
      this.editingIndex = index;
      this.editData = JSON.parse(
        JSON.stringify(this.filteredAndSortedStok[index])
      );
      this.showEditModal = true;
    },

    // Validasi edit
    validateEdit() {
      const errors = {};
      let isValid = true;

      if (!this.editData.kode.trim()) {
        errors.kode = "Kode wajib diisi";
        isValid = false;
      }

      if (!this.editData.judul.trim()) {
        errors.judul = "Judul wajib diisi";
        isValid = false;
      }

      if (!this.editData.kategori) {
        errors.kategori = "Kategori wajib dipilih";
        isValid = false;
      }

      if (!this.editData.upbjj) {
        errors.upbjj = "UT-Daerah wajib dipilih";
        isValid = false;
      }

      if (!this.editData.lokasiRak.trim()) {
        errors.lokasiRak = "Lokasi Rak wajib diisi";
        isValid = false;
      }

      if (!this.editData.harga || this.editData.harga <= 0) {
        errors.harga = "Harga harus lebih dari 0";
        isValid = false;
      }

      if (this.editData.qty === "" || this.editData.qty < 0) {
        errors.qty = "Jumlah stok harus >= 0";
        isValid = false;
      }

      if (this.editData.safety === "" || this.editData.safety < 0) {
        errors.safety = "Safety stock harus >= 0";
        isValid = false;
      }

      this.editErrors = errors;
      return isValid;
    },

    // Simpan edit
    saveEdit() {
      if (!this.validateEdit()) {
        return;
      }

      // Cari index di array stok asli
      const originalItem = this.filteredAndSortedStok[this.editingIndex];
      const originalIndex = this.stok.findIndex(
        (item) => item.kode === originalItem.kode
      );

      if (originalIndex !== -1) {
        this.stok[originalIndex] = JSON.parse(JSON.stringify(this.editData));
        this.cancelEdit();
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil diupdate!",
          confirmButtonColor: "#60a5fa",
          background: "rgba(255, 255, 255, 0.05)",
          backdrop: "rgba(0, 0, 0, 0.6)",
          color: "#e0e0e0",
        });
      }
    },

    // Batal edit
    cancelEdit() {
      this.showEditModal = false;
      this.editingIndex = -1;
      this.editData = {};
      this.editErrors = {};
    },
  },
});
