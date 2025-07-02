import time
import json
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from tqdm import tqdm

import undetected_chromedriver as uc

def setup_driver():
    """Menyiapkan driver Chrome untuk lingkungan GitHub Actions."""
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

def scrape_products(driver, base_url):
    """Fungsi utama untuk melakukan scraping produk. (Fungsi ini tidak berubah)"""
    all_products = []
    page_index = 0
    max_pages = 3 
    LOAD_TIMEOUT_SEC = 30
    SLEEP_AFTER_LOAD_SEC = 5

    print(f"\n🚀 Memulai proses scraping dari: {base_url}")
    print(f"🔩 Mode Percobaan: Akan mengambil maksimal {max_pages} halaman.")
    print("---" * 15)

    while page_index < max_pages:
        current_page_number_display = page_index + 1
        current_page_url = f"{base_url}/{page_index}" if page_index > 0 else base_url

        print(f"\n📚 Mengunjungi halaman ke-{current_page_number_display} dari {max_pages}...")

        try:
            driver.get(current_page_url)
            WebDriverWait(driver, LOAD_TIMEOUT_SEC).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div.component-list-item"))
            )
            time.sleep(SLEEP_AFTER_LOAD_SEC)
        except TimeoutException:
            print(f"⚠️ Timeout: Halaman ke-{current_page_number_display} tidak memuat. Proses dihentikan.")
            break
        except Exception as e:
            print(f"❌ ERROR: Gagal membuka halaman ke-{current_page_number_display}. Detail: {e}")
            break

        product_cards = driver.find_elements(By.CSS_SELECTOR, "div.component-list-item")
        if not product_cards:
            print(f"🔍 Tidak ada produk ditemukan di halaman ke-{current_page_number_display}. Proses dihentikan.")
            break

        products_on_page = []
        for i, card in tqdm(enumerate(product_cards), total=len(product_cards), desc=f"   Processing page {current_page_number_display}", unit=" product"):
            try:
                product_unique_id = card.find_element(By.CSS_SELECTOR, 'input.item-listid').get_attribute('value')
                product_data = {
                    'nama_produk': card.find_element(By.CSS_SELECTOR, 'h4.item-name a').text.strip(),
                    'harga': card.find_element(By.CSS_SELECTOR, 'p.item-price').text.strip(),
                    'url_gambar': card.find_element(By.TAG_NAME, 'img').get_attribute('src'),
                    'url_produk': f"action://p/{product_unique_id}",
                    'item_id': product_unique_id,
                    'item_stock': card.find_element(By.CSS_SELECTOR, 'input.item-stock').get_attribute('value') if card.find_elements(By.CSS_SELECTOR, 'input.item-stock') else "N/A",
                    'item_sold': card.find_element(By.CSS_SELECTOR, 'input.item-sold').get_attribute('value') if card.find_elements(By.CSS_SELECTOR, 'input.item-sold') else "N/A",
                    'item_seen': card.find_element(By.CSS_SELECTOR, 'input.item-seen').get_attribute('value') if card.find_elements(By.CSS_SELECTOR, 'input.item-seen') else "N/A",
                    'item_description': card.find_element(By.CSS_SELECTOR, 'p.item-description').text.strip() or (card.find_elements(By.CSS_SELECTOR, 'input.item-description') and card.find_element(By.CSS_SELECTOR, 'input.item-description').get_attribute('value')) or "N/A"
                }
                products_on_page.append(product_data)
            except Exception as e:
                print(f"\n   └── ⚠️ Gagal memproses produk #{i+1}. Error: {e}")
                continue
        all_products.extend(products_on_page)
        
        if not products_on_page:
            break
        page_index += 1
    
    print(f"\n✅ Scraping selesai. Total produk ditemukan: {len(all_products)}.")
    return all_products

def update_and_save_data(scraped_products, filename="product.json"):
    """
    Fungsi baru untuk membaca data lama, menggabungkan dengan data baru,
    dan menyimpan hasilnya.
    """
    # Langkah 1: Baca data lama jika file sudah ada
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            old_products_list = json.load(f)
        # Ubah list lama menjadi dictionary untuk pencarian cepat berdasarkan item_id
        old_products_map = {product['item_id']: product for product in old_products_list}
        print(f"📖 Berhasil membaca {len(old_products_map)} produk dari '{filename}'.")
    except (FileNotFoundError, json.JSONDecodeError):
        old_products_map = {}
        print(f"File '{filename}' tidak ditemukan atau kosong. Akan membuat file baru.")

    # Jika scraping gagal atau tidak menghasilkan apa-apa, jangan lanjutkan.
    if not scraped_products:
        print("Scraping tidak menghasilkan data baru. Proses update dibatalkan.")
        # Jika ada data lama, simpan kembali untuk memastikan format tetap benar.
        if old_products_map:
             with open(filename, 'w', encoding='utf-8') as f:
                json.dump(list(old_products_map.values()), f, indent=4, ensure_ascii=False)
        return

    # Langkah 2: Lakukan proses update
    updated_count = 0
    added_count = 0
    
    # Gunakan data lama sebagai basis
    final_data_map = old_products_map.copy()

    for product in scraped_products:
        item_id = product['item_id']
        if item_id in final_data_map:
            # Jika produk sudah ada, perbarui datanya
            final_data_map[item_id].update(product)
            updated_count += 1
        else:
            # Jika produk baru, tambahkan
            final_data_map[item_id] = product
            added_count += 1
    
    print(f"📊 Proses merge selesai: {updated_count} produk diperbarui, {added_count} produk baru ditambahkan.")

    # Langkah 3: Ubah kembali ke format list dan simpan
    final_product_list = list(final_data_map.values())
    
    print(f"\n💾 Menyimpan total {len(final_product_list)} produk ke file '{filename}'...")
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(final_product_list, f, indent=4, ensure_ascii=False)
    print("🎉 File berhasil di-update!")


if __name__ == "__main__":
    TARGET_BASE_URL = "https://www.jagel.id/app/grivie-447992/g-food-3131950"
    
    driver = None
    try:
        driver = setup_driver()
        scraped_products = scrape_products(driver, TARGET_BASE_URL)
        update_and_save_data(scraped_products)
        
    except Exception as e:
        print(f"\n❌ Terjadi kesalahan fatal: {e}")
        # Bahkan jika ada error, kita bisa coba menyimpan data lama yang sudah dibaca
        # untuk mencegah kehilangan data total (opsional, tergantung kebutuhan).
        # Untuk saat ini kita biarkan agar tidak ada perubahan jika ada error fatal.
    finally:
        if driver:
            driver.quit()
            print("\nBrowser virtual ditutup.")

