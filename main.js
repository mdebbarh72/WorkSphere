let employees = [];
let currentEditingId = null;
let currentZoneForSelection = null;

const DEFAULT_MALE = 'businessman-character-avatar-isolated_24877-60111.jpg';
const DEFAULT_FEMALE = '10250-woman-avatar.png';
const DEFAULT_PHOTO = DEFAULT_MALE;

const REGEX = {
    name: /^[a-zA-ZÀ-ÿ\s'-]+\s+[a-zA-ZÀ-ÿ\s'-]+$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^(\+212|0)(5|6|7)(\s?\d{2}){4}$/,
    url: /^(https?:\/\/.+|\.?\/?[\w\-\/]+\.(jpg|jpeg|png|gif|webp|svg))$/i
};

function generateId() {
    return 'emp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function loadData() {
    const saved = localStorage.getItem('workspherData');
    if (saved) {
        employees = JSON.parse(saved);
    } else {
        employees = [
            {
                id: generateId(),
                name: "Marie Dupont",
                role: "Réceptionniste",
                gender: "Femme",
                photo: "https://i.pravatar.cc/150?img=1",
                email: "marie.dupont@worksphere.com",
                phone: "+33 1 23 45 67 89",
                experiences: [{company: "HotelLux", position: "Réceptionniste", duration: "2020-2023"}],
                zone: null,
                position: null
            },
            {
                id: generateId(),
                name: "Jean Martin",
                role: "Technicien IT",
                gender: "Homme",
                photo: "https://i.pravatar.cc/150?img=12",
                email: "jean.martin@worksphere.com",
                phone: "+33 1 23 45 67 90",
                experiences: [{company: "TechCorp", position: "Support IT", duration: "2019-2022"}],
                zone: null,
                position: null
            },
            {
                id: generateId(),
                name: "Sophie Bernard",
                role: "Agent de sécurité",
                gender: "Femme",
                photo: "https://i.pravatar.cc/150?img=5",
                email: "sophie.bernard@worksphere.com",
                phone: "+33 1 23 45 67 91",
                experiences: [{company: "SecurePro", position: "Agent", duration: "2018-2023"}],
                zone: null,
                position: null
            },
            {
                id: generateId(),
                name: "Lucas Moreau",
                role: "Manager",
                gender: "Homme",
                photo: "https://i.pravatar.cc/150?img=13",
                email: "lucas.moreau@worksphere.com",
                phone: "+33 1 23 45 67 92",
                experiences: [{company: "BizCorp", position: "Manager", duration: "2017-2023"}],
                zone: null,
                position: null
            },
            {
                id: generateId(),
                name: "Emma Petit",
                role: "Nettoyage",
                gender: "Femme",
                photo: "https://i.pravatar.cc/150?img=9",
                email: "emma.petit@worksphere.com",
                phone: "+33 1 23 45 67 93",
                experiences: [{company: "CleanPro", position: "Agent", duration: "2021-2023"}],
                zone: null,
                position: null
            }
        ];
        saveData();
    }
}

function saveData() {
    localStorage.setItem('workspherData', JSON.stringify(employees));
}


function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    toast.innerHTML = `
        <div class="text-2xl">${icons[type]}</div>
        <div class="flex-1">
            <p class="font-semibold text-gray-800">${message}</p>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getRoleClass(role) {
    const classes = {
        'Réceptionniste': 'role-receptionist',
        'Technicien IT': 'role-it',
        'Agent de sécurité': 'role-security',
        'Manager': 'role-manager',
        'Nettoyage': 'role-cleaning',
        'Employé': 'role-employee'
    };
    return classes[role] || 'role-employee';
}

function getDefaultPhoto(gender) {
    return gender === 'Femme' ? DEFAULT_FEMALE : DEFAULT_MALE;
}

function validateField(input, regex, errorClass) {
    const errorEl = document.querySelector(`.${errorClass}`);
    if (input.value && !regex.test(input.value)) {
        errorEl.classList.remove('hidden');
        input.classList.add('border-red-500');
        return false;
    } else {
        errorEl.classList.add('hidden');
        input.classList.remove('border-red-500');
        return true;
    }
}

function updatePhotoPreview(previewId, url, gender) {
    const preview = document.getElementById(previewId);
    if (url && url.trim() !== '') {
        const img = new Image();
        img.onload = () => {
            preview.src = url;
        };
        img.onerror = () => {
            preview.src = gender === 'Femme' ? DEFAULT_FEMALE : DEFAULT_MALE;
            if (url.startsWith('http')) {
                showToast('Impossible de charger l\'image depuis l\'URL', 'warning');
            } else {
                showToast('Image locale non trouvée. Vérifiez le chemin.', 'warning');
            }
        };
        img.src = url;
    } else {
        preview.src = gender === 'Femme' ? DEFAULT_FEMALE : DEFAULT_MALE;
    }
}

function renderAll(){
    renderSidebarLists();
    renderFloorPlan();
    updateCounts();
    updateZoneCounts();
}

function updateCounts() {
    const total = employees.length;
    const unassigned = employees.filter(e => !e.zone).length;
    const assigned = employees.filter(e => e.zone).length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('unassignedCount').textContent = unassigned;
    document.getElementById('assignedCount').textContent = assigned;
}

function updateZoneCounts() {
    document.querySelectorAll('.zone').forEach(zoneEl => {
        const zoneName = zoneEl.dataset.zone;
        const max = zoneEl.dataset.max;
        const count = employees.filter(e => e.zone === zoneName).length;
        const label = zoneEl.querySelector('.zone-label');
        const isRestricted = zoneEl.classList.contains('restricted');
        const icon = isRestricted ? '🔒 ' : '';
        label.textContent = `${icon}${zoneName} (${count}/${max})`;
    });
}

function renderSidebarLists(){
    const searchTerm= document.getElementById('searchInput').value.toLowerCase();
    const roleFilter= document.getElementById('roleFilter').value;

    let unassigned= employees.filter(e=> !e.zone)
    let assigned= employees.filter(e => e.zone)

    if(searchTerm)
    {
        unassigned= unassigned.filter(e=> 
            e.name.toLowerCase().includes(searchTerm) ||
            e.role.toLowerCase().includes(searchTerm)
        )
        assigned= assigned.filter(e=>
            e.name.toLowerCase().includes(searchTerm)||
            e.role.toLowerCase().includes(searchTerm)
        )
    }

    if(roleFilter){
        unassigned= unassigned.filter(e => e.role === roleFilter);
        assigned= assigned.filter(e=> e.role === roleFilter);
    }

    const unassignedList= document.getElementById('unassignedList');
    const assignedList= document.getElementById('assignedList');

    unassignedList.innerHTML= unassigned.length>0?
    unassigned.map(emp => createEmployeeCard(emp)).join('') :
    '<p class="text-sm text-gray-500 text-center py-4">Aucun employé</p>'

    assignedList.innerHTML= assigned.length>0? 
    assigned.map(emp => createEmployeeCard(emp)).join(''):
    '<p class="text-sm text-gray-500 text-center py-4">Aucun employé</p>'
}

function createEmployeeCard(emp){
    const roleClass= getRoleClass(emp.role);
    const photoUrl = emp.photo || getDefaultPhoto(emp.gender || 'Homme')

    let empName= document.createElement('h4')
    empName.className='font-semibold'

    return  `
                <div class="employee-card" data-id="${emp.id}">
                    <div class="flex items-center gap-3">
                        <img src="${photoUrl}" alt="${emp.name}" 
                             class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                             onerror="this.src='${getDefaultPhoto(emp.gender || 'Homme')}'">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-semibold text-gray-800 text-sm truncate cursor-pointer hover:text-purple-600" 
                                onclick="viewProfile('${emp.id}')">${emp.name}</h4>
                            <span class="role-badge ${roleClass}">${emp.role}</span>
                            ${emp.zone ? `<p class="text-xs text-gray-500 mt-1"> ${emp.zone}</p>` : ''}
                        </div>
                        <div class="flex gap-1">
                            ${emp.zone ? `<button onclick="unassignEmployee('${emp.id}')" 
                                class="text-orange-500 hover:text-orange-700 p-1" title="Retirer de la zone">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                                </svg>
                            </button>` : ''}
                            <button onclick="deleteEmployee('${emp.id}')" 
                                class="text-red-500 hover:text-red-700 p-1 cursor-pointer" title="Supprimer">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `
}

function renderFloorPlan() {
    document.querySelectorAll('.employee-avatar').forEach(el => el.remove());

    employees.filter(e => e.zone).forEach(emp => {
        createAvatarOnPlan(emp);
    });
}

function createAvatarOnPlan(emp) {
    const avatar = document.createElement('div');
    avatar.className = 'employee-avatar';
    avatar.dataset.id = emp.id;
    
    const photoUrl = emp.photo || getDefaultPhoto(emp.gender || 'Homme');

    avatar.innerHTML = `
        <div class="avatar-circle">
            <img src="${photoUrl}" alt="${emp.name}" onerror="this.src='${getDefaultPhoto(emp.gender || 'Homme')}'">
        </div>
        <div class="avatar-name">${emp.name.split(' ')[0]}</div>
        <div class="avatar-remove" title="Retirer">×</div>
    `;

    avatar.querySelector('.avatar-circle').addEventListener('click', () => viewProfile(emp.id));
    avatar.querySelector('.avatar-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        unassignEmployee(emp.id);
    });

    document.getElementById(emp.zone).appendChild(avatar);
}