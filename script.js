document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Tool Viewer Logic
    const toolFrame = document.getElementById('tool-frame');
    if (toolFrame) {
        const params = new URLSearchParams(window.location.search);
        const toolKey = params.get('tool');

        const tools = {
            'polyscope': 'https://visual-tools.github.io/Polyscope/',
            'overton': 'https://visual-tools.github.io/Overton-window-example/',
            'clusters': 'https://visual-tools.github.io/knowledge-word-clusters/',
            'concept': 'tools/concept-mapping/index.html',
            'structure': 'tools/system-architecture/index.html',
            'flow': 'tools/flow-dynamics/index.html',
            'spirit': 'tools/spirit/index.html',
            'gapminder': 'https://www.gapminder.org/tools/'
        };

        if (toolKey && tools[toolKey]) {
            // Defer loading to allow UI to paint first
            setTimeout(() => {
                toolFrame.src = tools[toolKey];
            }, 100);
            document.title = `${toolKey.charAt(0).toUpperCase() + toolKey.slice(1)} | ontology.graphics`;
        } else {
            // Default or error state
            toolFrame.src = 'about:blank';
            document.body.innerHTML += '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">Tool not found.</div>';
        }
    }

    // --- Search & Filter Logic ---
    const searchInput = document.getElementById('tool-search');
    const typeFilter = document.getElementById('filter-type');
    const topicFilter = document.getElementById('filter-topic');
    const toolCards = document.querySelectorAll('.tool-card');

    function filterTools() {
        const query = searchInput.value.toLowerCase();
        const type = typeFilter.value.toLowerCase();
        const topic = topicFilter.value.toLowerCase();

        toolCards.forEach(card => {
            const cardText = card.innerText.toLowerCase();
            const cardType = card.dataset.visType || '';
            const cardTopic = card.dataset.topic || '';

            const matchesSearch = cardText.includes(query);
            const matchesType = type === '' || cardType === type;
            const matchesTopic = topic === '' || cardTopic === topic;

            if (matchesSearch && matchesType && matchesTopic) {
                card.style.display = 'flex';
                // Add a small animation for reappearance
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput && typeFilter && topicFilter) {
        searchInput.addEventListener('input', filterTools);
        typeFilter.addEventListener('change', filterTools);
        topicFilter.addEventListener('change', filterTools);
    } // End Search Logic

    console.log('ontology.graphics initialized');
});

// Add fade in animation style dynamically
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
