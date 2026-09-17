const STORAGE_KEY = 'denuncia_anonima_db_v2';
let selectedFiles = [];
let currentDetailId = null;
let isAdminLoggedIn = false;

const initialMockData = [
    {
        id: 'DEN-2026-8492',
        key: 'K8A2',
        categoria: 'Tráfico de Drogas',
        urgencia: 'Alta',
        dataOcorrido: '2026-09-12',
        horaOcorrido: '22:30',
        local: 'Rua das Palmeiras, próximo ao nº 140, Bairro Centro',
        descricao: 'Movimentação suspeita e constante troca de pacotes em frente a um galpão abandonado.',
        evidenciasCount: 2,
        status: 'Em Investigação',
        dataRegistro: '2026-09-13 08:15',
        historico: [
            { data: '2026-09-13 08:15', status: 'Pendente', nota: 'Denúncia recebida no sistema.' },
            { data: '2026-09-13 10:00', status: 'Em Investigação', nota: 'Encaminhada para a equipe de inteligência da 2ª DP.' }
        ]
    },
    {
        id: 'DEN-2026-1049',
        key: 'M3B9',
        categoria: 'Maus-Tratos a Animais',
        urgencia: 'Média',
        dataOcorrido: '2026-09-10',
        horaOcorrido: '14:00',
        local: 'Av. Brasil, nº 500',
        descricao: 'Cão mantido preso em corrente curta sem água nem comida há dias.',
        evidenciasCount: 1,
        status: 'Concluída',
        dataRegistro: '2026-09-11 11:30',
        historico: [
            { data: '2026-09-11 11:30', status: 'Pendente', nota: 'Denúncia registrada.' },
            { data: '2026-09-12 09:00', status: 'Concluída', nota: 'Patrulha do BAPM resgatou o animal.' }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initDatabase();
    renderAdminTable();
    updateStats();
});

function initDatabase() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockData));
    }
}

function getDB() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveDB(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetMockData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockData));
    renderAdminTable();
    updateStats();
    showToast('Dados restaurados com sucesso!');
}

function handleCategoriaChange(selectElement) {
    const boxOutras = document.getElementById('boxOutrasCategoria');
    const inputOutras = document.getElementById('outraCategoriaTexto');
    
    if (selectElement.value === 'Outras') {
        boxOutras.classList.remove('hidden');
        inputOutras.required = true;
        inputOutras.focus();
    } else {
        boxOutras.classList.add('hidden');
        inputOutras.required = false;
        inputOutras.value = '';
    }
}

// AUTENTICAÇÃO POLICIAL
function handleAdminLogin(e) {
    e.preventDefault();
    const u = document.getElementById('adminUser').value.trim();
    const p = document.getElementById('adminPass').value.trim();
    const errDiv = document.getElementById('loginError');

    if (u === 'admin' && p === 'delegacia123') {
        isAdminLoggedIn = true;
        errDiv.classList.add('hidden');
        document.getElementById('adminLoginSection').classList.add('hidden');
        document.getElementById('adminDashboardSection').classList.remove('hidden');
        showToast('Acesso concedido à Área Administrativa');
    } else {
        errDiv.classList.remove('hidden');
    }
}

function handleAdminLogout() {
    isAdminLoggedIn = false;
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
    document.getElementById('adminDashboardSection').classList.add('hidden');
    document.getElementById('adminLoginSection').classList.remove('hidden');
    showToast('Sessão encerrada com segurança.');
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    selectedFiles = [...selectedFiles, ...files];
    renderFileList();
}

function renderFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const badge = document.createElement('div');
        badge.className = 'bg-brand-900/60 border border-brand-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-200 flex items-center space-x-2';
        badge.innerHTML = `
            <i data-lucide="paperclip" class="w-3.5 h-3.5 text-brand-400"></i>
            <span class="max-w-[150px] truncate">${file.name}</span>
            <button type="button" onclick="removeFile(${index})" class="text-slate-400 hover:text-red-400">
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
        `;
        fileList.appendChild(badge);
    });
    lucide.createIcons();
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    renderFileList();
}

function handleFormSubmit(e) {
    e.preventDefault();

    const categoriaSelect = document.getElementById('categoria').value;
    const outraCategoriaTexto = document.getElementById('outraCategoriaTexto').value.trim();
    
    let categoriaFinal = categoriaSelect;
    if (categoriaSelect === 'Outras' && outraCategoriaTexto !== '') {
        categoriaFinal = `Outras (${outraCategoriaTexto})`;
    }

    const urgencia = document.getElementById('urgencia').value;
    const dataOcorrido = document.getElementById('dataOcorrido').value;
    const horaOcorrido = document.getElementById('horaOcorrido').value;
    const local = document.getElementById('local').value;
    const descricao = document.getElementById('descricao').value;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const protocol = `DEN-2026-${randomNum}`;
    const key = 'K' + Math.random().toString(36).substring(2, 6).toUpperCase();

    const now = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

    const newDenuncia = {
        id: protocol,
        key: key,
        categoria: categoriaFinal,
        urgencia: urgencia,
        dataOcorrido: dataOcorrido,
        horaOcorrido: horaOcorrido || 'Não informada',
        local: local,
        descricao: descricao,
        evidenciasCount: selectedFiles.length,
        status: 'Pendente',
        dataRegistro: now,
        historico: [
            { data: now, status: 'Pendente', nota: 'Denúncia anônima registrada e criptografada no sistema.' }
        ]
    };

    const db = getDB();
    db.unshift(newDenuncia);
    saveDB(db);

    document.getElementById('resProtocol').innerText = protocol;
    document.getElementById('resKey').innerText = key;
    document.getElementById('modalSuccess').classList.remove('hidden');

    document.getElementById('formDenuncia').reset();
    document.getElementById('boxOutrasCategoria').classList.add('hidden');
    document.getElementById('outraCategoriaTexto').required = false;
    selectedFiles = [];
    renderFileList();

    renderAdminTable();
    updateStats();
}

function closeModalSuccess() {
    document.getElementById('modalSuccess').classList.add('hidden');
    switchUserSubTab('track');
}

function handleTrackSubmit(e) {
    e.preventDefault();
    const proto = document.getElementById('trackProtocol').value.trim().toUpperCase();
    const key = document.getElementById('trackKey').value.trim().toUpperCase();

    const db = getDB();
    const found = db.find(item => item.id.toUpperCase() === proto && item.key.toUpperCase() === key);

    const resultDiv = document.getElementById('trackResult');
    resultDiv.classList.remove('hidden');

    if (!found) {
        resultDiv.innerHTML = `
            <div class="text-center py-6 text-red-400 space-y-2">
                <i data-lucide="alert-triangle" class="w-10 h-10 mx-auto"></i>
                <p class="font-bold">Protocolo ou chave secreta incorretos.</p>
                <p class="text-xs text-slate-400">Verifique os dados informados e tente novamente.</p>
            </div>
        `;
    } else {
        let badgeClass = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
        if (found.status === 'Em Investigação') badgeClass = 'bg-blue-500/20 text-blue-400 border-blue-500/40';
        if (found.status === 'Concluída') badgeClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

        let historyHTML = found.historico.map(h => `
            <div class="border-l-2 border-brand-700 pl-4 py-1 space-y-1">
                <div class="flex items-center justify-between text-xs text-slate-400">
                    <span>${h.data}</span>
                    <span class="font-bold text-brand-300">${h.status}</span>
                </div>
                <p class="text-xs text-slate-200">${h.nota}</p>
            </div>
        `).join('');

        resultDiv.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center justify-between border-b border-brand-900/50 pb-3">
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase">Protocolo</span>
                        <h4 class="text-lg font-bold text-white">${found.id}</h4>
                    </div>
                    <span class="px-3 py-1 text-xs font-bold rounded-full border ${badgeClass}">
                        ${found.status}
                    </span>
                </div>

                <div class="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <span class="text-slate-400 block">Categoria:</span>
                        <span class="font-semibold text-slate-200">${found.categoria}</span>
                    </div>
                    <div>
                        <span class="text-slate-400 block">Data de Envio:</span>
                        <span class="font-semibold text-slate-200">${found.dataRegistro}</span>
                    </div>
                </div>

                <div class="pt-2">
                    <span class="text-xs font-bold uppercase text-brand-400 tracking-wider block mb-3">Linha do Tempo de Resposta Policial</span>
                    <div class="space-y-3">
                        ${historyHTML}
                    </div>
                </div>
            </div>
        `;
    }
    lucide.createIcons();
}

function renderAdminTable() {
    const db = getDB();
    const search = document.getElementById('adminSearch').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;
    const filterUrgencia = document.getElementById('filterUrgencia').value;

    const filtered = db.filter(item => {
        const matchesSearch = item.id.toLowerCase().includes(search) || 
                              item.local.toLowerCase().includes(search) || 
                              item.categoria.toLowerCase().includes(search) || 
                              item.descricao.toLowerCase().includes(search);
        const matchesStatus = filterStatus === 'TODOS' || item.status === filterStatus;
        const matchesUrgencia = filterUrgencia === 'TODAS' || item.urgencia === filterUrgencia;
        return matchesSearch && matchesStatus && matchesUrgencia;
    });

    const tbody = document.getElementById('tableBodyDenuncias');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-8 text-slate-500 text-xs">Nenhuma denúncia encontrada.</td>
            </tr>
        `;
        return;
    }

    filtered.forEach(item => {
        let statusBadge = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        if (item.status === 'Em Investigação') statusBadge = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        if (item.status === 'Concluída') statusBadge = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        if (item.status === 'Arquivada') statusBadge = 'bg-slate-500/20 text-slate-400 border-slate-500/30';

        let urgenciaBadge = 'bg-slate-800 text-slate-300';
        if (item.urgencia === 'Média') urgenciaBadge = 'bg-amber-950 text-amber-300 border border-amber-800/50';
        if (item.urgencia === 'Alta') urgenciaBadge = 'bg-brand-950 text-brand-300 border border-brand-800/80';

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-brand-950/30 transition-colors';
        tr.innerHTML = `
            <td class="p-4">
                <span class="font-mono font-bold text-white block">${item.id}</span>
                <span class="text-[11px] text-slate-500">${item.dataRegistro}</span>
            </td>
            <td class="p-4 font-semibold text-slate-200">${item.categoria}</td>
            <td class="p-4 text-xs text-slate-300 max-w-[200px] truncate">${item.local}</td>
            <td class="p-4">
                <span class="px-2.5 py-1 text-[10px] font-bold rounded-lg ${urgenciaBadge}">
                    ${item.urgencia}
                </span>
            </td>
            <td class="p-4">
                <span class="px-2.5 py-1 text-[10px] font-bold rounded-full border ${statusBadge}">
                    ${item.status}
                </span>
            </td>
            <td class="p-4 text-right">
                <button onclick="openAdminModal('${item.id}')" class="px-3 py-1.5 bg-brand-800 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition-colors inline-flex items-center space-x-1">
                    <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                    <span>Analisar</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function openAdminModal(id) {
    currentDetailId = id;
    const db = getDB();
    const item = db.find(d => d.id === id);
    if (!item) return;

    document.getElementById('admModalProtocol').innerText = item.id;
    document.getElementById('admNewStatus').value = item.status;
    document.getElementById('admNewNote').value = '';

    const content = document.getElementById('admModalContent');
    content.innerHTML = `
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-black/40 p-4 rounded-2xl border border-brand-900/40">
            <div>
                <span class="text-slate-500 text-[10px] uppercase font-bold block">Categoria</span>
                <span class="font-bold text-slate-200">${item.categoria}</span>
            </div>
            <div>
                <span class="text-slate-500 text-[10px] uppercase font-bold block">Urgência</span>
                <span class="font-bold text-amber-400">${item.urgencia}</span>
            </div>
            <div>
                <span class="text-slate-500 text-[10px] uppercase font-bold block">Data/Hora Ocorrido</span>
                <span class="font-bold text-slate-200">${item.dataOcorrido} às ${item.horaOcorrido}</span>
            </div>
        </div>

        <div>
            <span class="text-slate-400 text-xs font-bold uppercase block mb-1">Localização</span>
            <p class="text-slate-200 bg-black/30 p-3 rounded-xl border border-brand-900/30">${item.local}</p>
        </div>

        <div>
            <span class="text-slate-400 text-xs font-bold uppercase block mb-1">Descrição dos Fatos</span>
            <p class="text-slate-200 bg-black/30 p-4 rounded-xl border border-brand-900/30 text-xs leading-relaxed">${item.descricao}</p>
        </div>

        <div>
            <span class="text-slate-400 text-xs font-bold uppercase block mb-1">Evidências Anexadas</span>
            <p class="text-slate-300 text-xs flex items-center space-x-2 bg-black/30 p-3 rounded-xl border border-brand-900/30">
                <i data-lucide="paperclip" class="w-4 h-4 text-brand-400"></i>
                <span>${item.evidenciasCount} arquivo(s) em anexo no servidor seguro.</span>
            </p>
        </div>
    `;

    document.getElementById('modalAdminDetail').classList.remove('hidden');
    lucide.createIcons();
}

function closeAdminModal() {
    document.getElementById('modalAdminDetail').classList.add('hidden');
}

function saveAdminUpdate() {
    if (!currentDetailId) return;

    const newStatus = document.getElementById('admNewStatus').value;
    const newNote = document.getElementById('admNewNote').value.trim();

    const db = getDB();
    const item = db.find(d => d.id === currentDetailId);

    if (item) {
        item.status = newStatus;
        const now = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        item.historico.push({
            data: now,
            status: newStatus,
            nota: newNote || `Status atualizado para: ${newStatus}`
        });

        saveDB(db);
        renderAdminTable();
        updateStats();
        closeAdminModal();
        showToast('Status da ocorrência atualizado com sucesso!');
    }
}

function updateStats() {
    const db = getDB();
    document.getElementById('statTotal').innerText = db.length;
    document.getElementById('statPendentes').innerText = db.filter(d => d.status === 'Pendente').length;
    document.getElementById('statInvestigacao').innerText = db.filter(d => d.status === 'Em Investigação').length;
    document.getElementById('statConcluidas').innerText = db.filter(d => d.status === 'Concluída').length;
}

function switchTab(tab) {
    const userView = document.getElementById('viewUser');
    const adminView = document.getElementById('viewAdmin');
    const btnUser = document.getElementById('btnTabUser');
    const btnAdmin = document.getElementById('btnTabAdmin');

    if (tab === 'user') {
        userView.classList.remove('hidden');
        adminView.classList.add('hidden');
        btnUser.className = 'flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 bg-brand-700 text-white shadow-md';
        btnAdmin.className = 'flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-white';
    } else {
        userView.classList.add('hidden');
        adminView.classList.remove('hidden');
        btnAdmin.className = 'flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 bg-brand-700 text-white shadow-md';
        btnUser.className = 'flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-white';
    }
}

function switchUserSubTab(sub) {
    const subNew = document.getElementById('subViewNew');
    const subTrack = document.getElementById('subViewTrack');
    const btnSubNew = document.getElementById('btnSubNew');
    const btnSubTrack = document.getElementById('btnSubTrack');

    if (sub === 'new') {
        subNew.classList.remove('hidden');
        subTrack.classList.add('hidden');
        btnSubNew.className = 'py-3 px-6 text-sm font-bold border-b-2 border-brand-500 text-brand-500 flex items-center space-x-2';
        btnSubTrack.className = 'py-3 px-6 text-sm font-bold border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center space-x-2';
    } else {
        subNew.classList.add('hidden');
        subTrack.classList.remove('hidden');
        btnSubTrack.className = 'py-3 px-6 text-sm font-bold border-b-2 border-brand-500 text-brand-500 flex items-center space-x-2';
        btnSubNew.className = 'py-3 px-6 text-sm font-bold border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center space-x-2';
    }
}

function toggleTheme() {
    const body = document.getElementById('bodyApp');
    const sun = document.getElementById('sunIcon');
    const moon = document.getElementById('moonIcon');

    body.classList.toggle('dark');
    if (body.classList.contains('dark')) {
        sun.classList.add('hidden');
        moon.classList.remove('hidden');
    } else {
        sun.classList.remove('hidden');
        moon.classList.add('hidden');
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copiado para a área de transferência!');
    });
}
