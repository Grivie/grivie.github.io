import json
import os
import sys
import time
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import undetected_chromedriver as uc

TARGET_URL = "https://www.jagel.id/app/grivie-447992/g-food-3131950"
OUTPUT_FILENAME = "product.json"
PAGES_FOR_UPDATE = 5
PAGES_FOR_FULL_SCRAPE = 999

def setup_driver():
    print("✨ Memulai peramban virtual...")
    options = uc.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')

    try:
        driver = uc.Chrome(options=options)
        print("✅ Peramban berhasil dimulai.")
        return driver
    except Exception as e:
        print(f"❌ Kesalahan Kritis: Gagal memulai driver peramban: {e}", file=sys.stderr)
        sys.exit(1)

def _get_element_attribute(parent, selector, attribute, default="N/A"):
    try:
        element = parent.find_element(By.CSS_SELECTOR, selector)
        if attribute == "text":
            return element.text.strip()
        return element.get_attribute(attribute)
    except NoSuchElementException:
        return default

def scrape_products(driver, base_url, max_pages):
    all_products = []
    mode = "Proses Penuh" if max_pages >= PAGES_FOR_FULL_SCRAPE else f"Update Rutin ({max_pages} halaman)"
    print(f"\n🚀 Memulai pengambilan data dari {base_url}")
    print(f"🔩 Mode: {mode}")
    print("---" * 15)

    page_num = 0
    for page_num in range(max_pages):
        current_url = f"{base_url}/{page_num}" if page_num > 0 else base_url
        sys.stdout.write(f"\r📚 Memproses halaman: {page_num + 1}...")
        sys.stdout.flush()

        try:
            driver.get(current_url)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div.component-list-item"))
            )
            time.sleep(2)
        except TimeoutException:
            break

        product_cards = driver.find_elements(By.CSS_SELECTOR, "div.component-list-item")
        if not product_cards:
            break

        for card in product_cards:
            item_id = _get_element_attribute(card, 'input.item-listid', 'value')
            if not item_id or item_id == "N/A":
                continue

            product_data = {
                'item_id': item_id,
                'nama_produk': _get_element_attribute(card, 'h4.item-name a', 'text'),
                'harga': _get_element_attribute(card, 'p.item-price', 'text'),
                'link_gambar': _get_element_attribute(card, 'img', 'src'),
                'link_produk': f"action://p/{item_id}",
                'item_stock': _get_element_attribute(card, 'input.item-stock', 'value'),
                'item_sold': _get_element_attribute(card, 'input.item-sold', 'value'),
                'item_seen': _get_element_attribute(card, 'input.item-seen', 'value'),
                'item_description': _get_element_attribute(card, 'p.item-description', 'text')
            }
            all_products.append(product_data)

    print(f"\n{'---'*15}\n✅ Pengambilan data selesai.")
    print(f"   - Total Halaman Dikunjungi: {page_num + 1}")
    print(f"   - Produk Ditemukan (Sesi Ini): {len(all_products)}")
    print("-" * 20)
    return all_products

def save_data(products_to_save, filename):
    data_map = {}
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data_map = {p['item_id']: p for p in json.load(f)}
        print(f"📖 Memuat {len(data_map)} produk dari database '{filename}'.")
    except (FileNotFoundError, json.JSONDecodeError):
        print(f"📖 Database '{filename}' tidak ditemukan atau rusak. Membuat yang baru.")

    if not products_to_save:
        print("🟡 Tidak ada produk baru ditemukan. Database tidak diubah.")
        return

    updated_count = sum(1 for p in products_to_save if p['item_id'] in data_map)
    added_count = len(products_to_save) - updated_count
    
    for product in products_to_save:
        data_map[product['item_id']] = product

    print(f"📊 Hasil gabungan: {updated_count} produk diperbarui, {added_count} produk baru ditambahkan.")
    
    final_product_list = list(data_map.values())
    print(f"\n💾 Menyimpan {len(final_product_list)} total produk ke '{filename}'...")
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(final_product_list, f, indent=4, ensure_ascii=False)
    print("🎉 File berhasil diperbarui.")

def main():
    max_pages = PAGES_FOR_FULL_SCRAPE if not os.path.exists(OUTPUT_FILENAME) else PAGES_FOR_UPDATE
    driver = None
    try:
        driver = setup_driver()
        scraped_data = scrape_products(driver, TARGET_URL, max_pages)
        save_data(scraped_data, OUTPUT_FILENAME)
    except Exception as e:
        print(f"\n❌ Terjadi kesalahan tak terduga dalam proses utama: {e}", file=sys.stderr)
    finally:
        if driver:
            driver.quit()
            print("\nPeramban ditutup.")

if __name__ == "__main__":
    main()
