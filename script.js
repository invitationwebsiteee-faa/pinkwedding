// =========================================================
// PENGATURAN (ganti sesuai acara)
// =========================================================
const TANGGAL_ACARA   = '2027-02-14T08:00:00';
const JUDUL_KALENDER  = 'Pernikahan Rara & Dimas';
const LOKASI_KALENDER = 'Gedung Serbaguna, Jl. Melati No. 5, Blitar';

// Cerita "Kisah Kami": satu foto = satu bagian cerita
const KISAH = [
  {
    foto: 'assets/kisah-1.jpg',
    tulisan: 'Pertama bertemu',
    tanggal: 'Maret 2021 · Surabaya',
    judul: 'Awal Bertemu',
    isi: 'Kami pertama kali bertemu di sebuah acara kampus. Awalnya hanya saling sapa, tidak ada yang menyangka obrolan singkat itu jadi awal semuanya.'
  },
  {
    foto: 'assets/kisah-2.jpg',
    tulisan: 'Mulai dekat',
    tanggal: 'Agustus 2021',
    judul: 'Semakin Dekat',
    isi: 'Dari pesan-pesan kecil setiap hari, kami jadi sering pergi bersama. Kami sadar ada rasa nyaman yang tidak bisa dijelaskan.'
  },
  {
    foto: 'assets/kisah-3.jpg',
    tulisan: 'Hari lamaran',
    tanggal: 'Desember 2025',
    judul: 'Lamaran',
    isi: 'Dengan restu kedua keluarga, kami memutuskan untuk melangkah ke jenjang yang lebih serius.'
  },
  {
    foto: 'assets/kisah-4.jpg',
    tulisan: 'Menuju halal',
    tanggal: '14 Februari 2027',
    judul: 'Hari Bahagia',
    isi: 'Dan kini kami siap memulai babak baru. Terima kasih sudah menjadi bagian dari perjalanan kami.'
  }
];

// Foto untuk halaman Galeri
const GALERI = [
  'assets/galeri-1.jpg', 'assets/galeri-2.jpg', 'assets/galeri-3.jpg',
  'assets/galeri-4.jpg', 'assets/galeri-5.jpg', 'assets/galeri-6.jpg'
];

// =========================================================
// ALAT BANTU
// =========================================================
const $ = id => document.getElementById(id);
const tunggu = ms => new Promise(r => setTimeout(r, ms));

function gantiTahap(dari, ke) {
  $(dari).classList.remove('aktif');
  $(ke).classList.add('aktif');
}

// =========================================================
// 1. NAMA TAMU DARI LINK  (contoh: index.html?to=Budi+Santoso)
// =========================================================
const tamu = new URLSearchParams(location.search).get('to');
if (tamu) $('namaTamu').textContent = tamu;

// =========================================================
// 2. MUSIK
// =========================================================
const musik = $('musik');
const vinyl = $('vinyl');

function putarMusik() {
  musik.play().then(() => vinyl.classList.add('putar')).catch(() => {});
}
function hentikanMusik() {
  musik.pause();
  vinyl.classList.remove('putar');
}
vinyl.addEventListener('click', () => musik.paused ? putarMusik() : hentikanMusik());

// =========================================================
// 3. BUKA AMPLOP -> SEMUA ELEMEN KELUAR DARI AMPLOP
// =========================================================
let sudahDibuka = false;

document.querySelectorAll('#tahapUtama .muncul-urut').forEach((el, i) => {
  el.style.setProperty('--tunda', (1.2 + i * 0.2) + 's');
});

async function bukaAmplop() {
  if (sudahDibuka) return;
  sudahDibuka = true;
  putarMusik();

  $('kupuAmplop').classList.add('terbang');    // kupu-kupu terbang pergi
  $('tahapAmplop').classList.add('buka');      // segel lepas, tutup terbuka, surat naik
  await tunggu(2600);

  // siapkan halaman kolase di belakang amplop
  $('tahapUtama').classList.add('aktif');
  const mulut = $('amplop').getBoundingClientRect();
  const asalX = mulut.left + mulut.width / 2;
  const asalY = mulut.top + mulut.height * 0.45;

  const elemen = [...document.querySelectorAll('.keluar-amplop')];
  elemen.forEach(el => {
    const r = el.getBoundingClientRect();
    const dx = asalX - (r.left + r.width / 2);
    const dy = asalY - (r.top + r.height / 2);
    el.style.translate = dx + 'px ' + dy + 'px';   // taruh di mulut amplop
    el.style.scale = '0.25';
  });
  document.body.offsetHeight;                        // paksa browser menghitung posisi awal

  $('tahapAmplop').classList.add('selesai');        // surat & amplop pergi
  elemen.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('melayang-keluar', 'mendarat');
      el.style.translate = '0px 0px';               // terbang ke posisi aslinya
      el.style.scale = '1';
    }, 150 + i * 160);
  });

  await tunggu(1800);
  $('tahapAmplop').classList.remove('aktif');
}

$('segel').addEventListener('click', bukaAmplop);
$('amplop').addEventListener('click', bukaAmplop);

// =========================================================
// 4. BUKA & TUTUP HALAMAN DETAIL
// =========================================================
document.querySelectorAll('[data-buka]').forEach(tombol => {
  tombol.addEventListener('click', () => {
    const lembar = $(tombol.dataset.buka);
    lembar.scrollTop = 0;
    lembar.classList.add('tampil');
  });
});

document.querySelectorAll('.lembar, .popup').forEach(el => {
  el.addEventListener('click', e => {
    const kenaTombolTutup = e.target.closest('[data-tutup]');
    const kenaLatarPopup = el.classList.contains('popup') && e.target === el;
    if (kenaTombolTutup || kenaLatarPopup) el.classList.remove('tampil');
  });
});

// =========================================================
// 5. KISAH KAMI: KETUK POLAROID UNTUK GANTI CERITA
// =========================================================
const tumpukan = $('tumpukan');
let urutan = KISAH.map((_, i) => i);     // urutan[0] = foto paling atas

KISAH.forEach((k, i) => {
  const kartu = document.createElement('div');
  kartu.className = 'polaroid-kisah';
  kartu.dataset.i = i;
  kartu.style.setProperty('--r', (i % 2 ? 4 : -4) + (i * 1.5) + 'deg');
  kartu.innerHTML = '<div class="foto"></div><span></span>';
  kartu.querySelector('.foto').style.setProperty('--foto', 'url(' + k.foto + ')');
  kartu.querySelector('span').textContent = k.tulisan;
  tumpukan.appendChild(kartu);

  const titik = document.createElement('i');
  $('titikCerita').appendChild(titik);
});

function susunTumpukan() {
  urutan.forEach((idx, posisi) => {
    tumpukan.children[idx].style.zIndex = KISAH.length - posisi;
  });
  const k = KISAH[urutan[0]];
  $('ceritaTanggal').textContent = k.tanggal;
  $('ceritaJudul').textContent = k.judul;
  $('ceritaIsi').textContent = k.isi;
  [...$('titikCerita').children].forEach((t, i) => t.classList.toggle('aktif', i === urutan[0]));
}
susunTumpukan();

let sedangGanti = false;
tumpukan.addEventListener('click', async () => {
  if (sedangGanti) return;
  sedangGanti = true;
  const atas = tumpukan.children[urutan[0]];

  atas.classList.add('terbang');            // foto teratas terbang ke kanan
  $('cerita').classList.add('ganti');
  await tunggu(450);

  urutan.push(urutan.shift());              // pindahkan ke paling bawah
  susunTumpukan();
  atas.classList.remove('terbang');
  $('cerita').classList.remove('ganti');
  await tunggu(400);
  sedangGanti = false;
});

// =========================================================
// 6. GALERI + FOTO BESAR
// =========================================================
GALERI.forEach(src => {
  const b = document.createElement('button');
  b.innerHTML = '<span class="foto"></span>';
  b.firstChild.style.setProperty('--foto', 'url(' + src + ')');
  b.addEventListener('click', () => {
    $('fotoBesar').src = src;
    $('popupFoto').classList.add('tampil');
  });
  $('gridGaleri').appendChild(b);
});
$('fotoBesar').addEventListener('error', () => $('popupFoto').classList.remove('tampil'));

// =========================================================
// 7. HITUNG MUNDUR + GOOGLE CALENDAR
// =========================================================
const waktuAcara = new Date(TANGGAL_ACARA).getTime();
function updateHitung() {
  const s = Math.max(0, waktuAcara - Date.now());
  $('hari').textContent  = Math.floor(s / 864e5);
  $('jam').textContent   = Math.floor(s % 864e5 / 36e5);
  $('menit').textContent = Math.floor(s % 36e5 / 6e4);
  $('detik').textContent = Math.floor(s % 6e4 / 1e3);
}
updateHitung();
setInterval(updateHitung, 1000);

const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
const mulai = new Date(TANGGAL_ACARA);
const selesai = new Date(mulai.getTime() + 6 * 36e5);
$('simpanKalender').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=' + encodeURIComponent(JUDUL_KALENDER) +
  '&dates=' + fmt(mulai) + '/' + fmt(selesai) +
  '&location=' + encodeURIComponent(LOKASI_KALENDER);

// =========================================================
// 8. RSVP
// =========================================================
function ambilUcapan() {
  try { return JSON.parse(localStorage.getItem('ucapan')) || []; } catch { return []; }
}
function tampilkanUcapan() {
  const wadah = $('daftarUcapan');
  wadah.innerHTML = '';
  ambilUcapan().forEach(u => {
    const div = document.createElement('div');
    div.className = 'ucapan';
    const nama = document.createElement('strong'); nama.textContent = u.nama;
    const info = document.createElement('em');     info.textContent = u.hadir + ' · ' + u.jumlah + ' orang';
    const isi = document.createElement('p');       isi.textContent = u.ucapan;
    div.append(nama, info, isi);
    wadah.appendChild(div);
  });
}
tampilkanUcapan();

$('formRsvp').addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    nama: $('rsvpNama').value.trim(),
    hadir: document.querySelector('input[name=hadir]:checked').value,
    jumlah: document.querySelector('input[name=jumlah]:checked').value,
    ucapan: $('rsvpUcapan').value.trim()
  };
  try { localStorage.setItem('ucapan', JSON.stringify([data, ...ambilUcapan()])); } catch {}
  tampilkanUcapan();

  $('pesanTerimaKasih').textContent = data.hadir === 'Hadir'
    ? 'Terima kasih ' + data.nama + ', sampai jumpa di hari bahagia kami!'
    : 'Terima kasih ' + data.nama + ' atas doa dan ucapannya.';
  $('popupTerimaKasih').classList.add('tampil');
  e.target.reset();
});

// =========================================================
// 9. SALIN NOMOR REKENING
// =========================================================
function toast(teks) {
  $('toast').textContent = teks;
  $('toast').classList.add('tampil');
  setTimeout(() => $('toast').classList.remove('tampil'), 2000);
}
document.querySelectorAll('.salin').forEach(b => {
  b.addEventListener('click', () => {
    navigator.clipboard.writeText(b.dataset.salin)
      .then(() => toast('Nomor berhasil disalin'))
      .catch(() => toast('Gagal menyalin, salin manual ya'));
  });
});
