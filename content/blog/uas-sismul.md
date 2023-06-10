---
title: "Rangkuman UAS Sistem Multimedia"
date: 2023-06-10T16:14:59+07:00
draft: false
weight: 1
math: true
cover:
  image: "img in static"
---

## Kompresi Audio

- Teknik kompresi
  - Predictive encoding
    - Speech, selisih antar sampel
  - Perceptual encoding
    - CD, MP3
- Lossless -> FLAC, ALAC, APE, WavPack
- Lossy -> MP3, AAC, WMA, OGG
- MPEG audio compression - psychoacoustic modeling -> keterbatasan pendengaran manusia, frequency masking - physically lossy, perceptually lossless (transparan) - sampling rate 32, 44.1, 48 khz - Bisa menambahkan ancillary data (data tambahan) diantara bit stream

![](/blog/uas-sismul/20230604194016.png#center)

- Polyphase Filter Bank
  - membagi menjadi 32 bin subband frekuensi
  - Dihubungkan dengan critical band
- Critical band
  - rentang frekuensi dimana manusia lebih peka ke frekuensi rendah, maka alokasi bit dan subband untuk frekuensi rendah lebih banyak ketimbang tinggi.
    ![](/blog/uas-sismul/20230604194857.png#center)
  - Di gambar di atas, frekuensi rendah bandwidthnya lebih kecil, soalnya critical

## Kompresi Citra: JPEG

- JPEG
  - lossy img compression method
  - Memanfaatkan keterbatasan mata yang tidak bisa melihat detail yang ekstrim
  - spatial frequency domain
  - Quality factornya $Q=10$, bisa sampai 1.5% dari original img
  - Pakai 3 algoritma: DCT, Huffman, dan RLE
  - Sweetspot rasio kompresinya 30:1

![](/blog/uas-sismul/20230521205753.png)

- **Step2nya:**

1. Satu gambar dibagi jadi beberapa macroblock. Macroblock berukuran 8x8
2. Chroma subsampling
3. DCT untuk merubah dari domain spasial ke frekuensi
4. kuantisasi
   1. Dibagi sama matriks kuantisasi terus dibulatkan
5. zigzag ordering biar jadi 1D matriks
   1. ![](/blog/uas-sismul/20230521211757.png)
6. Angka pertama jadi koefisien DC, sisanya jadi koefisien AC
7. RLE untuk AC coef
   1. Membuat tuple (berapa trailing zeros didepan angka non zero, angka non zero)
   2. Sisa trailing zeros diakhir direpresentasikan dengan (0, 0) atau EOB
   3. ![](/blog/uas-sismul/20230521212059.png)
8. DPCM (Differential PCM) untuk DC coef
   1. $Diff_{i}= DC_{i}- DC_{i-1}$, dimana $DC_{i}$ adalah koefisien DC pada macroblock ke i
   2. If the DC coefficients for the first five image blocks are 150, 155, 149, 152, 144, DPCM would produce 150, 5, −6, 3, −8, assuming the predictor for the ith block is simply di = DCi − DCi−1, and d0 = DC0.
9. Huffman 1. Buat AC: (n trailing zeros, category, bits nya); buat DC: (category, bitsnya)![](/blog/uas-sismul/20230521212512.png) triknya: decimal dijadiin binary aja, kalo decimalnya (-), nanti tinggal diinvers 2. terus (n trailing zeros, category) dijadiin code word sesuai tabel ![](/blog/uas-sismul/20230521212845.png#center) buat ac (aku ga paham ini) https://www.globalspec.com/reference/39556/203279/appendix-b-huffman-tables-for-the-dc-and-ac-coefficients-of-the-jpeg-baseline-encoder ![](/blog/uas-sismul/20230521212856.png) buat dc
   **kesimpulan:**
10. Bagus buat web
11. Jelek buat fotografi

## Kompresi Video

- Dimensi video ada 3 -> 2 dimensi spasial (horizontal dan vertikal) dan 1 dimensi waktu
- Yang dikompresi ada 2, yaitu gambar tiap framenya dan audionya
- MPEG (Moving Pictures Expert Group) -> komite yg buat standar video encoding
  - MPEG 1 -> VCD, MP3 (MPEG-1 audio layer 3), 1.5 Mb/s bitrate @352x240 resolution, progressive pictures
  - MPEG 2 -> DVD, kepakake sangat lama
  - MPEG 3 -> HDTV, tapi ga dipake lagi karena balik ke MPEG 2
  - MPEG 4 -> AV objects, 3D, low bitrate encoding, DRM (Digital Rights Management). H.264, dipake di Blu-Ray dan HD-DVD
- Kompresi spasial domain (gambar2nya) dihandle kek JPEG
- Kompresi time domain -> menggunakan motion vectors yg menunjukkan seberapa banyak berubah dari frame ke frame pada sebuah macroblock yang berukuran 16x16
  - Tipe frames: I (intra-coded), P (predictive-coded), B (Bidirectional predictive-coded)
  - I frame -> coded **tanpa** reference, selalu menjadi yg pertama dalam sequence
  - P frame -> ada reference ke I atau P
  - B frame -> ada reference ke I atau P yang ada disebelum dan sesudah
  - ![](/blog/uas-sismul/20230527130056.png)
- Karena dalam video pasti ada banyak frames, maka di grouping biar referencenya nggak terlalu panjang. groupnya disebut dengan **GOP (Group of Pictures)**
  - biasanya satu GOP berisi 12 sampai 15 frames
  - Compression terjadi didalam tiap GOP
  - Tidak ada compression antar GOP
- Untuk membuat prediksi frame nya, menggunakan MSE (mean squared error), kalo skornya bagus berarti match.
  - Kalo gaada reference yg cocok, bakal jadi I frame
  - Kalo ada perubahan scene, maka bakal start fresh
  - predictive error bakal terus menerus dihitung sampai ketemu I frame lagi, tapi ga boleh kebanyakan P atau B frame
  - $$\text{MSE} = \frac{1}{n}\sum_{i=1}^{n}(Y_i - \hat{Y_i})^2$$
- terms:
  - intra-frame compression -> kayak JPEG compression
  - inter-frame compression -> data yg sama akan disimpan (motion compensation)

## Steganografi

- enkripsi -> membuat plaintext jadi tidak bisa terbaca (ciphertext), namun org akan tau kalo pesan tersebut di enkripsi
- steganografi -> disisipkan disuatu media, jadi orang tidak tahu kalo ada pesan rahasia yg dikirimkan
- steganos -> tersembunyi ; graphien -> tulisan
- steganografi zaman dulu:
  - pesan di kepala botak
  - tablet wax
  - invisible ink (tanaman thithymallus)
  - telur rebus
  - null chiper -> kata keberapa dalam suatu kalimat
- terminologi
  - Embedded message / hiddentext / secret message -> pesan yang disembunyikan
  - cover object -> objek untuk menutupi hidden text
  - stego object -> hidden text + cover object
  - stego key -> kunci untuk mengekstraksi pesan
- Kriteria steganografi yang bagus (CRIF):
  - **c**apacity -> ukuran pesan yang disembunyikan besar
  - **r**ecovery -> dapat diekstraksi
  - **i**mperceptible -> tidak dapat di persepsi secara visual
  - **f**idelity -> kualitas cover object tidak berubah jauh
- Tipe stegano
  - Pure steganography
    - Tidak butuh key (tidak disukai)
    - Contoh: null cipher
    - prinsip kerkhoff -> kunci >>> algoritma embedding
  - Secret/Symmetric key steganography
    - Kunci untuk embedding dan ekstraksi sama
    - DES, AES, dll
  - Public/Asymmetric key steganography
    - Kunci publik untuk embedding
    - Kunci privat untuk ekstraksi
    - RSA
- Stegano metode LSB (Least Significant Bit)
  - mengganti bit LSB dari pixel dengan bit pesan (bagian kanan bit)
  - mengubah nilai 1 bit LSB tidak akan terlihat secara persepsi visual/auditori
  - ukuran pesan yang dapat disisipkan adalah = 1/8 x ukuran byte data cover objek
    - gambar 24 bit ukutan 256 x 256 -> 256 x 256 = 65536 ; 65536 x 3 = 196608 byte ; 196608 byte x 1/8 = 24576 byte = 24KB
- varian metode LSB
  - Sequential -> disisipkan secara berurutan dari kiri ke kanan -> jelek karena bisa saja terlihat bedanya karena byte yg diberi pesan tidak nyebar
  - Acak -> disisipkan secara acak (pseudo), seed yang digunakan untuk mengacak digunakan sebagai key. -> lebih tersebar jadi nggak keliatan
  - M-bit LSB -> intinya kalo LSB kan 1 bit LSB, kalo M-bit ya diambil sebanyak M, makin besar M, makin jelek fidelity ; rumusnya kalo tadi 1/8, sekarang jadi M/8

## Pengantar Jaringan Multimedia

- Kebutuhan aplikasi multimedia di jaringan
- Karakteristik:
  - Digital
  - Integrasi dari banyak tipe media
  - Bisa interaktif atau tidak
- Penggunaan:
  - Streaming, memulai video sebelum sepenuhnya terunduh
  - menyimpan pada server
  - conversational over IP -> skype
- local vs jaringan
  - local -> DVD, hanya 1 komputer
  - jaringan -> transmisi dan distribusi informasi multimedia di jaringan, video conference
- Konsiderasi:
  - Datanya besar
  - delay sensitive
  - loss tolerant
  - tidak perlu ada koneksi secara eksplisit
  - bandwidth terbatas
  - best effort network (jaringan akan mencoba yang terbaik untuk mengirimkan data tetapi tidak ada jaminan bahwa data akan sampai ke tujuannya)
  - pengguna punya kondisi network yang beda2
- tantangan:
  - media size Vs. batas bandwidth
  - kebutuan pengguna (pingin streaming netflix) Vs. best effort network (tapi wifi lemot)
  - Bagaimana cara memberikan kebuthan yg berbeda2 untuk tiap pengguna>
- Solusi:
  - media compression (menyelesaikan tantangan 1)
  - multimedia transmission (menyelesaikan tantangan 2)
    - Protokol real time transmission
    - Rate / congestion control
    - error control
- Sistem
  - Live
    - realtime capture, compression
  - Stored - offline compression
    ![](/blog/uas-sismul/20230610153129.png#center)
