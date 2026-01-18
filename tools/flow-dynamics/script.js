
// Seasonal Data Models
const seasons = ["SPRING", "SUMMER", "AUTUMN", "WINTER"];

const seasonalData = [
    // SPRING: High Input (Seeds, Planting), Low Output
    {
        nodes: [
            { name: "Water Supply" }, { name: "Seed Funding" }, { name: "Volunteer Hours" }, { name: "Land Usage" },
            { name: "Farming Operations" }, { name: "Education Programs" }, { name: "Maintenance" },
            { name: "Vegetable Box Scheme" }, { name: "Community Market" }, { name: "Compost/Waste" },
            { name: "Revenue" }, { name: "Social Impact" }, { name: "Soil Health" }
        ],
        links: [
            { source: 0, target: 4, value: 30 }, // Water -> Farming
            { source: 1, target: 4, value: 50 }, // Funding -> Farming (High for seeds)
            { source: 1, target: 5, value: 10 },
            { source: 1, target: 6, value: 5 },
            { source: 2, target: 4, value: 40 }, // Volunteers -> Farming (Planting)
            { source: 2, target: 5, value: 10 },
            { source: 2, target: 6, value: 10 },
            { source: 3, target: 4, value: 50 },
            // Outputs (Low in Spring)
            { source: 4, target: 7, value: 10 },
            { source: 4, target: 8, value: 5 },
            { source: 4, target: 9, value: 10 },
            { source: 5, target: 11, value: 20 },
            { source: 6, target: 12, value: 15 },
            // Impact
            { source: 7, target: 10, value: 5 },
            { source: 7, target: 11, value: 5 },
            { source: 8, target: 10, value: 5 },
            { source: 8, target: 11, value: 2 },
            { source: 9, target: 12, value: 10 }
        ]
    },
    // SUMMER: Balanced Input/Output, High Maintenance
    {
        nodes: [
            { name: "Water Supply" }, { name: "Seed Funding" }, { name: "Volunteer Hours" }, { name: "Land Usage" },
            { name: "Farming Operations" }, { name: "Education Programs" }, { name: "Maintenance" },
            { name: "Vegetable Box Scheme" }, { name: "Community Market" }, { name: "Compost/Waste" },
            { name: "Revenue" }, { name: "Social Impact" }, { name: "Soil Health" }
        ],
        links: [
            { source: 0, target: 4, value: 60 }, // High Water
            { source: 1, target: 4, value: 20 },
            { source: 1, target: 5, value: 20 },
            { source: 1, target: 6, value: 20 },
            { source: 2, target: 4, value: 40 },
            { source: 2, target: 5, value: 30 }, // Summer Schools
            { source: 2, target: 6, value: 20 },
            { source: 3, target: 4, value: 50 },
            // Outputs (Growing)
            { source: 4, target: 7, value: 40 },
            { source: 4, target: 8, value: 30 },
            { source: 4, target: 9, value: 20 },
            { source: 5, target: 11, value: 40 },
            { source: 6, target: 12, value: 15 },
            // Impact
            { source: 7, target: 10, value: 30 },
            { source: 7, target: 11, value: 15 },
            { source: 8, target: 10, value: 20 },
            { source: 8, target: 11, value: 10 },
            { source: 9, target: 12, value: 20 }
        ]
    },
    // AUTUMN: High Output (Harvest), Low Input
    {
        nodes: [
            { name: "Water Supply" }, { name: "Seed Funding" }, { name: "Volunteer Hours" }, { name: "Land Usage" },
            { name: "Farming Operations" }, { name: "Education Programs" }, { name: "Maintenance" },
            { name: "Vegetable Box Scheme" }, { name: "Community Market" }, { name: "Compost/Waste" },
            { name: "Revenue" }, { name: "Social Impact" }, { name: "Soil Health" }
        ],
        links: [
            { source: 0, target: 4, value: 20 },
            { source: 1, target: 4, value: 10 },
            { source: 1, target: 5, value: 15 },
            { source: 1, target: 6, value: 10 },
            { source: 2, target: 4, value: 60 }, // Harvest Help
            { source: 2, target: 5, value: 20 },
            { source: 2, target: 6, value: 10 },
            { source: 3, target: 4, value: 50 },
            // High Outputs
            { source: 4, target: 7, value: 80 },
            { source: 4, target: 8, value: 50 },
            { source: 4, target: 9, value: 40 },
            { source: 5, target: 11, value: 30 },
            { source: 6, target: 12, value: 15 },
            // Impact
            { source: 7, target: 10, value: 60 },
            { source: 7, target: 11, value: 30 },
            { source: 8, target: 10, value: 40 },
            { source: 8, target: 11, value: 20 },
            { source: 9, target: 12, value: 40 }
        ]
    },
    // WINTER: Low Ops, Planning, Maintenance
    {
        nodes: [
            { name: "Water Supply" }, { name: "Seed Funding" }, { name: "Volunteer Hours" }, { name: "Land Usage" },
            { name: "Farming Operations" }, { name: "Education Programs" }, { name: "Maintenance" },
            { name: "Vegetable Box Scheme" }, { name: "Community Market" }, { name: "Compost/Waste" },
            { name: "Revenue" }, { name: "Social Impact" }, { name: "Soil Health" }
        ],
        links: [
            { source: 0, target: 4, value: 10 },
            { source: 1, target: 4, value: 10 },
            { source: 1, target: 5, value: 30 }, // Planning/Courses
            { source: 1, target: 6, value: 30 }, // Repairs
            { source: 2, target: 4, value: 10 },
            { source: 2, target: 5, value: 20 },
            { source: 2, target: 6, value: 30 }, // Maintenance work
            { source: 3, target: 4, value: 50 },
            // Low Production
            { source: 4, target: 7, value: 15 },
            { source: 4, target: 8, value: 10 },
            { source: 4, target: 9, value: 10 },
            { source: 5, target: 11, value: 40 }, // Education Impact
            { source: 6, target: 12, value: 30 }, // Investing in soil
            // Impact
            { source: 7, target: 10, value: 10 },
            { source: 7, target: 11, value: 5 },
            { source: 8, target: 10, value: 5 },
            { source: 8, target: 11, value: 5 },
            { source: 9, target: 12, value: 10 }
        ]
    }
];

const width = window.innerWidth * 0.9;
const height = window.innerHeight * 0.8;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

const sankey = d3.sankey()
    .nodeWidth(20)
    .nodePadding(20)
    .extent([[1, 5], [width - 1, height - 5]]);

const color = d3.scaleOrdinal(d3.schemeCategory10);

function renderChart(seasonIndex) {
    // Clear previous
    svg.selectAll("*").remove();

    const data = seasonalData[seasonIndex];
    // Deep copy to prevent d3 mutation issues on re-render
    const graph = {
        nodes: data.nodes.map(d => ({ ...d })),
        links: data.links.map(d => ({ ...d }))
    };

    const { nodes, links } = sankey(graph);

    // Links
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.3)
        .selectAll("g")
        .data(links)
        .join("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", d => {
            const gradientId = `gradient-${d.source.index}-${d.target.index}-${seasonIndex}`;
            const gradient = svg.append("defs")
                .append("linearGradient")
                .attr("id", gradientId)
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", d.source.x1)
                .attr("x2", d.target.x0);
            gradient.append("stop").attr("offset", "0%").attr("stop-color", color(d.source.name));
            gradient.append("stop").attr("offset", "100%").attr("stop-color", color(d.target.name));
            return `url(#${gradientId})`;
        })
        .attr("stroke-width", d => Math.max(1, d.width))
        .style("mix-blend-mode", "screen")
        .style("transition", "all 0.5s ease")
        .on("mouseover", function () { d3.select(this).attr("stroke-opacity", 0.7); })
        .on("mouseout", function () { d3.select(this).attr("stroke-opacity", 0.3); })
        .append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

    // Nodes
    svg.append("g")
        .selectAll("rect")
        .data(nodes)
        .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => color(d.name))
        .attr("rx", 3)
        .append("title")
        .text(d => `${d.name}\nTotal: ${d.value}`);

    // Labels
    svg.append("g")
        .style("font", "14px 'Outfit', sans-serif")
        .style("fill", "#fff")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name)
        .style("text-shadow", "0 1px 3px rgba(0,0,0,0.8)");
}

// Initial Render
renderChart(0);

// Slider Interaction
const slider = document.getElementById('seasonSlider');
const label = document.getElementById('seasonLabel');

slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    label.innerText = seasons[val];
    renderChart(val);
});

// Resize handling (Simple reload as Sankey is complex to resize dynamically without glitches)
window.addEventListener('resize', () => {
    location.reload();
});
