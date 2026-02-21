// resources/js/Data/cardData.js

export const chanceCards = [
    { title: "KARTU KESEMPATAN", message: "Maju sampai ke START!", action: "move", target: 0 },
    { title: "KARTU KESEMPATAN", message: "Menang Lomba Balap Karung, dapat Rp 150", action: "add_money", amount: 150 },
    { title: "KARTU KESEMPATAN", message: "Bayar uang sekolah, potong Rp 50", action: "sub_money", amount: 50 },
    { title: "KARTU KESEMPATAN", message: "Pergi ke Penjara!", action: "move", target: 10 },
];

export const communityChestCards = [
    { title: "DANA UMUM", message: "Biaya Rumah Sakit, bayar Rp 100", action: "sub_money", amount: 100 },
    { title: "DANA UMUM", message: "Jual saham, dapat Rp 50", action: "add_money", amount: 50 },
    { title: "DANA UMUM", message: "Ulang Tahun! Dapat Rp 100 dari bank", action: "add_money", amount: 100 },
    { title: "DANA UMUM", message: "Pengembalian Pajak, dapat Rp 20", action: "add_money", amount: 20 },
];