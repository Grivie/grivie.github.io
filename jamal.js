const placeholders = ["Sate", "Nasi Goreng", "Es Teler", "Rujak"];
let index = 0;

function changePlaceholder() {
  const searchInput = document.getElementById("gsearch");
  if (searchInput) {
    searchInput.setAttribute("placeholder", placeholders[index]);
    index = (index + 1) % placeholders.length;
  }
}

function handleSearch(event) {
  if (event.key === 'Enter') {
    const query = document.getElementById("gsearch").value;
    console.log("Pencarian dilakukan dengan query:", query); // Tambahkan log untuk debug
    if (query) {
      // Redirect to search action with query
      window.location.href = `action://act/search?q=${encodeURIComponent(query)}`;
    } else {
      console.log("Input pencarian kosong."); // Tambahkan log jika tidak ada query
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setInterval(changePlaceholder, 4000); // Change every 4 seconds

  const searchInput = document.getElementById("gsearch");
  if (searchInput) {
    searchInput.addEventListener("keydown", handleSearch); // Use keydown instead of keypress
  } else {
    console.log("Elemen input pencarian tidak ditemukan."); // Tambahkan log jika elemen tidak ditemukan
  }
});


// Toggle Menu Function
function toggleMoreMenu() {
  const icons = document.querySelectorAll('.icon-section .icon');
  icons.forEach((icon, index) => {
    if (index >= 8) { // Tampilkan ikon tambahan
      icon.style.display = (icon.style.display === 'block') ? 'none' : 'block';
    }
  });
}

// Tampilkan beberapa ikon pada load
window.onload = function() {
  const icons = document.querySelectorAll('.icon-section .icon');
  for (let i = 0; i < 8; i++) {
    icons[i].style.display = 'block';
  }
};

// ExposeBlocks function
function ExposeBlocks(options) {
  this.settings = {
    padding: 0,
    ease: 3,
    element: ".jmslider-grivie",
    ...options
  };

  this.scrollers = [];
  
  let $scrollers = document.querySelectorAll(this.settings.element);

  if (!$scrollers.length) {
    console.warn("no elements to apply Exposé to");
    return;
  }

  const init = () => {
    const observer = new IntersectionObserver(scrollChecker, { threshold: 0 });
    $scrollers.forEach(($scroller) => {
      if ($scroller.offsetTop >= window.innerHeight) {
        observer.observe($scroller);
      }
    });
  }

  const handleScroller = (event) => {
    // Existing implementation...
  };

  // Rest of the ExposeBlocks implementation...

  init();
  return this;
};

new ExposeBlocks({
  padding: 50
});

// Show Promo Box
function showPromoBox() {
  const promoBox = document.getElementById('promoBox');
  const profileFullscreen = document.getElementById('profile-fullscreen');

  // Tutup promo box jika profile box terbuka
  if (profileFullscreen.style.display === 'block') {
    profileFullscreen.style.display = 'none';
  }

  promoBox.style.display = promoBox.style.display === 'block' ? 'none' : 'block';
}

document.getElementById('profile-item').onclick = function() {
  const profileFullscreen = document.getElementById('profile-fullscreen');
  const promoBox = document.getElementById('promoBox');

  // Tutup promo box jika profile box dibuka
  if (promoBox.style.display === 'block') {
    promoBox.style.display = 'none';
  }

  // Tampilkan profile box
  profileFullscreen.style.display = profileFullscreen.style.display === 'block' ? 'none' : 'block';
};

document.getElementById('close-profile-btn').onclick = function() {
  const profileFullscreen = document.getElementById('profile-fullscreen');
  profileFullscreen.style.display = 'none';
};

// Fungsi untuk menutup semua box
function closeAllBoxes() {
  document.getElementById('promoBox').style.display = 'none';
  document.getElementById('profile-fullscreen').style.display = 'none';
}

// Menambahkan event listener untuk setiap item menu
document.getElementById('home-btn').onclick = closeAllBoxes;
document.getElementById('chat-btn').onclick = closeAllBoxes;

document.getElementById('shareReferral').addEventListener('click', function() {
  const nama = '{nama}'; // Ganti dengan nama yang sesuai
  const username = '{Username}'; // Ganti dengan username yang sesuai
  const message = `Hallo kak 🙋‍♂️⚓\nSaya *{nama}* ingin mengajak Anda untuk *Mendownload* Aplikasi ini\n\n*DOWNLOAD Sekarang dan dapatkan penghasilan tambahan* 👐👐👐\nhttps://play.google.com/store/apps/details?id=com.mygrivieindonesia.grivieindonesia\n\nJangan lupa masukkan code ini *{username}* ketika Register Dan dapatkan Promo-promo menarik di dalamnya`;
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});
