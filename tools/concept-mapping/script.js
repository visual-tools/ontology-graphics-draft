
// Advanced Data Model: Community Farm Ecosystem
const data = {
    nodes: [
        // Core Hubs
        { id: "Community Farm", role: "Hub", health: 1.0, capacity: 100, group: 1 },

        // Resources (Inputs)
        { id: "Funding Stream", role: "Resource", health: 0.8, capacity: 60, group: 2 },
        { id: "Gov Grants", role: "Resource", health: 0.6, capacity: 40, group: 2 },
        { id: "Private Donations", role: "Resource", health: 0.9, capacity: 30, group: 2 },
        { id: "Produce Revenue", role: "Resource", health: 0.7, capacity: 50, group: 2 },

        // Stakeholders (People)
        { id: "Core Team", role: "Stakeholder", health: 0.9, capacity: 40, group: 3 },
        { id: "Local Farmers", role: "Stakeholder", health: 0.85, capacity: 30, group: 3 },
        { id: "Volunteers", role: "Stakeholder", health: 0.95, capacity: 80, group: 3 },
        { id: "Local Residents", role: "Stakeholder", health: 0.7, capacity: 90, group: 3 },

        // Operations (Processes)
        { id: "Regenerative Ops", role: "Operation", health: 0.9, capacity: 70, group: 4 },
        { id: "Permaculture Planting", role: "Operation", health: 0.95, capacity: 50, group: 4 },
        { id: "Ethical Harvest", role: "Operation", health: 0.8, capacity: 50, group: 4 },
        { id: "Zero-Waste Dist", role: "Operation", health: 0.75, capacity: 40, group: 4 },

        // Impact (Outcomes)
        { id: "Holistic Impact", role: "Outcome", health: 1.0, capacity: 85, group: 5 },
        { id: "Eco Sustainability", role: "Outcome", health: 0.85, capacity: 60, group: 5 },
        { id: "Food Security", role: "Outcome", health: 0.9, capacity: 70, group: 5 },
        { id: "Social Cohesion", role: "Outcome", health: 0.95, capacity: 75, group: 5 }
    ],
    links: [
        // Financial Flows (Dashed, Green-ish)
        { source: "Funding Stream", target: "Community Farm", type: "Financial", strength: 0.8 },
        { source: "Gov Grants", target: "Funding Stream", type: "Financial", strength: 0.5 },
        { source: "Private Donations", target: "Funding Stream", type: "Financial", strength: 0.4 },
        { source: "Produce Revenue", target: "Funding Stream", type: "Financial", strength: 0.6 },

        // Social Contracts (Solid, Warm)
        { source: "Core Team", target: "Community Farm", type: "Social", strength: 0.9 },
        { source: "Local Farmers", target: "Core Team", type: "Social", strength: 0.7 },
        { source: "Volunteers", target: "Core Team", type: "Social", strength: 0.8 },
        { source: "Local Residents", target: "Community Farm", type: "Social", strength: 0.6 },

        // Operational Flows (Solid, Tech/Blue)
        { source: "Regenerative Ops", target: "Community Farm", type: "Operational", strength: 0.9 },
        { source: "Permaculture Planting", target: "Regenerative Ops", type: "Operational", strength: 0.7 },
        { source: "Ethical Harvest", target: "Regenerative Ops", type: "Operational", strength: 0.7 },
        { source: "Zero-Waste Dist", target: "Regenerative Ops", type: "Operational", strength: 0.6 },

        // Impact Causality (Arrows/Flow, Purple/Gold)
        { source: "Holistic Impact", target: "Community Farm", type: "Impact", strength: 1.0 },
        { source: "Eco Sustainability", target: "Holistic Impact", type: "Impact", strength: 0.8 },
        { source: "Food Security", target: "Holistic Impact", type: "Impact", strength: 0.8 },
        { source: "Social Cohesion", target: "Holistic Impact", type: "Impact", strength: 0.8 },

        // Cross-System Synergies
        { source: "Volunteers", target: "Permaculture Planting", type: "Synergy", strength: 0.5 },
        { source: "Local Farmers", target: "Ethical Harvest", type: "Synergy", strength: 0.6 },
        { source: "Zero-Waste Dist", target: "Local Residents", type: "Synergy", strength: 0.7 },
        { source: "Produce Revenue", target: "Zero-Waste Dist", type: "Financial", strength: 0.4 }
    ]
};

const width = window.innerWidth;
const height = window.innerHeight;

// Create SVG container
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("max-width", "100%")
    .style("height", "auto")
    .style("background", "radial-gradient(circle at center, #1a1a2e 0%, #050510 100%)");

// Define Gradients & Markers
const defs = svg.append("defs");

// Color Scales based on Group
const colorScale = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5])
    .range(["#ffffff", "#00f2ff", "#ff6b6b", "#ffd93d", "#a8ff78"]);

// Force Simulation
const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(d => 150 - (d.strength * 50)))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(d => (d.capacity / 2) + 20));

// Link Styles
const getLinkColor = (type) => {
    switch (type) {
        case "Financial": return "#00f2ff";
        case "Social": return "#ff6b6b";
        case "Operational": return "#ffd93d";
        case "Impact": return "#a8ff78";
        default: return "#999";
    }
};

const getLinkDash = (type) => {
    switch (type) {
        case "Financial": return "5,5"; // Dashed for money flow
        case "Synergy": return "2,2"; // Fine dash for subtle links
        default: return "0"; // Solid for structural
    }
};

// Render Links
const link = svg.append("g")
    .selectAll("line")
    .data(data.links)
    .join("line")
    .attr("stroke", d => getLinkColor(d.type))
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", d => d.strength * 3)
    .attr("stroke-dasharray", d => getLinkDash(d.type));

// Render Nodes
const node = svg.append("g")
    .selectAll("g")
    .data(data.nodes)
    .join("g")
    .call(drag(simulation));

// Node Halo (Health Pulse)
node.append("circle")
    .attr("r", d => (d.capacity / 2.5) + 5)
    .attr("fill", d => colorScale(d.group))
    .attr("opacity", 0.2)
    .attr("class", "pulse");

// Core Node Circle
node.append("circle")
    .attr("r", d => d.capacity / 2.5)
    .attr("fill", "#050510")
    .attr("stroke", d => colorScale(d.group))
    .attr("stroke-width", 2);

// Inner Health Indicator
node.append("circle")
    .attr("r", d => (d.capacity / 2.5) * d.health)
    .attr("fill", d => colorScale(d.group))
    .attr("opacity", 0.7);

// Labels
node.append("text")
    .attr("dy", d => (d.capacity / 2.5) + 15)
    .attr("text-anchor", "middle")
    .text(d => d.id)
    .style("fill", "#fff")
    .style("font-family", "'Space Grotesk', sans-serif")
    .style("font-size", "10px")
    .style("pointer-events", "none")
    .style("text-shadow", "0 2px 4px rgba(0,0,0,0.8)");

// Role Sub-label
node.append("text")
    .attr("dy", d => (d.capacity / 2.5) + 25)
    .attr("text-anchor", "middle")
    .text(d => d.role.toUpperCase())
    .style("fill", "#888")
    .style("font-family", "'Space Grotesk', sans-serif")
    .style("font-size", "8px")
    .style("letter-spacing", "1px")
    .style("pointer-events", "none");

// Animation Loop
simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", d => `translate(${d.x},${d.y})`);
});

// Pulse Animation CSS injection
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse-anim {
        0% { transform: scale(1); opacity: 0.2; }
        50% { transform: scale(1.1); opacity: 0.3; }
        100% { transform: scale(1); opacity: 0.2; }
    }
    .pulse {
        animation: pulse-anim 3s infinite ease-in-out;
        transform-origin: center;
    }
    /* Stagger animations randomly could be done via JS, 
       but here we assume a uniform breath for the organism */
`;
document.head.appendChild(style);

// Drag Behavior
function drag(simulation) {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

// Resize handler
window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    svg.attr("width", w).attr("height", h);
    simulation.force("center", d3.forceCenter(w / 2, h / 2));
    simulation.alpha(0.3).restart();
});
