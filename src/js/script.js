let files = JSON.parse(localStorage.getItem('landFiles')) || [];
let editingIndex = -1;
let filteredFiles = files.slice();

function applyFilters() {
    const search = document.getElementById('searchInput').value.trim().toLowerCase();
    const status = document.getElementById('statusFilter').value;
    filteredFiles = files.filter(file => {
        // Recherche globale sur tous les champs pertinents
        const searchString = [
            file.clientName,
            file.parcelle,
            file.ilot,
            file.section,
            file.commune,
            file.situation,
            file.dateReception,
            file.dateSortie,
            file.dateRecuperation
        ].map(x => (x || '').toLowerCase()).join(' ');
        const matchSearch = !search || searchString.includes(search);
        // Filtrage par statut
        const fileStatus = getFileStatus(file).status;
        const matchStatus = !status || fileStatus === status;
        return matchSearch && matchStatus;
    });
    renderTable();
    updateStats();
}

document.addEventListener('DOMContentLoaded', function() {
    applyFilters();
});

function openAddModal() {
    editingIndex = -1;
    document.getElementById('modalTitle').textContent = 'Nouveau dossier';
    document.getElementById('fileForm').reset();
    document.getElementById('fileModal').style.display = 'block';
}

function openEditModal(index) {
    // index relatif à filteredFiles
    const realIndex = files.indexOf(filteredFiles[index]);
    editingIndex = realIndex;
    const file = files[realIndex];
    document.getElementById('modalTitle').textContent = 'Modifier le dossier';
    document.getElementById('dateReception').value = file.dateReception;
    document.getElementById('clientName').value = file.clientName;
    document.getElementById('parcelle').value = file.parcelle || '';
    document.getElementById('ilot').value = file.ilot || '';
    document.getElementById('section').value = file.section || '';
    document.getElementById('commune').value = file.commune || '';
    document.getElementById('situation').value = file.situation || '';
    document.getElementById('dateSortie').value = file.dateSortie || '';
    document.getElementById('dateRecuperation').value = file.dateRecuperation || '';
    document.getElementById('fileModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('fileModal').style.display = 'none';
}

function saveFile() {
    const form = document.getElementById('fileForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const fileData = {
        dateReception: document.getElementById('dateReception').value,
        clientName: document.getElementById('clientName').value,
        parcelle: document.getElementById('parcelle').value,
        ilot: document.getElementById('ilot').value,
        section: document.getElementById('section').value,
        commune: document.getElementById('commune').value,
        situation: document.getElementById('situation').value,
        dateSortie: document.getElementById('dateSortie').value,
        dateRecuperation: document.getElementById('dateRecuperation').value,
        id: editingIndex === -1 ? Date.now() : files[editingIndex].id
    };
    if (editingIndex === -1) {
        files.push(fileData);
    } else {
        files[editingIndex] = fileData;
    }
    localStorage.setItem('landFiles', JSON.stringify(files));
    applyFilters();
    closeModal();
}

function deleteFile(index) {
    // index relatif à filteredFiles
    const realIndex = files.indexOf(filteredFiles[index]);
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
        files.splice(realIndex, 1);
        localStorage.setItem('landFiles', JSON.stringify(files));
        applyFilters();
    }
}

function getFileStatus(file) {
    if (file.dateSortie) {
        return { status: 'traite', label: '✅ Traité' };
    }
    const receptionDate = new Date(file.dateReception);
    const today = new Date();
    const diffTime = today - receptionDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) {
        return { status: 'a-traiter', label: '🟢 À traiter' };
    } else if (diffDays === 2) {
        return { status: 'dernier-jour', label: '🟡 Dernier jour' };
    } else {
        return { status: 'en-retard', label: '🔴 En retard' };
    }
}

function formatCadastralRef(file) {
    const parts = [file.parcelle, file.ilot, file.section, file.commune].filter(p => p);
    return parts.length > 0 ? parts.join(' - ') : '-';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

function renderTable() {
    const tbody = document.getElementById('filesTableBody');
    const emptyState = document.getElementById('emptyState');
    if (filteredFiles.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';
    tbody.innerHTML = filteredFiles.map((file, index) => {
        const status = getFileStatus(file);
        return `
            <tr>
                <td>${formatDate(file.dateReception)}</td>
                <td>${file.clientName}</td>
                <td>${formatCadastralRef(file)}</td>
                <td>${file.situation || '-'}</td>
                <td>${formatDate(file.dateSortie)}</td>
                <td>${formatDate(file.dateRecuperation)}</td>
                <td><span class="status-badge status-${status.status}">${status.label}</span></td>
                <td>
                    <button class="btn btn-secondary" onclick="openEditModal(${index})">✏️ Modifier</button>
                    <button class="btn btn-secondary" onclick="deleteFile(${index})" style="background: #e74c3c; margin-left: 5px;">🗑️ Supprimer</button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateStats() {
    const stats = {
        total: filteredFiles.length,
        pending: 0,
        late: 0,
        completed: 0
    };
    filteredFiles.forEach(file => {
        const status = getFileStatus(file);
        switch (status.status) {
            case 'traite':
                stats.completed++;
                break;
            case 'en-retard':
                stats.late++;
                break;
            case 'a-traiter':
            case 'dernier-jour':
                stats.pending++;
                break;
        }
    });
    document.getElementById('totalCount').textContent = stats.total;
    document.getElementById('pendingCount').textContent = stats.pending;
    document.getElementById('lateCount').textContent = stats.late;
    document.getElementById('completedCount').textContent = stats.completed;
}

function exportToExcel() {
    if (filteredFiles.length === 0) {
        alert('Aucun dossier à exporter');
        return;
    }
    const exportData = filteredFiles.map(file => {
        const status = getFileStatus(file);
        return {
            'Date de réception': formatDate(file.dateReception),
            'Nom du client': file.clientName,
            'Parcelle': file.parcelle || '',
            'Îlot': file.ilot || '',
            'Section': file.section || '',
            'Commune': file.commune || '',
            'Référence cadastrale': formatCadastralRef(file),
            'Situation': file.situation || '',
            'Date de sortie': formatDate(file.dateSortie),
            'Date de récupération': formatDate(file.dateRecuperation),
            'Statut': status.label
        };
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dossiers Fonciers');
    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `dossiers-fonciers-${today}.xlsx`);
}

window.onclick = function(event) {
    const modal = document.getElementById('fileModal');
    if (event.target === modal) {
        closeModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        openAddModal();
    }
    if (event.key === 'Escape') {
        closeModal();
    }
});
