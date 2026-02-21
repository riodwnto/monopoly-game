import { ref } from 'vue';
import { generateBoard } from '../Data/boardData';
import { chanceCards, communityChestCards } from '../Data/cardData';

// --- AUDIO ENGINE (SINGLETON) ---
let audioCtx = null;
const playEffect = (type) => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);

    if (type === 'step') {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        masterGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(masterGain);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'dice') {
        const bufferSize = audioCtx.sampleRate * 0.05;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        masterGain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        noise.connect(masterGain);
        noise.start();
    } else if (type === 'money') {
        [660, 880].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (i * 0.05));
            const g = audioCtx.createGain();
            g.gain.setValueAtTime(0.07, audioCtx.currentTime + (i * 0.05));
            g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + (i * 0.05) + 0.2);
            osc.connect(g); g.connect(masterGain);
            osc.start(audioCtx.currentTime + (i * 0.05)); osc.stop(audioCtx.currentTime + (i * 0.05) + 0.2);
        });
    }
};

export function useGameLogic() {
    const currentTurn = ref(1);
    const dice = ref([1, 1]);
    const hasRolled = ref(false);
    const isRolling = ref(false);

    // --- STATE BARU: LOGS & GAME OVER ---
    const gameLogs = ref(["Selamat datang di Monopoli!"]);
    const isGameOver = ref(false);
    const winner = ref(null);

    const players = ref([
        { id: 1, name: 'Pemain 1', colorClass: 'red', colorHex: '#ff4d4d', position: 0, money: 1500 },
        { id: 2, name: 'Pemain 2', colorClass: 'blue', colorHex: '#4da6ff', position: 0, money: 1500 }
    ]);

    const boardCells = ref(generateBoard());
    const showBuyModal = ref(false);
    const currentProperty = ref(null);
    const showRentModal = ref(false);
    const rentDetails = ref(null);
    const showEventModal = ref(false);
    const eventDetails = ref({ title: '', message: '', icon: '' });

    const addLog = (msg) => {
        gameLogs.value.unshift(msg);
        if (gameLogs.value.length > 15) gameLogs.value.pop();
    };

    const checkBankruptcy = (player) => {
        if (player.money <= 0) {
            isGameOver.value = true;
            winner.value = players.value.find(p => p.id !== player.id);
            addLog(`❌ ${player.name} bangkrut!`);
        }
    };

    const triggerEvent = (title, message, icon) => {
        eventDetails.value = { title, message, icon };
        showEventModal.value = true;
    };

    const movePlayerAnimate = async (player, steps) => {
        for (let i = 0; i < steps; i++) {
            player.position++;
            playEffect('step');
            if (player.position > 39) {
                player.position = 0;
                player.money += 200;
                playEffect('money');
                addLog(`💰 ${player.name} melewati START, dapat Rp 200`);
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    };

    const rollDice = () => {
        if (hasRolled.value || isRolling.value || isGameOver.value) return;
        isRolling.value = true;
        const diceInterval = setInterval(() => playEffect('dice'), 100);

        setTimeout(async () => {
            clearInterval(diceInterval);
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            dice.value = [d1, d2];
            const activePlayer = players.value.find(p => p.id === currentTurn.value);

            isRolling.value = false;
            addLog(`🎲 ${activePlayer.name} mengocok angka ${d1 + d2}`);
            await movePlayerAnimate(activePlayer, d1 + d2);
            hasRolled.value = true;
            handleLandedCell(activePlayer.position, activePlayer);
        }, 800);
    };

    const handleLandedCell = (newPosition, activePlayer) => {
        const landedCell = boardCells.value.find(c => c.id === newPosition);
        const cellName = landedCell.name.replace('\n', ' ');

        if (landedCell.price === 0) {
            if (landedCell.name === "Pajak" || landedCell.name === "Pajak\nMewah") {
                const amount = landedCell.name === "Pajak" ? 200 : 100;
                activePlayer.money -= amount;
                playEffect('money');
                addLog(`🏛️ ${activePlayer.name} bayar pajak Rp ${amount}`);
                triggerEvent("Bayar Pajak", `Tagihan pajak sebesar Rp ${amount}`, "🏛️");
                checkBankruptcy(activePlayer);
            }
            else if (landedCell.name === "KE\nPENJARA") {
                activePlayer.position = 10;
                addLog(`🚔 ${activePlayer.name} masuk penjara!`);
                triggerEvent("Masuk Penjara", "Kamu ditangkap Polisi!", "🚔");
            }
            else if (landedCell.name === "Kesempatan" || landedCell.name === "Dana Umum") {
                const deck = landedCell.name === "Kesempatan" ? chanceCards : communityChestCards;
                const card = deck[Math.floor(Math.random() * deck.length)];
                if (card.action === "add_money") activePlayer.money += card.amount;
                else if (card.action === "sub_money") {
                    activePlayer.money -= card.amount;
                    checkBankruptcy(activePlayer);
                }
                else if (card.action === "move") activePlayer.position = card.target;

                playEffect('money');
                addLog(`🃏 ${activePlayer.name}: ${card.message}`);
                triggerEvent(card.title, card.message, landedCell.name === "Kesempatan" ? "❓" : "📦");
            }
        }
        else if (landedCell.price > 0) {
            if (landedCell.ownerId === null) {
                currentProperty.value = landedCell;
                showBuyModal.value = true;
            } else if (landedCell.ownerId !== activePlayer.id) {
                const owner = players.value.find(p => p.id === landedCell.ownerId);
                const rentAmount = Math.floor(landedCell.price * 0.5);
                activePlayer.money -= rentAmount;
                owner.money += rentAmount;
                playEffect('money');
                addLog(`💸 ${activePlayer.name} bayar sewa Rp ${rentAmount} ke ${owner.name}`);
                rentDetails.value = { payerName: activePlayer.name, ownerName: owner.name, propertyName: cellName, amount: rentAmount };
                showRentModal.value = true;
                checkBankruptcy(activePlayer);
            }
        }
    };

    const buyProperty = () => {
        const activePlayer = players.value.find(p => p.id === currentTurn.value);
        if (activePlayer.money >= currentProperty.value.price) {
            activePlayer.money -= currentProperty.value.price;
            currentProperty.value.ownerId = activePlayer.id;
            playEffect('money');
            addLog(`🏠 ${activePlayer.name} membeli ${currentProperty.value.name.replace('\n', ' ')}`);
        }
        showBuyModal.value = false;
    };

    const resetGame = () => {
        if (confirm("Ulangi permainan?")) {
            players.value = [
                { id: 1, name: 'Pemain 1', colorClass: 'red', colorHex: '#ff4d4d', position: 0, money: 1500 },
                { id: 2, name: 'Pemain 2', colorClass: 'blue', colorHex: '#4da6ff', position: 0, money: 1500 }
            ];
            boardCells.value.forEach(c => { if (c.ownerId !== undefined) c.ownerId = null; });
            currentTurn.value = 1; dice.value = [1, 1];
            hasRolled.value = false; isRolling.value = false;
            isGameOver.value = false; winner.value = null;
            gameLogs.value = ["Permainan Dimulai Kembali!"];
            playEffect('money');
        }
    };

    return {
        currentTurn, dice, hasRolled, isRolling, players, boardCells,
        showBuyModal, currentProperty, buyProperty, skipProperty: () => showBuyModal.value = false,
        showRentModal, rentDetails, payRent: () => showRentModal.value = false,
        showEventModal, eventDetails, closeEvent: () => showEventModal.value = false,
        gameLogs, isGameOver, winner, rollDice, endTurn: () => { currentTurn.value = currentTurn.value === 1 ? 2 : 1; hasRolled.value = false; },
        resetGame
    };
}