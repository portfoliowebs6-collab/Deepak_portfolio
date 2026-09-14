document.addEventListener('DOMContentLoaded', () => {
    fetchFrontendProjects();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('c-name').value;
            const email = document.getElementById('c-email').value;
            const message = document.getElementById('c-msg').value;

            try {
                const res = await fetch('https://deepak-portfolio-3pkq.onrender.com/api/messages/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });
                const data = await res.json();
                alert(data.message);
                if (data.success) {
                    contactForm.reset();
                }
            } catch (err) {
                console.error(err);
                alert('Failed to send message.');
            }
        });
    }
});

// Fetch Projects from Backend for Portfolio View
async function fetchFrontendProjects() {
    try {
        const res = await fetch('http://localhost:5000/api/projects');
        const data = await res.json();
        const grid = document.getElementById('frontend-projects-grid');
        grid.innerHTML = '';

        if (data.success && data.projects.length > 0) {
            data.projects.forEach(proj => {
                grid.innerHTML += `
                    <div class="bg-[#111827] border border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
                        <div>
                            <span class="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-full">${proj.category}</span>
                            <h3 class="font-bold text-lg mt-3">${proj.title}</h3>
                            <p class="text-gray-400 text-xs mt-2 leading-relaxed">${proj.description}</p>
                        </div>
                        <div class="mt-6 flex space-x-3">
                            ${proj.liveLink ? `<a href="${proj.liveLink}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-xs px-4 py-2 rounded-xl font-medium">Live Demo</a>` : ''}
                            ${proj.githubLink ? `<a href="${proj.githubLink}" target="_blank" class="border border-gray-700 hover:border-gray-500 text-xs px-4 py-2 rounded-xl font-medium">GitHub</a>` : ''}
                        </div>
                    </div>
                `;
            });
        } else {
            grid.innerHTML = '<p class="text-xs text-gray-400">No projects added yet. Check back soon!</p>';
        }
    } catch (err) {
        console.error('Error loading projects:', err);
    }
}
