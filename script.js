document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);


        initParticles();
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // --- Smooth Scroll for Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active');
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate Skill Bars
                if (entry.target.classList.contains('skill-bar')) {
                    const progress = entry.target.querySelector('.progress');
                    progress.style.width = progress.getAttribute('data-width');
                }

                // Generic fade-in for sections if added later
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);



    // --- Advanced Interactive Particles ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = {
        x: null,
        y: null,
        radius: (canvas.height / 80) * (canvas.width / 80)
    }

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mouse.radius = (canvas.height / 80) * (canvas.width / 80);
        initParticles();
    });

    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Boundary checks
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 10;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 10;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 10;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 10;
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        const theme = document.documentElement.getAttribute('data-theme');
        const particleColor = theme === 'dark' ? '#00f3ff' : '#008cff';

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1; // Slightly larger
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 2) - 1; // Faster speed
            let directionY = (Math.random() * 2) - 1;

            particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    function connectParticles() {
        let opacityValue = 1;
        const theme = document.documentElement.getAttribute('data-theme');

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    // Use neon colors based on theme
                    const strokeColor = theme === 'dark' ? `rgba(0, 243, 255, ${opacityValue})` : `rgba(0, 140, 255, ${opacityValue})`;

                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    initParticles();
    animateParticles();


    // --- Project Modal Logic ---
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');
    const viewButtons = document.querySelectorAll('.btn-view');

    // Data for projects
    const projectData = {
        'sparkle': {
            title: 'Sparkle - Smart Cleaning Services Management System',
            description: `
                <p><strong>Sparkle</strong> is a modern C# Windows Forms application designed to streamline the management of cleaning services for cars and carpets.</p>
                <p>It features a robust file-based storage system and a responsive UI built with Guna2.</p>
                <br>
                <strong>🚀 Key Features:</strong>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li><strong>Client Management:</strong> Add, view, edit, and delete clients with real-time validation.</li>
                    <li><strong>Order System:</strong> Dedicated modules for Carpet Cleaning (Normal/Deep wash) and Car Wash (Full/Custom service).</li>
                    <li><strong>Smart Pricing:</strong> Auto-calculates costs based on sizes and add-ons (Quick Drying, Delivery).</li>
                    <li><strong>User Permissions:</strong> Admin safeguards and custom access levels for different staff members.</li>
                    <li><strong>Security:</strong> Password encryption (Caesar cipher) and duplicate ID prevention.</li>
                </ul>`,
            stack: ['C#', '.NET Framework', 'Windows Forms', 'File I/O', 'Guna2 UI'],
            link: 'https://github.com/7mee3d/Sparkle',
            video: 'https://www.youtube.com/watch?v=LC2jUTV6pjk&t=205s'
        },
        'mindgrid': {
            title: 'Mind Grid - Modern Tic Tac Toe',
            description: `
                <p><strong>MindGrid</strong> reimaginies the classic Tic Tac Toe with a sleek, diamond-shaped grid and fluid animations.</p>
                <br>
                <strong>🎮 Core Features:</strong>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li><strong>Smart Win Detection:</strong> Instant automatic checking for wins and draws.</li>
                    <li><strong>Visual Feedback:</strong> Smooth transitions and clear player indicators (Pink 🎀 vs Green 🍀).</li>
                    <li><strong>Professional UI:</strong> A modern, balanced color palette distinct from the traditional look.</li>
                </ul>`,
            stack: ['C#', '.NET Framework', 'Windows Forms', 'Guna2 UI'],
            link: 'https://github.com/7mee3d/MindGrid'
        },
        'momentum': {
            title: 'Momentum - To-Do List Application',
            description: `
                <p><strong>Momentum</strong> is an efficient productivity tool designed to master GUI programming principles like separation of concerns and data persistence.</p>
                <br>
                <strong>✨ Highlights:</strong>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li><strong>Task Management:</strong> Add, duplicate-check, delete, and clear tasks easily.</li>
                    <li><strong>Data Persistence:</strong> Saves your list to a file so you never lose track.</li>
                    <li><strong>Smart Alerts:</strong> Intelligent popups warn against emptying already empty lists or duplicate entries.</li>
                    <li><strong>Live Counter:</strong> Real-time tracking of pending vs. completed tasks.</li>
                </ul>`,
            stack: ['C#', '.NET Framework', 'Windows Forms', 'File System'],
            link: 'https://github.com/7mee3d/Momentum'
        },
        'pizzlicious': {
            title: 'Pizzlicious',
            description: `
                <p><strong>PizzLicious</strong> is a desktop application for managing pizza orders, serving as a perfect example of a restaurant management system foundation.</p>
                <br>
                <strong>🍕 Features:</strong>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li><strong>Custom Orders:</strong> Select Sizes (S/M/L), Crust Types, and Toppings.</li>
                    <li><strong>Auto-Calculation:</strong> accurate real-time price updates.</li>
                    <li><strong>Order History:</strong> Saves each order to a timestamped file for record-keeping.</li>
                    <li><strong>User-Friendly:</strong> Intuitive "Main Screen" and "Order Form" workflow.</li>
                </ul>`,
            stack: ['C#', '.NET Framework', 'Windows Forms', 'File System'],
            link: 'https://github.com/7mee3d/Pizzlicious'
        },
        'bankpro': {
            title: 'BankPro - Management System',
            description: `
                <p><strong>BankPro</strong> is a comprehensive banking system simulation focusing on OOP principles and secure file handling.</p>
                <br>
                <strong>🏦 Capabilities:</strong>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li><strong>Core Transactions:</strong> Deposit, Withdraw, Transfer between accounts.</li>
                    <li><strong>Client Board:</strong> Professional management (Add/Update/Find/Delete) of client records.</li>
                    <li><strong>Currency Exchange:</strong> Real-time currency conversion rates and calculations.</li>
                    <li><strong>User Logs:</strong> Tracks login history and user activity permissions.</li>
                </ul>`,
            stack: ['C++', 'OOP', 'Console', 'File I/O'],
            link: 'https://github.com/7mee3d/BankPro'
        },
        'smartmarket': {
            title: 'SmartMarket',
            description: `
                <p><strong>SmartMarket</strong> simulates a supermarket environment, perfect for understanding inventory management and transactional flow.</p>
                <br>
                <strong>🛒 Key Functions:</strong>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li><strong>Shopping Cart:</strong> Users can browse, add products, and view receipts.</li>
                    <li><strong>Manager Dashboard:</strong> Secure admin area to add/edit/delete product inventory.</li>
                    <li><strong>Invoicing:</strong> Generates and saves detailed purchase receipts.</li>
                    <li><strong>Auto-Save:</strong> Ensures product data availability across sessions.</li>
                </ul>`,
            stack: ['C++', 'OOP', 'Console', 'File I/O'],
            link: 'https://github.com/7mee3d/SmartMarket'
        },
        'minicalculator': {
            title: 'MiniCalculator',
            description: `
                <p>A sophisticated console calculator that goes far beyond basic arithmetic, offering a structured menu for advanced operations.</p>
                <br>
                <strong>➕ Operations:</strong>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li><strong>Extensive Math:</strong> Supports over 30 operations including Powers, Roots, Logarithms, and Trigonometry.</li>
                    <li><strong>Smart Menus:</strong> Navigable interface with clear formatting.</li>
                    <li><strong>Reusability:</strong> Built using modular user-defined functions for cleaner code.</li>
                </ul>`,
            stack: ['C++', 'POP', 'Console', 'Math'],
            link: 'https://github.com/7mee3d/MiniCalculator'
        },
        'datetoolkit': {
            title: 'DateToolkit (LibDate)',
            description: `
                <p><strong>LibDate</strong> is a powerful header-only C++ library designed to solve complex calendar and date logic without external dependencies.</p>
                <br>
                <strong>📅 Toolkit:</strong>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li><strong>Date Math:</strong> Add/Subtract Days, Weeks, Months, Years with leap year support.</li>
                    <li><strong>Comparisons:</strong> Check Date overlaps, Compare two dates, Calculate difference.</li>
                    <li><strong>Utilities:</strong> Print Monthly/Yearly Calendars, Validate Dates, Format Strings.</li>
                    <li><strong>Business Logic:</strong> Calculate Vacation days, or end-of-period benchmarks.</li>
                </ul>`,
            stack: ['C++', 'Library', 'POP', 'Date Time', 'Console'],
            link: 'https://github.com/7mee3d/DateToolkit'
        },
        'stringutils': {
            title: 'StringUtils (clsString)',
            description: `
                <p><strong>clsString</strong> is a specialized utility library providing a suite of string manipulation tools often missing from the standard library.</p>
                <br>
                <strong>🔧 Utilities:</strong>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li><strong>Manipulation:</strong> Trim (Left/Right/Both), Reverse Words, Replace Words.</li>
                    <li><strong>Analysis:</strong> Count Words/Letters/Vowels.</li>
                    <li><strong>Transformation:</strong> Join/Split Strings, Upper/Lower Case conversion.</li>
                    <li><strong>Cleaning:</strong> Remove punctuations automatically.</li>
                </ul>`,
            stack: ['C++', 'Library', 'POP', 'String', 'Console'],
            link: 'https://github.com/7mee3d/StringUtils'
        },
        'inputvalidator': {
            title: 'InputValidator',
            description: `
                <p><strong>InputValidator</strong> acts as a safety shield for console applications, ensuring data integrity and preventing crashes from bad user input.</p>
                <br>
                <strong>🛡️ Safeguards:</strong>
                <ul style="list-style-type: disc; margin-left: 20px;">
                    <li><strong>Type Safety:</strong> Safely reads Integers, Doubles, and Dates.</li>
                    <li><strong>Range Checking:</strong> Enforces input boundaries (e.g., Age 18-99).</li>
                    <li><strong>Context Aware:</strong> Custom prompts and error warnings.</li>
                    <li><strong>Utilities:</strong> specialized 'Yes/No' input handler.</li>
                </ul>`,
            stack: ['C++', 'Library', 'POP', 'Validation', 'Console'],
            link: 'https://github.com/7mee3d/InputValidator'
        }
    };

    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            const data = projectData[projectId];

            if (data) {
                // Conditional Rendering for Video Button
                const videoBtn = data.video ?
                    `<a href="${data.video}" target="_blank" class="btn btn-outline" style="margin-left: 10px;">Watch Video</a>`
                    : '';

                modalBody.innerHTML = `
                    <h2>${data.title}</h2>
                    <div style="margin-bottom: 1rem; color: var(--text-color); opacity: 0.9; line-height: 1.6;">
                        ${data.description}
                    </div>
                    <div class="tech-tags" style="margin-bottom: 1rem;">
                        ${data.stack.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <div class="modal-actions">
                        <a href="${data.link}" target="_blank" class="btn btn-primary">View Code On GitHub</a>
                        ${videoBtn}
                    </div>
                `;
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically handle form submission via fetch or EmailJS
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;

        btn.innerText = 'Sending...';
        btn.style.opacity = '0.7';

        setTimeout(() => {
            btn.innerText = 'Message Sent!';
            btn.style.backgroundColor = 'var(--secondary-color)';
            contactForm.reset();

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
                btn.style.opacity = '1';
            }, 3000);
        }, 1500);
    });

    // --- Dynamic Project Filtering ---
    const langBtns = document.querySelectorAll('#lang-filters .filter-btn');
    const typeBtns = document.querySelectorAll('#type-filters .filter-btn');
    const allProjectCards = document.querySelectorAll('.project-card');

    let activeLang = 'all';
    let activeType = 'all';

    function filterProjects() {
        allProjectCards.forEach(card => {
            const cardLang = card.getAttribute('data-lang');
            const cardType = card.getAttribute('data-type');

            // Check Language Match
            // Note: We use includes() to handle potential multi-value data attributes if expanded later
            // though strict equality works for now except for combined strings logic logic if needed.
            // For now, straight string check is safer or includes if we assume space-separated.
            // Let's assume space separated for future proofing.

            const langMatch = (activeLang === 'all') || (cardLang && cardLang.split(' ').includes(activeLang));
            const typeMatch = (activeType === 'all') || (cardType && cardType.split(' ').includes(activeType));

            if (langMatch && typeMatch) {
                card.classList.remove('hidden');
                // Optional: Reset animation
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                card.style.animation = 'fadeInUp 0.5s ease-out forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    }

    function setupFilterGroup(buttons, category) {
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all in this group
                buttons.forEach(b => b.classList.remove('active'));
                // Add to clicked
                btn.classList.add('active');

                // Update State
                const value = btn.getAttribute('data-filter');
                if (category === 'lang') {
                    activeLang = value;
                } else {
                    activeType = value;
                }

                // Filter
                filterProjects();
            });
        });
    }

    setupFilterGroup(langBtns, 'lang');
    setupFilterGroup(typeBtns, 'type');

});
