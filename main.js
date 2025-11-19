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

