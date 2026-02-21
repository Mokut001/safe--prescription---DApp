let prescriptions = [];
const walletBtn = document.getElementById('connectWallet');

// Simulate Patient Identity Generation
function generatePatientHash() {
    return 'PX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

document.getElementById('patientHash').value = generatePatientHash();

async function issuePrescription() {
    const pId = document.getElementById('patientHash').value;
    const med = document.getElementById('medName').value;
    const txHash = 'tx_' + Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => b.toString(16).padStart(2, '0')).join('');

    const newPrx = {
        hash: txHash,
        patient: pId,
        med: med,
        status: 'Active',
        timestamp: new Date().toLocaleTimeString()
    };

    prescriptions.unshift(newPrx);
    updateUI();
    
    // Reset for next
    document.getElementById('patientHash').value = generatePatientHash();
}

function updateUI() {
    const queue = document.getElementById('txQueue');
    const empty = document.getElementById('emptyState');

    if (prescriptions.length === 0) {
        empty.classList.remove('hidden');
        queue.innerHTML = '';
        return;
    }

    empty.classList.add('hidden');
    queue.innerHTML = prescriptions.map((p, index) => `
        <tr class="border-b border-slate-50 hover:bg-slate-50 transition">
            <td class="py-4 font-mono text-[10px] text-cyan-600">${p.hash.substring(0, 15)}...</td>
            <td class="py-4 font-semibold text-slate-700">${p.patient}</td>
            <td class="py-4 font-medium text-slate-500">${p.med}</td>
            <td class="py-4">
                <span class="${p.status === 'Active' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-400'} px-2 py-1 rounded text-[10px] font-black uppercase">
                    ${p.status}
                </span>
            </td>
            <td class="py-4 text-right">
                ${p.status === 'Active' ? 
                    `<button onclick="claimPrescription(${index})" class="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-500 transition">FILL</button>` : 
                    `<button disabled class="bg-slate-100 text-slate-300 px-4 py-1.5 rounded-lg text-xs font-bold">VOID</button>`
                }
            </td>
        </tr>
    `).join('');
}

function claimPrescription(index) {
    // Show validation loader simulation
    const btn = event.target;
    btn.innerHTML = 'VALIDATING...';
    btn.disabled = true;

    setTimeout(() => {
        prescriptions[index].status = 'Claimed';
        document.getElementById('txHashDisplay').innerText = "UTXO_CONS: " + prescriptions[index].hash;
        document.getElementById('txModal').classList.remove('hidden');
        updateUI();
    }, 1500);
}

function closeModal() {
    document.getElementById('txModal').classList.add('hidden');
}

// Lucid Connect Simulation
walletBtn.onclick = async () => {
    walletBtn.innerText = "🏥 Clinical Node Connected";
    walletBtn.classList.replace('bg-slate-900', 'bg-cyan-600');
};