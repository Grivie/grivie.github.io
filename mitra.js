// Seluruh script dijalankan setelah halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. DEKLARASI ELEMEN & VARIABEL ---
    const mainDashboardPage = document.getElementById('main-dashboard-page');
    const productManagementPage = document.getElementById('product-management-page');
    const manageProductLink = document.getElementById('manage-product-link');
    const backToDashboardBtn = document.getElementById('back-to-dashboard-btn');
    const storeStatusToggle = document.getElementById('store-status-toggle');
    const statusTokoText = document.getElementById('status-toko');
    const productListContainer = document.getElementById('product-list-container');
    const searchInput = document.getElementById('search-product-input');
    const dataSource = document.getElementById('jagel-data-source');
    let allProducts = []; // Variabel untuk menyimpan data semua produk

    // --- 2. FUNGSI-FUNGSI UTAMA ---

    // Fungsi untuk navigasi antar halaman
    function showPage(pageToShow) {
        mainDashboardPage.classList.remove('active');
        productManagementPage.classList.remove('active');
        pageToShow.classList.add('active');
        window.scrollTo(0, 0);
    }

    // Fungsi untuk merender daftar produk ke dalam kontainer
    function renderProducts(filter = '') {
        productListContainer.innerHTML = ''; // Kosongkan kontainer dulu
        const filterText = filter.toLowerCase();
        
        const filteredProducts = allProducts.filter(product => 
            product.title.toLowerCase().includes(filterText)
        );

        if (filteredProducts.length === 0) {
            productListContainer.innerHTML = `<p style="text-align:center; color: var(--text-light); grid-column: 1 / -1;">Produk tidak ditemukan.</p>`;
        } else {
            filteredProducts.forEach(product => {
                const cardHTML = `
                    <div class="product-card" data-product-id="${product.id}">
                        <a href="${product.link}" class="product-card-img-container">
                             <img src="${product.imgSrc}" alt="${product.title}">
                        </a>
                        <div class="product-info">
                            <div>
                                <h3 class="name">${product.title}</h3>
                                <p class="price">${product.priceFormat}</p>
                            </div>
                            <p class="stock">Stok: Tersedia</p>
                        </div>
                        <div class="product-actions">
                            <a href="${product.editLink}" title="Edit Produk"><i data-feather="edit-2"></i></a>
                            <button class="btn-delete" title="Hapus Produk" data-product-id="${product.id}" data-product-name="${product.title}">
                                <i data-feather="trash-2"></i>
                            </button>
                        </div>
                    </div>`;
                productListContainer.insertAdjacentHTML('beforeend', cardHTML);
            });
        }
        feather.replace(); // Penting: render ulang ikon setelah HTML baru ditambahkan
    }
    
    // Fungsi untuk mengupdate jumlah produk di dashboard
    function updateProductCount() {
        document.getElementById('jumlah-produk-dashboard').textContent = allProducts.length;
    }

    // Fungsi untuk menangani penghapusan produk
    function handleDeleteProduct(e) {
        const deleteButton = e.target.closest('.btn-delete');
        if (!deleteButton) return;

        const productId = deleteButton.dataset.productId;
        const productName = deleteButton.dataset.productName;
        
        if (confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"?`)) {
            // Hapus produk dari array utama
            allProducts = allProducts.filter(p => p.id !== productId);
            
            // Render ulang daftar produk dan update hitungan
            renderProducts(searchInput.value);
            updateProductCount();
            alert(`Produk "${productName}" telah berhasil dihapus.`);
        }
    }
    
    // --- 3. INISIALISASI & EVENT LISTENERS ---

    // Ambil data produk dari HTML statis dan simpan ke dalam array `allProducts`
    if (dataSource) {
        const productElements = dataSource.querySelectorAll('.item-row');
        productElements.forEach(item => {
            const link = item.querySelector('.item-link').href;
            allProducts.push({
                id: item.id,
                link: link,
                imgSrc: item.querySelector('.item-image').src,
                title: item.querySelector('.item-title').textContent,
                priceFormat: item.querySelector('.item-price-format').textContent,
                editLink: link.replace('action://p/', 'action://act/partner_product_edit/')
            });
        });
    }
    
    // Event Listener untuk Navigasi
    manageProductLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(productManagementPage);
    });
    backToDashboardBtn.addEventListener('click', () => showPage(mainDashboardPage));
    
    // Event Listener untuk Toggle Status Toko
    storeStatusToggle.addEventListener('change', function() {
        if (this.checked) {
            statusTokoText.textContent = 'Sedang Buka';
            statusTokoText.classList.remove('closed');
            alert('Status toko berhasil diubah menjadi: BUKA');
        } else {
            statusTokoText.textContent = 'Sedang Tutup';
            statusTokoText.classList.add('closed');
            alert('Status toko berhasil diubah menjadi: TUTUP');
        }
    });
    
    // Event Listener untuk Pencarian dan Penghapusan Produk
    searchInput.addEventListener('input', (e) => renderProducts(e.target.value));
    productListContainer.addEventListener('click', handleDeleteProduct);

    // Inisialisasi Chart.js
    const ctx = document.getElementById('salesChart').getContext('2d');
    const weeklyData = { labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], values: [120, 190, 230, 170, 260, 370, 290] };
    const monthlyData = { labels: ['Mgg 1', 'Mgg 2', 'Mgg 3', 'Mgg 4'], values: [1200, 1500, 950, 1850] };
    let salesChart;
    function createChart(data) {
        if (salesChart) salesChart.destroy();
        salesChart = new Chart(ctx, { /* Opsi Chart.js disederhanakan untuk kejelasan */
            type: 'line', data: { labels: data.labels, datasets: [{
                label: 'Pendapatan (Rp)', data: data.values, backgroundColor: 'rgba(190, 0, 2, 0.1)', borderColor: 'rgba(190, 0, 2, 1)', borderWidth: 2.5, fill: true, tension: 0.4 
            }]}, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { callback: (value) => `Rp${value}K` } } }, plugins: { legend: { display: false } } }
        });
    }
    document.getElementById('tab-weekly').addEventListener('click', function() {
        this.classList.add('active'); document.getElementById('tab-monthly').classList.remove('active'); createChart(weeklyData);
    });
    document.getElementById('tab-monthly').addEventListener('click', function() {
        this.classList.add('active'); document.getElementById('tab-weekly').classList.remove('active'); createChart(monthlyData);
    });
    
    // --- 4. PEMUATAN AWAL ---
    
    renderProducts();       // Render produk untuk pertama kali
    updateProductCount();   // Update hitungan produk
    createChart(weeklyData);// Buat grafik awal
    feather.replace();      // Aktifkan semua ikon
});
