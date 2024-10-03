    
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const input = document.getElementById('searchInput').value;
        const formattedInput = input.split(' ').join('_'); // Mengganti spasi dengan underscore
        const url = `https://app.grivie.id/search/${formattedInput}`;
        window.location.href = url; // Redirect ke URL hasil pencarian
    });

        // Ganti nama sesuai kebutuhan
    const nama = "{nama}";

    // Array makanan acak
    const makanan = [
        "Nasi Goreng",
        "Mie Ayam",
        "Sate Ayam",
        "Bakso",
        "Rendang",
        "Gado-Gado",
        "Soto Ayam",
        "Martabak",
        "Ayam Goreng",
        "Pizza"
    ];

    // Fungsi untuk mengupdate placeholder
    function updatePlaceholder() {
        const randomMakanan = makanan[Math.floor(Math.random() * makanan.length)];
        const placeholderText = `${randomMakanan}?`;
        document.getElementById("searchInput").placeholder = placeholderText;
    }

    // Update placeholder setiap 3 detik
    setInterval(updatePlaceholder, 3000);


document.addEventListener("DOMContentLoaded", function () {
    const itemRows = document.querySelectorAll(".item-row");
    itemRows.forEach((itemRow) => {
        const randomRating = Math.floor(Math.random() * 3) + 3;
        let stars = "";
        for (let j = 0; j < 5; j++) {
            if (j < randomRating) {
                stars += `<span class="star">★</span>`;
            } else {
                stars += `<span class="star">☆</span>`;
            }
        }
        const rating = document.createElement("div");
        rating.classList.add("rating");
        rating.innerHTML = stars;
        itemRow.appendChild(rating);
    });
});
const items = document.querySelectorAll(".item-row");
items.forEach((item) => {
    const randomEffect = Math.floor(Math.random() * 3);
    switch (randomEffect) {
        case 0:
            item.style.animation = "slideIn 0.5s forwards";
            break;
        case 1:
            item.style.animation = "slideInRotate 0.5s forwards";
            break;
        case 2:
            item.style.animation = "slideInBounce 0.5s forwards";
            break;
    }
});
function showPromoBox() {
    const promoBox = document.getElementById("promoBox");
    const profileFullscreen = document.getElementById("profile-fullscreen");
    if (profileFullscreen.style.display === "block") {
        profileFullscreen.style.display = "none";
    }
    promoBox.style.display = promoBox.style.display === "block" ? "none" : "block";
}
document.getElementById("profile-item").onclick = function () {
    const profileFullscreen = document.getElementById("profile-fullscreen");
    const promoBox = document.getElementById("promoBox");
    if (promoBox.style.display === "block") {
        promoBox.style.display = "none";
    }
    profileFullscreen.style.display = profileFullscreen.style.display === "block" ? "none" : "block";
};
document.getElementById("close-profile-btn").onclick = function () {
    const profileFullscreen = document.getElementById("profile-fullscreen");
    profileFullscreen.style.display = "none";
};
function closeAllBoxes() {
    document.getElementById("promoBox").style.display = "none";
    document.getElementById("profile-fullscreen").style.display = "none";
}
document.getElementById("home-btn").onclick = closeAllBoxes;
document.getElementById("chat-btn").onclick = closeAllBoxes;
document.getElementById("shareReferral").addEventListener("click", function () {
    const nama = "{nama}";
    const username = "{Username}";
    const message = `Hallo kak 🙋‍♂️⚓\nSaya *{nama}* ingin mengajak Anda untuk *Mendownload* Aplikasi ini\n\n*DOWNLOAD Sekarang dan dapatkan penghasilan tambahan* 👐👐👐\nhttps://play.google.com/store/apps/details?id=com.mygrivieindonesia.grivieindonesia\n\nJangan lupa masukkan code ini *{username}* ketika Register Dan dapatkan Promo-promo menarik di dalamnya`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
});
function openPopup2() {
    document.getElementById("popupcabang2").style.display = "block";
    document.getElementById("popup-image-2").classList.add("blur-background");
}
function closePopup2() {
    document.getElementById("popupcabang2").style.display = "none";
    document.getElementById("popup-image-2").classList.remove("blur-background");
}
function openPopup() {
    document.getElementById("popupcabang").style.display = "block";
    document.getElementById("popup-image").classList.add("blur-background");
}
function closePopup() {
    document.getElementById("popupcabang").style.display = "none";
    document.getElementById("popup-image").classList.remove("blur-background");
}

