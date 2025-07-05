/**
 * userlocation.js
 * Fungsi utilitas untuk mengubah nama lokasi (teks) menjadi koordinat geografis (lat, lon)
 * menggunakan Nominatim (OpenStreetMap) API.
 */

async function geocodeLocationName(locationName) {
  // URL API Nominatim untuk forward geocoding
  const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`;

  console.log(`[userlocation.js] Mengirim request ke: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      console.log(`[userlocation.js] Lokasi ditemukan: ${result.display_name}`);
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        name: result.display_name // Menggunakan nama lengkap yang lebih deskriptif
      };
    } else {
      console.warn(`[userlocation.js] Tidak ada hasil untuk lokasi: "${locationName}"`);
      return null; // Lokasi tidak ditemukan
    }
  } catch (error) {
    console.error('[userlocation.js] Gagal melakukan geocoding:', error);
    return null; // Terjadi error
  }
}
