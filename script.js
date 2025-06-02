document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    const pageTitle = document.getElementById('pageTitle');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const overlay = document.getElementById('overlay');

    // Page Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const targetPageId = this.getAttribute('data-page');
            pageContents.forEach(page => {
                if (page.id === targetPageId + '-page') {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
            pageTitle.textContent = this.querySelector('span').textContent;

            // Close mobile sidebar after navigation if it's open
            if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    });

    function openMobileSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    }

    function closeMobileSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }

    // Menu Toggle (Hamburger in Header)
    menuToggle.addEventListener('click', function () {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 992;

        if (isMobile) {
            if (sidebar.classList.contains('open')) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        } else if (isTablet) {
            sidebar.classList.toggle('expanded');
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('sidebar-expanded');
        } else { // Desktop
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('sidebar-collapsed');
        }
    });

    // Sidebar Close Button (X inside sidebar)
    sidebarCloseBtn.addEventListener('click', function () {
        if (window.innerWidth <= 768) { // Only for mobile overlay
            closeMobileSidebar();
        }
    });

    // Overlay Click to Close Mobile Sidebar
    overlay.addEventListener('click', function () {
        if (window.innerWidth <= 768) { // Only for mobile overlay
            closeMobileSidebar();
        }
    });

    // Tab functionality (e.g., for Onboarding page)
    const pageContentElements = document.querySelectorAll('.page-content');
    pageContentElements.forEach(pageElement => {
        const tabLinks = pageElement.querySelectorAll('.tabs .tab-link');
        const tabContentsInPage = pageElement.querySelectorAll('.tab-content');

        if (tabLinks.length > 0 && tabContentsInPage.length > 0) {
            tabLinks.forEach(tabLink => {
                tabLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Deactivate all tab links within this specific tab set's .tabs container
                    tabLinks.forEach(tl => tl.classList.remove('active'));
                    
                    // Deactivate all tab contents within this specific pageElement
                    tabContentsInPage.forEach(tc => tc.classList.remove('active'));

                    // Activate clicked tab link
                    this.classList.add('active');
                    
                    // ---- THIS WAS THE MISSING PART ----
                    // Activate corresponding tab content
                    const targetTabContentId = this.getAttribute('data-tab');
                    const targetTabContent = document.getElementById(targetTabContentId);
                    if (targetTabContent) {
                        targetTabContent.classList.add('active');
                    } else {
                        console.warn(`Tab content with ID '${targetTabContentId}' not found.`);
                    }
                    // ---- END OF MISSING PART ----
                });
            });
        }
    });

    // Initial sidebar state and resize handling
    function setInitialSidebarState() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 992;

        sidebar.classList.remove('open', 'expanded', 'collapsed');
        mainContent.classList.remove('sidebar-collapsed', 'sidebar-expanded');
        overlay.classList.remove('active');

        if (isMobile) {
            // Mobile: Sidebar starts closed. No 'collapsed' or 'expanded'.
        } else if (isTablet) {
            sidebar.classList.add('collapsed'); 
            mainContent.classList.add('sidebar-collapsed');
        } else { // Desktop
            // Desktop: Sidebar starts full (no 'collapsed' class).
        }
    }

    setInitialSidebarState();
    window.addEventListener('resize', setInitialSidebarState);

    // Simulate active link on load (Dashboard)
    const dashboardLink = document.querySelector('.nav-link[data-page="dashboard"]');
    if (dashboardLink) {
        dashboardLink.click();
    }
});