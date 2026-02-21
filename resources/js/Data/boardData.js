// resources/js/Data/boardData.js

export const generateBoard = () => {
    let cells = [];
    const properties = [
        { name: "START", color: null }, { name: "Jakarta\nRp 60", color: "#8B4513" }, { name: "Dana Umum", color: null }, { name: "Bandung\nRp 60", color: "#8B4513" }, { name: "Pajak", color: null }, { name: "Stasiun\nGambir", color: null }, { name: "Surabaya\nRp 100", color: "#87CEEB" }, { name: "Kesempatan", color: null }, { name: "Semarang\nRp 100", color: "#87CEEB" }, { name: "Yogyakarta\nRp 120", color: "#87CEEB" },
        { name: "PENJARA", color: null }, { name: "Medan\nRp 140", color: "#FF69B4" }, { name: "PLN", color: null }, { name: "Palembang\nRp 140", color: "#FF69B4" }, { name: "Makassar\nRp 160", color: "#FF69B4" }, { name: "Stasiun\nPs. Senen", color: null }, { name: "Denpasar\nRp 180", color: "#FFA500" }, { name: "Dana Umum", color: null }, { name: "Manado\nRp 180", color: "#FFA500" }, { name: "Pontianak\nRp 200", color: "#FFA500" },
        { name: "PARKIR\nGRATIS", color: null }, { name: "Balikpapan\nRp 220", color: "#FF0000" }, { name: "Kesempatan", color: null }, { name: "Samarinda\nRp 220", color: "#FF0000" }, { name: "Banjarmasin\nRp 240", color: "#FF0000" }, { name: "Stasiun\nCirebon", color: null }, { name: "Malang\nRp 260", color: "#FFD700" }, { name: "Solo\nRp 260", color: "#FFD700" }, { name: "PDAM", color: null }, { name: "Pekanbaru\nRp 280", color: "#FFD700" },
        { name: "KE\nPENJARA", color: null }, { name: "Batam\nRp 300", color: "#008000" }, { name: "Padang\nRp 300", color: "#008000" }, { name: "Dana Umum", color: null }, { name: "Lampung\nRp 320", color: "#008000" }, { name: "Stasiun\nBandung", color: null }, { name: "Kesempatan", color: null }, { name: "Bali Resort\nRp 350", color: "#0000FF" }, { name: "Pajak\nMewah", color: null }, { name: "Raja Ampat\nRp 400", color: "#0000FF" }
    ];

    for (let i = 0; i < 40; i++) {
        let row, col;
        if (i < 11) { row = 11; col = 11 - i; }
        else if (i < 20) { row = 11 - (i - 10); col = 1; }
        else if (i < 31) { row = 1; col = 1 + (i - 20); }
        else { row = 1 + (i - 30); col = 11; }

        // TRIK BARU: Mengambil harga otomatis dari teks (misal "Rp 60" jadi angka 60)
        let priceMatch = properties[i].name.match(/Rp (\d+)/);
        let price = priceMatch ? parseInt(priceMatch[1]) : 0;

        cells.push({
            id: i,
            name: properties[i].name,
            color: properties[i].color,
            row: row,
            col: col,
            price: price,      // Menambahkan data harga ke papan
            ownerId: null      // null berarti tanah ini belum ada yang punya
        });
    }
    return cells;
};