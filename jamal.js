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
    if (query) {
      // Redirect to search action with query
      window.location.href = `action://act/search?q=${encodeURIComponent(query)}`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setInterval(changePlaceholder, 4000); // Change every 4 seconds

  const searchInput = document.getElementById("gsearch");
  if (searchInput) {
    searchInput.addEventListener("keydown", handleSearch); // Use keydown instead of keypress
  }
});

    
    function toggleMoreMenu() {
                                // Menampilkan atau menyembunyikan menu tambahan
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
    


    
    function ExposeBlocks( options ) {
      
      this.settings = {
        padding: 0,
        ease: 3,
        element: ".jmslider-grivie",
        ...options 
      };
      
      this.scrollers = [];
      
      let $scrollers = document.querySelectorAll( this.settings.element );
      
      if ( !$scrollers.length ) {
        console.warn( "no elements to apply Exposé to" );
        return;
      }
      
      const init = () => {
        const observer = new IntersectionObserver( scrollChecker, { threshold: 0 } ); 
        $scrollers.forEach(($scroller) => {
          if ( $scroller.offsetTop >= window.innerHeight ) {
            observer.observe( $scroller );
          }
        });
      }
      
      const clamp = (val,max = 100,min = 0) => {
        return Math.min(max, Math.max(min, val));
      }
    
      const easeFactory = (k) => {
        const base = (t) => (1 / (1 + Math.exp(-k * t))) - 0.5;
        const correction = 0.5 / base(1);
        return function (t) {
          t = clamp(t);
          return correction * base(2 * t - 1) + 0.5;
        };
      }
    
      const splice = (arr, item) => {
        if (!arr || !item) return;
        const indexOf = arr.indexOf( item );
        if ( indexOf >= 0 ) {
          arr.splice( indexOf, 1 );
        }
      }
        
      const handleScroller = (event) => {
    
        const w = {};
        w.height = window.innerHeight;
        w.top = window.scrollY;
        w.middle = window.scrollY + w.height / 2;
    
        this.scrollers.forEach((scroller) => {
    
          const s = {};
          const padding = scroller.dataset.exposePadding ? parseInt( scroller.dataset.exposePadding ) : this.settings.padding;
          const ease = scroller.dataset.exposeEase ? parseInt( scroller.dataset.exposeEase ) : this.settings.ease;
          const easer = easeFactory( ease );
          
          s.height = scroller.offsetHeight + padding * 2;
          s.width = scroller.offsetWidth;
          s.top = scroller.offsetTop - padding;
          s.middle = s.top + s.height / 2;
    
          s.onePercent = (scroller.scrollWidth - s.width) / 100;
          s.fromMiddle = clamp( (s.middle - w.middle) / (w.height - s.height), 1, -1 );
          s.fromScrollerEnd = ( s.fromMiddle * -1 + 1 ) / 2;
          s.percentScrolled = s.fromScrollerEnd * 100;
          s.easedPercentScrolled = easer( s.fromScrollerEnd ) * 100;
    
          scroller.dataset.ignoreScroll = true;
          scroller.scrollLeft = s.onePercent * s.easedPercentScrolled;
    
        });
    
      };
    
      const handleInterrupts = (e) => {
        const ignore = e.target.dataset.ignoreScroll === "true";
        e.target.dataset.ignoreScroll = false;
        if ( !ignore ) {
          splice( this.scrollers, e.target );
        }
      };
    
      const addInterrupts = () => {
        this.scrollers.forEach((scroller) => {
          scroller.addEventListener( "scroll", handleInterrupts, { passive: true });
        });
      }
    
      const removeInterrupts = () => {
        this.scrollers.forEach((scroller) => {
          scroller.removeEventListener( "scroll", handleInterrupts, { passive: true });
        });
      };
    
      const addScroller = () => {
        window.addEventListener( "scroll", handleScroller, { passive: true });
        addInterrupts();
      };
    
      const removeScroller = () => {
        window.removeEventListener( "scroll", handleScroller, { passive: true });
        removeInterrupts();
      };
    
      const scrollChecker = (entries, observer) => {
        entries.forEach((entry) => {
          if ( entry.isIntersecting ) {
            this.scrollers.push( entry.target );
          } else {
            splice( this.scrollers, entry.target );
          }
        });
        if ( this.scrollers.length ) {
          addScroller();
        } else {
          removeScroller();
        }
      }
    
      init();
      return this;
      
    };
    
    new ExposeBlocks({
      padding: 50
    });
    

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

