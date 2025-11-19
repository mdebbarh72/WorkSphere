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