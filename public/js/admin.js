document.addEventListener('DOMContentLoaded', () => {
    // Check if admin is logged in
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail && window.location.pathname.includes('admin.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    if (document.getElementById('admin-user-email')) {
        document.getElementById('admin-user-email').textContent = adminEmail || 'Admin';
    }

    loadDashboardData();

    // Handle Add Project Form Submission
    const addProjectForm = document.getElementById('add-project-form');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('p-title').value;
            const category = document.getElementById('p-category').value;
            const description = document.getElementById('p-desc').value;
            const liveLink = document.getElementById('p-live').value;
            const githubLink = document.getElementById('p-github').value;

            try {
                const res = await fetch('https://deepak-portfolio-3pkq.onrender.com/api/projects/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, category, description, liveLink, githubLink })
                });
                const data = await res.json();
                alert(data.message);
                if (data.success) {
                    addProjectForm.reset();
                    loadDashboardData();
                }
            } catch (err) {
                console.error(err);
                alert('Error adding project');
            }
        });
    }
});

// Tab Switching Function
function switchTab(tabName) {
    document.getElementById('tab-dashboard').classList.add('hidden');
    document.getElementById('tab-projects').classList.add('hidden');
    document.getElementById('tab-messages').classList.add('hidden');

    if (tabName === 'dashboard') {
        document.getElementById('tab-dashboard').classList.remove('hidden');
        document.getElementById('page-title').textContent = 'Admin Dashboard';
    } else if (tabName === 'projects') {
        document.getElementById('tab-projects').classList.remove('hidden');
        document.getElementById('page-title').textContent = 'Manage Projects';
        loadAdminProjects();
    } else if (tabName === 'messages') {
        document.getElementById('tab-messages').classList.remove('hidden');
        document.getElementById('page-title').textContent = 'Client Messages';
        loadAdminMessages();
    }
}

// Fetch and Update Dashboard Counts & Lists
async function loadDashboardData() {
    try {
        // Fetch Projects
        const pRes = await fetch('https://deepak-portfolio-3pkq.onrender.com/api/projects');
        const pData = await pRes.json();
        if (pData.success) {
            document.getElementById('stat-projects-count').textContent = pData.projects.length;
        }

        // Fetch Messages
        const mRes = await fetch('https://deepak-portfolio-3pkq.onrender.com/api/messages');
        const mData = await mRes.json();
        if (mData.success) {
            document.getElementById('stat-messages-count').textContent = mData.messages.length;
            document.getElementById('msg-badge').textContent = mData.messages.length;
        }
    } catch (err) {
        console.error('Error loading dashboard stats:', err);
    }
}

// Load Projects for Management List
async function loadAdminProjects() {
    try {
        const res = await fetch('https://deepak-portfolio-3pkq.onrender.com/api/projects');
        const data = await res.json();
        const listContainer = document.getElementById('admin-projects-list');
        listContainer.innerHTML = '';

        if (data.success && data.projects.length > 0) {
            data.projects.forEach(proj => {
                listContainer.innerHTML += `
                    <div class="bg-[#111827] border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <h4 class="font-bold text-sm">${proj.title}</h4>
                            <p class="text-xs text-gray-400">${proj.category}</p>
                        </div>
                        <button onclick="deleteProject('${proj._id}')" class="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-lg transition">Delete</button>
                    </div>
                `;
            });
        } else {
            listContainer.innerHTML = '<p class="text-xs text-gray-400">No projects found.</p>';
        }
    } catch (err) {
        console.error(err);
    }
}

// Delete Project Handler
async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
        const res = await fetch(`https://deepak-portfolio-3pkq.onrender.com/api/projects/${id}`, { method: 'DELETE' });
        const data = await res.json();
        alert(data.message);
        loadAdminProjects();
        loadDashboardData();
    } catch (err) {
        console.error(err);
    }
}

// Load Messages List
async function loadAdminMessages() {
    try {
        const res = await fetch('https://deepak-portfolio-3pkq.onrender.com/api/messages');
        const data = await res.json();
        const listContainer = document.getElementById('admin-messages-list');
        listContainer.innerHTML = '';

        if (data.success && data.messages.length > 0) {
            data.messages.forEach(msg => {
                listContainer.innerHTML += `
                    <div class="bg-[#111827] border border-gray-800 p-4 rounded-xl">
                        <div class="flex justify-between items-center mb-1">
                            <h4 class="font-bold text-sm">${msg.name} <span class="text-xs text-gray-400 font-normal">(${msg.email})</span></h4>
                            <button onclick="deleteMessage('${msg._id}')" class="text-red-400 text-xs hover:underline">Delete</button>
                        </div>
                        <p class="text-xs text-gray-300 mt-2">${msg.message}</p>
                    </div>
                `;
            });
        } else {
            listContainer.innerHTML = '<p class="text-xs text-gray-400">No messages found.</p>';
        }
    } catch (err) {
        console.error(err);
    }
}

// Delete Message Handler
async function deleteMessage(id) {
    try {
        const res = await fetch(`https://deepak-portfolio-3pkq.onrender.com/api/messages/${id}`, { method: 'DELETE' });
        const data = await res.json();
        alert(data.message);
        loadAdminMessages();
        loadDashboardData();
    } catch (err) {
        console.error(err);
    }
}

// Admin Logout
function logoutAdmin() {
    localStorage.removeItem('adminEmail');
    window.location.href = 'login.html';
}
