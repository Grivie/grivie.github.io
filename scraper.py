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
    """Fungsi utama untuk melakukan scraping produk."""
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
                # --- PERUBAHAN UTAMA ADA DI SINI ---
                # Mengambil semua data yang Anda inginkan
                
                name = card.find_element(By.CSS_SELECTOR, 'h4.item-name a').text.strip()
                price = card.find_element(By.CSS_SELECTOR, 'p.item-price').text.strip()
                image_url = card.find_element(By.TAG_NAME, 'img').get_attribute('src')
                product_unique_id = card.find_element(By.CSS_SELECTOR, 'input.item-listid').get_attribute('value')
                
                # Mengambil data tambahan dengan cara yang aman (jika elemen tidak ada, diisi "N/A")
                item_stock = card.find_element(By.CSS_SELECTOR, 'input.item-stock').get_attribute('value') if card.find_elements(By.CSS_SELECTOR, 'input.item-stock') else "N/A"
                item_sold = card.find_element(By.CSS_SELECTOR, 'input.item-sold').get_attribute('value') if card.find_elements(By.CSS_SELECTOR, 'input.item-sold') else "N/A"
                item_seen = card.find_element(By.CSS_SELECTOR, 'input.item-seen').get_attribute('value') if card.find_elements(By.CSS_SELECTOR, 'input.item-seen') else "N/A"
                
                # Mencoba mengambil deskripsi dari elemen <p> atau <input>
                item_description_element = card.find_elements(By.CSS_SELECTOR, 'p.item-description')
                if item_description_element and item_description_element[0].text.strip():
                    item_description = item_description_element[0].text.strip()
                else:
                    item_description_input = card.find_elements(By.CSS_SELECTOR, 'input.item-description')
                    item_description = item_description_input[0].get_attribute('value') if item_description_input else "N/A"

                # Menyusun dictionary dengan semua data
                product_data = {
                    'nama_produk': name,
                    'harga': price,
                    'url_gambar': image_url,
                    'url_produk': f"action://p/{product_unique_id}",
                    'item_id': product_unique_id,
                    'item_stock': item_stock,
                    'item_sold': item_sold,
                    'item_seen': item_seen,
                    'item_description': item_description
                }
                products_on_page.append(product_data)

            except Exception as e:
                print(f"\n   └── ⚠️ Gagal memproses produk #{i+1}. Error: {e}")
                continue

        if not products_on_page:
            print(f"\n🚫 Tidak ada produk baru yang berhasil diekstrak. Proses dihentikan.")
            break

        all_products.extend(products_on_page)
        print(f"✅ Halaman ke-{current_page_number_display} selesai! Ditemukan {len(products_on_page)} produk. Total: {len(all_products)}.")
        page_index += 1
        time.sleep(2)

    return all_products

def save_to_json(data, filename="product.json"):
    """Menyimpan data ke file JSON."""
    if not data:
        print("\n😢 Tidak ada produk untuk disimpan.")
        return

    print(f"\n💾 Menyimpan {len(data)} produk ke file '{filename}'...")
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"🎉 Selamat! File '{filename}' telah berhasil disimpan.")

if __name__ == "__main__":
    TARGET_BASE_URL = "https://www.jagel.id/app/grivie-447992/g-food-3131950"
    
    driver = None
    try:
        driver = setup_driver()
        products = scrape_products(driver, TARGET_BASE_URL)
        save_to_json(products)
    except Exception as e:
        print(f"\n❌ Terjadi kesalahan fatal selama proses scraping: {e}")
    finally:
        if driver:
            driver.quit()
            print("\nBrowser virtual ditutup.")
