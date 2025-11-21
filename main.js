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

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    renderAll();
});

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

function loadData() {
    const saved = localStorage.getItem('workspherData');
    if (saved) {
        employees = JSON.parse(saved);
    } else {
        // employees = await fetch('./employeesData.json')
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

// async function fetchData(dataPath)
// {
//     try{
//         const response= await fetch(dataPath)
//         if(!response.ok)
//         {
//             throw new Error(`Error, status: ${response.status}`)
//         }
//         const cardsData= await response.json()
//         return cardsData;
//     }

//     catch(error){
//         console.error("failed to fetch data: ",error)
//         return [];
//     }
// }

function saveData() {
    localStorage.setItem('workspherData', JSON.stringify(employees));
}

function generateId() {
    return 'emp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function setupEventListeners() {
    document.getElementById('addWorkerBtn').addEventListener('click', openAddModal);
    
    document.getElementById('closeModal').addEventListener('click', closeEmployeeModal);
    document.getElementById('cancelModal').addEventListener('click', closeEmployeeModal);
    document.getElementById('employeeForm').addEventListener('submit', handleEmployeeSubmit);
    
    
    document.getElementById('employeePhoto').addEventListener('input', (e) => {
        const url = e.target.value.trim();
        const gender = document.querySelector('input[name="employeeGender"]:checked')?.value || 'Homme';
        updatePhotoPreview('photoPreview', url, gender);
    });
    
    
    document.querySelectorAll('input[name="employeeGender"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const url = document.getElementById('employeePhoto').value.trim();
            updatePhotoPreview('photoPreview', url, e.target.value);
        });
    });

    
    document.getElementById('employeeName').addEventListener('blur', (e) => validateField(e.target, REGEX.name, 'error-name'));
    document.getElementById('employeeEmail').addEventListener('blur', (e) => validateField(e.target, REGEX.email, 'error-email'));
    document.getElementById('employeePhone').addEventListener('blur', (e) => validateField(e.target, REGEX.phone, 'error-phone'));
    document.getElementById('employeePhoto').addEventListener('blur', (e) => validateField(e.target, REGEX.url, 'error-photo'));
    
    document.getElementById('addExperienceBtn').addEventListener('click', () => addExperienceField('experiencesList'));
    
    document.getElementById('closeProfileModal').addEventListener('click', closeProfileModal);
    
    
    
    document.getElementById('editEmployeePhoto').addEventListener('input', (e) => {
        const url = e.target.value.trim();
        const gender = document.querySelector('input[name="editEmployeeGender"]:checked')?.value || 'Homme';
        updatePhotoPreview('editPhotoPreview', url, gender);
    });
    
    document.querySelectorAll('input[name="editEmployeeGender"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const url = document.getElementById('editEmployeePhoto').value.trim();
            updatePhotoPreview('editPhotoPreview', url, e.target.value);
        });
    });

   
    document.getElementById('editEmployeeName').addEventListener('blur', (e) => validateField(e.target, REGEX.name, 'error-edit-name'));
    document.getElementById('editEmployeeEmail').addEventListener('blur', (e) => validateField(e.target, REGEX.email, 'error-edit-email'));
    document.getElementById('editEmployeePhone').addEventListener('blur', (e) => validateField(e.target, REGEX.phone, 'error-edit-phone'));
    
    document.getElementById('editAddExperienceBtn').addEventListener('click', () => addExperienceField('editExperiencesList'));
    
    document.getElementById('closeZoneSelectModal').addEventListener('click', closeZoneSelectModal);
    

    document.querySelectorAll('.addToZone').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const zone = e.target.closest('.zone');
            openZoneSelectModal(zone.dataset.zone);
        });
    });

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

function getDefaultPhoto(gender) {
    return gender === 'Femme' ? DEFAULT_FEMALE : DEFAULT_MALE;
}

function renderAll(){
    renderSidebarLists();
    renderFloorPlan();
    updateCounts();
    updateZoneCounts();
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

function canAssignToZone(emp, zoneName) {
    const zone = document.querySelector(`[data-zone="${zoneName}"]`);
    const restricted = zone.dataset.restricted;
    const max = parseInt(zone.dataset.max);
    const currentCount = employees.filter(e => e.zone === zoneName && e.id !== emp.id).length;

    if (currentCount >= max) {
        return false;
    }

    if (restricted === 'no-cleaning' && emp.role === 'Nettoyage') {
        return false;
    }

    if (restricted && restricted !== 'no-cleaning') {
        return emp.role === restricted || emp.role === 'Manager';
    }

    return true;
}

function assignEmployeeToZone(empId, zone, position) {
    const emp = employees.find(e => e.id === empId);
    if (emp) {
        emp.zone = zone;
        emp.position = position;
        saveData();
        renderAll();
    }
}

function unassignEmployee(empId) {
    const emp = employees.find(e => e.id === empId);
    if (emp) {
        emp.zone = null;
        emp.position = null;
        saveData();
        renderAll();
        showToast(`${emp.name} retiré(e) de la zone`, 'info');
    }
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

function openAddModal() {
    currentEditingId = null;
    document.getElementById('employeeForm').reset();
    document.getElementById('photoPreview').src = DEFAULT_MALE;
    document.getElementById('experiencesList').innerHTML = '';
    document.getElementById('employeeModal').classList.add('active');
    
    
    document.querySelectorAll('.error-name, .error-email, .error-phone, .error-photo').forEach(el => el.classList.add('hidden'));
}

function closeEmployeeModal() {
    document.getElementById('employeeModal').classList.remove('active');
    currentEditingId = null;
}

function addExperienceField(listId, data = null) {
    const expList = document.getElementById(listId);
    const expItem = document.createElement('div');
    expItem.className = 'border border-gray-300 rounded-lg p-3';
    expItem.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold text-gray-700">Expérience</span>
            <button type="button" class="remove-experience text-red-500 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <input type="text" class="exp-company w-full px-3 py-2 border border-gray-300 rounded mb-2" 
                placeholder="Entreprise" value="${data?.company || ''}">
        <input type="text" class="exp-position w-full px-3 py-2 border border-gray-300 rounded mb-2" 
                placeholder="Poste" value="${data?.position || ''}">
        <input type="text" class="exp-duration w-full px-3 py-2 border border-gray-300 rounded" 
                placeholder="Durée (ex: 2020-2023)" value="${data?.duration || ''}">
    `;

    expItem.querySelector('.remove-experience').addEventListener('click', () => expItem.remove());
    expList.appendChild(expItem);
}

function handleEmployeeSubmit(e) {
    e.preventDefault();

    
    const nameValid = validateField(document.getElementById('employeeName'), REGEX.name, 'error-name');
    const emailValid = validateField(document.getElementById('employeeEmail'), REGEX.email, 'error-email');
    const phoneValid = validateField(document.getElementById('employeePhone'), REGEX.phone, 'error-phone');
    
    const photoInput = document.getElementById('employeePhoto');
    let photoValid = true;
    if (photoInput.value && !REGEX.url.test(photoInput.value)) {
        document.querySelector('.error-photo').classList.remove('hidden');
        photoValid = false;
    }

    if (!nameValid || !emailValid || !phoneValid || !photoValid) {
        showToast('Veuillez corriger les erreurs dans le formulaire', 'error');
        return;
    }

    const experiences = [];
    document.querySelectorAll('#experiencesList > div').forEach(item => {
        const company = item.querySelector('.exp-company').value;
        const position = item.querySelector('.exp-position').value;
        const duration = item.querySelector('.exp-duration').value;
        if (company || position || duration) {
            experiences.push({company, position, duration});
        }
    });

    const gender = document.querySelector('input[name="employeeGender"]:checked')?.value || 'Homme';
    const photoUrl = document.getElementById('employeePhoto').value.trim();

    const employeeData = {
        name: document.getElementById('employeeName').value.trim(),
        role: document.getElementById('employeeRole').value,
        gender: gender,
        photo: photoUrl || '',
        email: document.getElementById('employeeEmail').value.trim(),
        phone: document.getElementById('employeePhone').value.trim(),
        experiences: experiences,
        zone: null,
        position: null
    };

    employeeData.id = generateId();
    employees.push(employeeData);

    saveData();
    closeEmployeeModal();
    renderAll();
    showToast(`${employeeData.name} ajouté(e) avec succès!`, 'success');
}

function deleteEmployee(empId) {
    const emp = employees.find(e => e.id === empId);
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${emp.name}?`)) {
        employees = employees.filter(e => e.id !== empId);
        saveData();
        renderAll();
        showToast(`${emp.name} supprimé(e)`, 'info');
    }
}

function viewProfile(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const roleClass = getRoleClass(emp.role);
    const photoUrl = emp.photo || getDefaultPhoto(emp.gender || 'Homme');
    
    const content = `
        <div class="text-center">
            <img src="${photoUrl}" alt="${emp.name}" 
                    class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-200 object-cover"
                    onerror="this.src='${getDefaultPhoto(emp.gender || 'Homme')}'">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">${emp.name}</h3>
            <span class="role-badge ${roleClass}">${emp.role}</span>
            ${emp.gender ? `<p class="text-sm text-gray-500 mt-2">${emp.gender === 'Homme' ? '👨' : '👩'} ${emp.gender}</p>` : ''}
            
            <div class="mt-6 text-left space-y-3">
                <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span class="text-gray-700">${emp.email}</span>
                </div>
                <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span class="text-gray-700">${emp.phone}</span>
                </div>
                ${emp.zone ? `
                <div class="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="text-green-700 font-medium">📍 ${emp.zone}</span>
                </div>
                ` : '<div class="bg-orange-50 p-3 rounded-lg text-center"><p class="text-orange-600 font-medium">⚠️ Non assigné</p></div>'}
            </div>

            ${emp.experiences && emp.experiences.length > 0 ? `
            <div class="mt-6">
                <h4 class="text-lg font-bold text-gray-800 mb-3 text-left">Expériences professionnelles</h4>
                <div class="space-y-3 text-left">
                    ${emp.experiences.map(exp => `
                        <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                            <p class="font-semibold text-gray-800">${exp.position}</p>
                            <p class="text-sm text-gray-600">${exp.company}</p>
                            <p class="text-xs text-gray-500 mt-1">📅 ${exp.duration}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : '<div class="mt-6 text-gray-500 text-sm">Aucune expérience renseignée</div>'}

            <div class="mt-6 flex gap-2">
                <button onclick="openEditFromProfile('${emp.id}')" 
                        class="flex-1 btn bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 font-semibold">
                    ✏️ Modifier
                </button>
                ${emp.zone ? `
                <button onclick="unassignEmployee('${emp.id}'); closeProfileModal();" 
                        class="flex-1 btn bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 font-semibold">
                    ↩️ Retirer
                </button>
                ` : ''}
            </div>
        </div>
    `;

    document.getElementById('profileContent').innerHTML = content;
    document.getElementById('profileModal').classList.add('active');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('active');
}

function openZoneSelectModal(zoneName) {
    currentZoneForSelection = zoneName;
    const zone = document.querySelector(`[data-zone="${zoneName}"]`);
    const restricted = zone.dataset.restricted;

    const eligible = employees.filter(emp => {
        if (emp.zone) return false;
        if (restricted === 'no-cleaning' && emp.role === 'Nettoyage') return false;
        if (restricted && restricted !== 'no-cleaning') {
            return emp.role === restricted || emp.role === 'Manager';
        }
        return true;
    });

    const list = document.getElementById('eligibleEmployeesList');
    
    if (eligible.length === 0) {
        list.innerHTML = '<p class="text-center text-gray-500 py-4">Aucun employé disponible pour cette zone</p>';
    } else {
        list.innerHTML = eligible.map(emp => {
            const roleClass = getRoleClass(emp.role);
            const photoUrl = emp.photo || getDefaultPhoto(emp.gender || 'Homme');
            return `
                <div class="p-3 border border-gray-200 rounded-lg hover:border-purple-500 cursor-pointer transition-all"
                        onclick="assignFromModal('${emp.id}')">
                    <div class="flex items-center gap-3">
                        <img src="${photoUrl}" alt="${emp.name}" 
                                class="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                onerror="this.src='${getDefaultPhoto(emp.gender || 'Homme')}'">
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800 text-sm">${emp.name}</h4>
                            <span class="role-badge ${roleClass}">${emp.role}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    document.getElementById('zoneSelectModal').classList.add('active');
}

function closeZoneSelectModal() {
    document.getElementById('zoneSelectModal').classList.remove('active');
    currentZoneForSelection = null;
}

function assignFromModal(empId) {
    if (!currentZoneForSelection) return;

    assignEmployeeToZone(empId, currentZoneForSelection, null);
    closeZoneSelectModal();
    
    const emp = employees.find(e => e.id === empId);
    showToast(`${emp.name} assigné(e) à ${currentZoneForSelection}`, 'success');
}

window.addEventListener('resize', () => {
    renderFloorPlan();
});