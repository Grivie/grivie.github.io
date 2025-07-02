import time
import json
import os
import sys
import base64
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException

import undetected_chromedriver as uc

# --- FUNGSI UNTUK MENGAMBIL ALAMAT TARGET ---
def get_target_source():
    """Membangun alamat target dari string yang disandikan."""
    try:
        _p1 = "aHR0cHM6Ly93d3cuamFnZWwuaWQvYXBwLw=="
        _p2 = "Z3JpdmllLTQ0Nzk5Mi8="
        _p3 = "Zy1mb29kLTMxMzE5NTA="
        
        part_a = base64.b64decode(_p1).decode('utf-8')
        part_b = base64.b64decode(_p2).decode('utf-8')
        part_c = base64.b64decode(_p3).decode('utf-8')
        return f"{part_a}{part_b}{part_c}"
    except Exception:
        print("❌ ERROR: Gagal memuat konfigurasi internal.")
        return None

# --- (Fungsi-fungsi lain tetap sama) ---
def setup_driver():
    """Menyiapkan driver Chrome."""
    print("✨ Menyiapkan lingkungan scraping...")
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    
    chrome_binary_path = '/usr/bin/google-chrome'
    if os.path.exists(chrome_binary_path):
        options.binary_location = chrome_binary_path
        driver = uc.Chrome(options=options, browser_executable_path=chrome_binary_path)
    else:
        driver = uc.Chrome(options=options)
        
    print("✅ Browser virtual berhasil diinisialisasi!")
    return driver

def scrape_products(driver, base_address, max_pages):
    """Fungsi utama untuk scraping."""
    all_products = []
    page_index = 0
    print(f"\n🚀 Memulai proses pengambilan data...")
    if max_pages >= 999:
        print("🔩 Mode: Proses Penuh.")
    else:
        print(f"🔩 Mode: Update Rutin (maksimal {max_pages} halaman).")
    print("---" * 15)

    while page_index < max_pages:
        current_page_number_display = page_index + 1
        sys.stdout.write(f"\r📚 Memproses halaman: {current_page_number_display}...")
        sys.stdout.flush()

        current_address = f"{base_address}/{page_index}" if page_index > 0 else base_address
        try:
            driver.get(current_address)
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.component-list-item")))
            time.sleep(3)
        except:
            break

        product_cards = driver.find_elements(By.CSS_SELECTOR, "div.component-list-item")
        if not product_cards:
            break

        products_on_page = []
        for card in product_cards:
            try:
                product_unique_id = card.find_element(By.CSS_SELECTOR, 'input.item-listid').get_attribute('value')
                product_data = {
                    'nama_produk': card.find_element(By.CSS_SELECTOR, 'h4.item-name a').text.strip(),
                    'harga': card.find_element(By.CSS_SELECTOR, 'p.item-price').text.strip(),
                    'link_gambar': card.find_element(By.TAG_NAME, 'img').get_attribute('src'),
                    'link_produk': f"action://p/{product_unique_id}",
                    'item_id': product_unique_id,
                    'item_stock': card.find_element(By.CSS_SELECTOR, 'input.item-stock').get_attribute('value') if card.find_elements(By.CSS_SELECTOR, 'input.item-stock') else "N/A",
                    'item_sold': card.find_element(By.CSS_SELECTOR, 'input.item-sold').get_attribute('value') if card.find_elements(By.CSS_SELECTOR, 'input.item-sold') else "N/A",
                    'item_seen': card.find_element(By.CSS_SELECTOR, 'input.item-seen').get_attribute('value') if card.find_elements(By.CSS_SELECTOR, 'input.item-seen') else "N/A",
                    'item_description': card.find_element(By.CSS_SELECTOR, 'p.item-description').text.strip() or (card.find_elements(By.CSS_SELECTOR, 'input.item-description') and card.find_element(By.CSS_SELECTOR, 'input.item-description').get_attribute('value')) or "N/A"
                }
                products_on_page.append(product_data)
            except:
                continue
        all_products.extend(products_on_page)
        page_index += 1
    
    print()
    print("---" * 15)
    print("✅ Pengambilan Data Selesai")
    print("-" * 20)
    print(f"  - Halaman Dikunjungi : {page_index}")
    print(f"  - Produk Ditemukan  : {len(all_products)} (Sesi ini)")
    print("-" * 20)
    
    return all_products

def update_and_save_data(scraped_products, filename="product.json"):
    """Membaca data lama, menggabungkan, dan menyimpan."""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            old_products_list = json.load(f)
        old_products_map = {product['item_id']: product for product in old_products_list}
        print(f"📖 Membaca {len(old_products_map)} produk dari database lama.")
    except:
        old_products_map = {}
        print(f"📖 Database '{filename}' tidak ditemukan, akan membuat baru.")

    if not scraped_products:
        print("🟡 Tidak ada produk baru ditemukan. Database tidak diubah.")
        return

    updated_count = 0
    added_count = 0
    final_data_map = old_products_map.copy()

    for product in scraped_products:
        item_id = product['item_id']
        if item_id in final_data_map:
            final_data_map[item_id].update(product)
            updated_count += 1
        else:
            final_data_map[item_id] = product
            added_count += 1
    
    print(f"📊 Hasil Merge: {updated_count} produk diperbarui, {added_count} produk baru ditambahkan.")
    final_product_list = list(final_data_map.values())
    
    print(f"\n💾 Menyimpan total {len(final_product_list)} produk ke database...")
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(final_product_list, f, indent=4, ensure_ascii=False)
    print("🎉 File berhasil di-update!")


if __name__ == "__main__":
    # Langsung panggil fungsi untuk mendapatkan alamat target
    TARGET_SOURCE = get_target_source()
    if not TARGET_SOURCE:
        sys.exit(1)

    print("🚀 Konfigurasi berhasil dimuat. Memulai skrip...")

    FILENAME = "product.json"
    if os.path.exists(FILENAME):
        max_pages_to_scrape = 5
    else:
        max_pages_to_scrape = 999 

    driver = None
    try:
        driver = setup_driver()
        scraped_products = scrape_products(driver, TARGET_SOURCE, max_pages_to_scrape)
        update_and_save_data(scraped_products, FILENAME)
    except Exception as e:
        print(f"\n❌ Terjadi kesalahan fatal: {e}")
    finally:
        if driver:
            driver.quit()
            print("\nBrowser virtual ditutup.")

