// Výchozí data z obrázku, která se načtou, pokud je paměť prázdná
const defaultData = [
    { id: 3, jmeno: "Petr", prijmeni: "Horák", rodne_cislo: "900829/2540", ulice: "Benešovská", cislo_popisne: "294", psc: "40747", mesto: "Varnsdorf" },
    { id: 4, jmeno: "Jan", prijmeni: "Novák", rodne_cislo: "900110/1234", ulice: "Horní", cislo_popisne: "123", psc: "40747", mesto: "Varnsdorf" },
    { id: 7, jmeno: "František", prijmeni: "Peterka", rodne_cislo: "301125/5150", ulice: "Dolní", cislo_popisne: "69", psc: "11000", mesto: "Praha" },
    { id: 6, jmeno: "Jan", prijmeni: "Vysočanský", rodne_cislo: "551029/5555", ulice: "Hlavní", cislo_popisne: "42", psc: "11000", mesto: "Praha" }
];

// Načtení dat z localStorage nebo použití výchozích dat
let osoby = JSON.parse(localStorage.getItem('osoby'));
if (!osoby) {
    osoby = defaultData;
    localStorage.setItem('osoby', JSON.stringify(osoby));
}

// Elementy z HTML
const personForm = document.getElementById('personForm');
const tableBody = document.getElementById('personTableBody');
const btnCancel = document.getElementById('btnCancel');
const personIdInput = document.getElementById('personId');

// Funkce pro vykreslení tabulky
function renderTable() {
    tableBody.innerHTML = '';
    
    if (osoby.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" class="text-center" style="color: #94a3b8; padding: 24px;">Žádné záznamy k dispozici.</td></tr>`;
        return;
    }

    osoby.forEach(osoba => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${osoba.id}</td>
            <td>${osoba.jmeno}</td>
            <td>${osoba.prijmeni}</td>
            <td>${osoba.rodne_cislo}</td>
            <td>${osoba.ulice}</td>
            <td>${osoba.cislo_popisne}</td>
            <td>${osoba.psc}</td>
            <td>${osoba.mesto}</td>
            <td class="text-center">
                <button class="btn-sm btn-edit" onclick="editPerson(${osoba.id})">Upravit</button>
                <button class="btn-sm btn-delete" onclick="deletePerson(${osoba.id})">Smazat</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Uložení nebo aktualizace osoby (Submit formuláře)
personForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const id = personIdInput.value;
    const novyUzivatel = {
        jmeno: document.getElementById('jmeno').value,
        prijmeni: document.getElementById('prijmeni').value,
        rodne_cislo: document.getElementById('rodne_cislo').value,
        ulice: document.getElementById('ulice').value,
        cislo_popisne: document.getElementById('cislo_popisne').value,
        psc: document.getElementById('psc').value,
        mesto: document.getElementById('mesto').value
    };

    if (id) {
        // EDITACE stávajícího člověka
        const index = osoby.findIndex(o => o.id == id);
        if (index !== -1) {
            novyUzivatel.id = parseInt(id);
            osoby[index] = novyUzivatel;
        }
    } else {
        // PŘIDÁNÍ nového člověka (vygenerujeme nové ID)
        const maxId = osoby.length > 0 ? Math.max(...osoby.map(o => o.id)) : 0;
        novyUzivatel.id = maxId + 1;
        osoby.push(novyUzivatel);
    }

    // Uložení do prohlížeče a překreslení tabulky
    localStorage.setItem('osoby', JSON.stringify(osoby));
    renderTable();
    personForm.reset();
    personIdInput.value = '';
});

// Smazání osoby
function deletePerson(id) {
    if (confirm('Opravdu chcete tuto osobu smazat?')) {
        osoby = osoby.filter(o => o.id !== id);
        localStorage.setItem('osoby', JSON.stringify(osoby));
        renderTable();
        
        // Pokud zrovna mažeme editovaného člověka, resetujeme formulář
        if (personIdInput.value == id) {
            personForm.reset();
            personIdInput.value = '';
        }
    }
}

// Příprava formuláře pro úpravu (Editace)
function editPerson(id) {
    const osoba = osoby.find(o => o.id === id);
    if (osoba) {
        personIdInput.value = osoba.id;
        document.getElementById('jmeno').value = osoba.jmeno;
        document.getElementById('prijmeni').value = osoba.prijmeni;
        document.getElementById('rodne_cislo').value = osoba.rodne_cislo;
        document.getElementById('ulice').value = osoba.ulice;
        document.getElementById('cislo_popisne').value = osoba.cislo_popisne;
        document.getElementById('psc').value = osoba.psc;
        document.getElementById('mesto').value = osoba.mesto;
        
        // Sroluje stránku nahoru k formuláři
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Tlačítko Zrušit (Reset formuláře)
btnCancel.addEventListener('click', function() {
    personForm.reset();
    personIdInput.value = '';
});

// Prvotní načtení tabulky po otevření stránky
renderTable();