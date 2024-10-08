fetch('https://grivie.id/promo/api-promo.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const container = document.getElementById('voucherContainer');
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(promo => {
                        const voucher = document.createElement('div');
                        voucher.classList.add('voucher');

                        // Ambil waktu berakhir pada tanggal promo_berakhir di jam 23:59
                        const endDate = new Date(promo.promo_berakhir + "T23:59:00");

                        // Menampilkan voucher
                        voucher.innerHTML = `
    <div class="voucher-content">
        <div class="left-column">
            <h3>${promo.nama_mitra}</h3>
            <p><strong>${promo.nama_promo}</strong></p>
            <p>Tanggal Berakhir: ${endDate.toLocaleDateString('id-ID')}</p>
        </div>
        <div class="right-column">
            <div class="voucher-label">Kode Voucher:</div>
            <div class="code-container">
                <span class="code">${promo.kode_promo}</span>
                <span class="copy-icon material-icons" onclick="copyToClipboard('${promo.kode_promo}')">content_copy</span>
            </div>
            <a href="${promo.link_mitra}" class="button-promo" target="_blank">
                <span class="material-icons">redeem</span> 
                Ambil Promo
            </a>
        </div>
    </div>
`;


                        // Tambahkan voucher ke container
                        container.appendChild(voucher);
                    });
                } else {
                    container.innerHTML = `<p>Tidak ada data promo.</p>`;
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                const container = document.getElementById('voucherContainer');
                container.innerHTML = `<p>Terjadi kesalahan saat mengambil data.</p>`;
            });

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Kode promo disalin: ' + text);
            }).catch(err => {
                console.error('Error copying text: ', err);
            });
        }

        function getPromo(kode) {
            // Fungsi untuk menangani ambil promo (dapat diisi dengan logika yang diperlukan)
            alert('Promo diambil: ' + kode);
        }
