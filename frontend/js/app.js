const API_BASE_URL = 'http://127.0.0.1:8000';
let currentPage = 1;
let pageSize = 10;

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
}

function isAuthenticated() {
    return !!getToken();
}

function updateNavbar() {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const dashboardLink = document.getElementById('dashboard-link');
    const studentsLink = document.getElementById('students-link');
    const profileLink = document.getElementById('profile-link');
    const logoutLink = document.getElementById('logout-link');

    if (isAuthenticated()) {
        if (loginLink) loginLink.classList.add('hidden');
        if (registerLink) registerLink.classList.add('hidden');
        if (dashboardLink) dashboardLink.classList.remove('hidden');
        if (studentsLink) studentsLink.classList.remove('hidden');
        if (profileLink) profileLink.classList.remove('hidden');
        if (logoutLink) logoutLink.classList.remove('hidden');
    } else {
        if (loginLink) loginLink.classList.remove('hidden');
        if (registerLink) registerLink.classList.remove('hidden');
        if (dashboardLink) dashboardLink.classList.add('hidden');
        if (studentsLink) studentsLink.classList.add('hidden');
        if (profileLink) profileLink.classList.add('hidden');
        if (logoutLink) logoutLink.classList.add('hidden');
    }
}

function checkAuthAndRedirect() {
    const protectedPages = ['dashboard.html', 'students.html', 'add_student.html', 'edit_student.html', 'profile.html'];
    const currentPageName = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPageName) && !isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

function handleLogout() {
    removeToken();
    window.location.href = 'index.html';
}

async function apiRequest(endpoint, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || 'API request failed');
    }

    return result;
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const result = await apiRequest('/login', 'POST', { username, password });
        setToken(result.access_token);
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await apiRequest('/register', 'POST', { username, email, password });
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
}

async function loadDashboard() {
    try {
        const stats = await apiRequest('/dashboard', 'GET');
        document.getElementById('total-students').textContent = stats.total_students;
        document.getElementById('male-students').textContent = stats.male_students;
        document.getElementById('female-students').textContent = stats.female_students;
        document.getElementById('average-cgpa').textContent = stats.average_cgpa;

        const deptStatsDiv = document.getElementById('dept-stats');
        deptStatsDiv.innerHTML = '';
        for (const [dept, count] of Object.entries(stats.students_per_department)) {
            const deptCard = document.createElement('div');
            deptCard.className = 'dept-card';
            deptCard.innerHTML = `
                <h3>${dept}</h3>
                <p>${count} students</p>
            `;
            deptStatsDiv.appendChild(deptCard);
        }
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

async function loadStudents(page = 1) {
    currentPage = page;
    try {
        const result = await apiRequest(`/students?page=${page}&page_size=${pageSize}`, 'GET');
        const tbody = document.getElementById('students-body');
        tbody.innerHTML = '';

        result.students.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.gender}</td>
                <td>${student.department}</td>
                <td>${student.semester}</td>
                <td>${student.cgpa}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>
                    <div class="action-buttons">
                        <a href="edit_student.html?id=${student.id}" class="btn btn-edit">Edit</a>
                        <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        const totalPages = Math.ceil(result.total / pageSize);
        renderPagination(totalPages);
    } catch (error) {
        console.error('Failed to load students:', error);
    }
}

function renderPagination(totalPages) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => loadStudents(i);
        paginationDiv.appendChild(btn);
    }
}

async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            await apiRequest(`/students/${id}`, 'DELETE');
            loadStudents(currentPage);
        } catch (error) {
            alert('Failed to delete student: ' + error.message);
        }
    }
}

async function handleAddStudent(e) {
    e.preventDefault();
    const student = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        department: document.getElementById('department').value,
        semester: parseInt(document.getElementById('semester').value),
        cgpa: parseFloat(document.getElementById('cgpa').value),
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    try {
        await apiRequest('/students', 'POST', student);
        alert('Student added successfully!');
        window.location.href = 'students.html';
    } catch (error) {
        alert('Failed to add student: ' + error.message);
    }
}

async function loadStudentForEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        window.location.href = 'students.html';
        return;
    }

    try {
        const student = await apiRequest(`/students/${id}`, 'GET');
        document.getElementById('name').value = student.name;
        document.getElementById('age').value = student.age;
        document.getElementById('gender').value = student.gender;
        document.getElementById('department').value = student.department;
        document.getElementById('semester').value = student.semester;
        document.getElementById('cgpa').value = student.cgpa;
        document.getElementById('email').value = student.email;
        document.getElementById('phone').value = student.phone;

        document.getElementById('edit-student-form').dataset.studentId = id;
    } catch (error) {
        console.error('Failed to load student:', error);
        window.location.href = 'students.html';
    }
}

async function handleEditStudent(e) {
    e.preventDefault();
    const id = e.target.dataset.studentId;
    const student = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        department: document.getElementById('department').value,
        semester: parseInt(document.getElementById('semester').value),
        cgpa: parseFloat(document.getElementById('cgpa').value),
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    try {
        await apiRequest(`/students/${id}`, 'PUT', student);
        alert('Student updated successfully!');
        window.location.href = 'students.html';
    } catch (error) {
        alert('Failed to update student: ' + error.message);
    }
}

async function handleSearch() {
    const searchInput = document.getElementById('search-input').value.trim();
    const deptFilter = document.getElementById('dept-filter').value.trim();

    if (searchInput) {
        try {
            const students = await apiRequest(`/students/search?name=${encodeURIComponent(searchInput)}`, 'GET');
            renderSearchResults(students);
        } catch (error) {
            console.error('Search failed:', error);
            alert('Search failed: ' + error.message);
        }
    } else if (deptFilter) {
        try {
            const students = await apiRequest(`/students/filter?department=${encodeURIComponent(deptFilter)}`, 'GET');
            renderSearchResults(students);
        } catch (error) {
            console.error('Filter failed:', error);
            alert('Filter failed: ' + error.message);
        }
    } else {
        loadStudents(1);
    }
}

function renderSearchResults(students) {
    const tbody = document.getElementById('students-body');
    tbody.innerHTML = '';
    document.getElementById('pagination').innerHTML = '';

    students.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.gender}</td>
            <td>${student.department}</td>
            <td>${student.semester}</td>
            <td>${student.cgpa}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>
                <div class="action-buttons">
                    <a href="edit_student.html?id=${student.id}" class="btn btn-edit">Edit</a>
                    <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function loadProfile() {
    try {
        const profile = await apiRequest('/profile', 'GET');
        document.getElementById('profile-username').textContent = profile.username;
        document.getElementById('profile-email').textContent = profile.email;
        document.getElementById('profile-created').textContent = new Date(profile.created_at).toLocaleDateString();
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    checkAuthAndRedirect();

    const currentPageName = window.location.pathname.split('/').pop();

    if (currentPageName === 'login.html') {
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
    } else if (currentPageName === 'register.html') {
        const registerForm = document.getElementById('register-form');
        if (registerForm) registerForm.addEventListener('submit', handleRegister);
    } else if (currentPageName === 'dashboard.html') {
        loadDashboard();
    } else if (currentPageName === 'students.html') {
        loadStudents(1);
        
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) searchBtn.addEventListener('click', handleSearch);
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
        
        const deptFilter = document.getElementById('dept-filter');
        if (deptFilter) deptFilter.addEventListener('change', handleSearch);
    } else if (currentPageName === 'add_student.html') {
        const addForm = document.getElementById('add-student-form');
        if (addForm) addForm.addEventListener('submit', handleAddStudent);
    } else if (currentPageName === 'edit_student.html') {
        loadStudentForEdit();
        const editForm = document.getElementById('edit-student-form');
        if (editForm) editForm.addEventListener('submit', handleEditStudent);
    } else if (currentPageName === 'profile.html') {
        loadProfile();
    }

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });
});
