document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    const pageTitle = document.getElementById('pageTitle');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const overlay = document.getElementById('overlay');

    const userEditModal = document.getElementById('userEditModal');
    const closeUserEditModalBtn = document.getElementById('closeUserEditModal');
    const cancelUserEditBtn = document.getElementById('cancelUserEdit');
    const saveUserChangesBtn = document.getElementById('saveUserChanges');

    const selectAllUsersBtn = document.getElementById('selectAllUsersBtn');
    const deselectAllUsersBtn = document.getElementById('deselectAllUsersBtn');
    const masterUserCheckbox = document.getElementById('masterUserCheckbox');
    const usersTableBody = document.getElementById('usersTableBody');

    const dummyUsers = {
        "1": { id: "1", fullName: "Nandini Gupta", email: "nandini.g@example.com", userType: "Manager", gender: "Female", ageGroup: "26-35", jobTitle: "Operations Manager", sessionsCompleted: 15, sessionsTotal: 20 },
        "2": { id: "2", fullName: "Ritik Sharma", email: "ritik.s@example.com", userType: "Admin", gender: "Male", ageGroup: "26-35", jobTitle: "System Administrator", sessionsCompleted: 18, sessionsTotal: 25 },
        "3": { id: "3", fullName: "Shubhanshu Verma", email: "shubhanshu.v@example.com", userType: "User", gender: "Male", ageGroup: "18-25", jobTitle: "Junior Analyst", sessionsCompleted: 5, sessionsTotal: 10 },
        "4": { id: "4", fullName: "Suraj Patel", email: "suraj.p@example.com", userType: "User", gender: "Male", ageGroup: "36-45", jobTitle: "Sales Executive", sessionsCompleted: 12, sessionsTotal: 15 },
    };

    const userDesignationEl = document.getElementById('userDesignation');
    if (userDesignationEl) {
        const currentUserRole = "Admin";
        userDesignationEl.textContent = currentUserRole;
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const targetPageId = this.getAttribute('data-page');
            pageContents.forEach(page => {
                page.classList.toggle('active', page.id === targetPageId + '-page');
            });
            pageTitle.textContent = this.querySelector('span').textContent;
            if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                closeMobileSidebar();
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

    menuToggle.addEventListener('click', function () {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 992;
        if (isMobile) { sidebar.classList.contains('open') ? closeMobileSidebar() : openMobileSidebar(); }
        else if (isTablet) { sidebar.classList.toggle('expanded'); sidebar.classList.toggle('collapsed'); mainContent.classList.toggle('sidebar-expanded'); }
        else { sidebar.classList.toggle('collapsed'); mainContent.classList.toggle('sidebar-collapsed'); }
    });

    sidebarCloseBtn.addEventListener('click', () => { if (window.innerWidth <= 768) closeMobileSidebar(); });
    overlay.addEventListener('click', () => { if (window.innerWidth <= 768) closeMobileSidebar(); });

    document.querySelectorAll('.page-content').forEach(pageElement => {
        const tabLinks = pageElement.querySelectorAll('.tabs .tab-link');
        const tabContentsInPage = pageElement.querySelectorAll('.tab-content');
        if (tabLinks.length > 0 && tabContentsInPage.length > 0) {
            tabLinks.forEach(tabLink => {
                tabLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    tabLinks.forEach(tl => tl.classList.remove('active'));
                    tabContentsInPage.forEach(tc => tc.classList.remove('active'));
                    this.classList.add('active');
                    const targetTabContentId = this.getAttribute('data-tab');
                    const targetTabContent = document.getElementById(targetTabContentId);
                    if (targetTabContent) targetTabContent.classList.add('active');
                });
            });
        }
    });

    function openUserEditModal(userId) {
        const userData = dummyUsers[userId];
        if (!userData) {
            console.error("User data not found for ID:", userId);
            return;
        }
        document.getElementById('editUserId').value = userData.id;
        document.getElementById('editUserFullName').value = userData.fullName;
        document.getElementById('editUserEmail').value = userData.email;
        document.getElementById('editUserType').value = userData.userType;
        document.getElementById('editUserGender').value = userData.gender;
        document.getElementById('editUserAgeGroup').value = userData.ageGroup;
        document.getElementById('editUserJobTitle').value = userData.jobTitle;

        const progressPercent = Math.round((userData.sessionsCompleted / userData.sessionsTotal) * 100);
        const progressBar = document.getElementById('overallSessionProgress');
        progressBar.style.width = progressPercent + '%';
        progressBar.textContent = progressPercent + '%';
        
        userEditModal.style.display = "block";
    }

    function closeUserEditModal() {
        userEditModal.style.display = "none";
    }

    if (usersTableBody) {
        usersTableBody.addEventListener('click', function(event) {
            const editButton = event.target.closest('.btn-edit-user');
            if (editButton) {
                const userId = editButton.dataset.userid;
                openUserEditModal(userId);
            }
        });
    }

    if (closeUserEditModalBtn) closeUserEditModalBtn.onclick = closeUserEditModal;
    if (cancelUserEditBtn) cancelUserEditBtn.onclick = closeUserEditModal;

    if (saveUserChangesBtn) {
        saveUserChangesBtn.addEventListener('click', function() {
            const userId = document.getElementById('editUserId').value;
            const updatedUserData = {
                userType: document.getElementById('editUserType').value,
                gender: document.getElementById('editUserGender').value,
                ageGroup: document.getElementById('editUserAgeGroup').value,
                jobTitle: document.getElementById('editUserJobTitle').value,
            };
            console.log("Saving changes for user ID:", userId, updatedUserData);
            if(dummyUsers[userId]) {
                dummyUsers[userId] = { ...dummyUsers[userId], ...updatedUserData };
            }
            closeUserEditModal();
        });
    }

    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && userEditModal.style.display === 'block') {
            closeUserEditModal();
        }
    });

    function getAllUserCheckboxes() {
        return document.querySelectorAll('#usersTableBody .user-select-checkbox');
    }

    if (selectAllUsersBtn) {
        selectAllUsersBtn.addEventListener('click', function() {
            getAllUserCheckboxes().forEach(checkbox => checkbox.checked = true);
            if(masterUserCheckbox) masterUserCheckbox.checked = true;
        });
    }

    if (deselectAllUsersBtn) {
        deselectAllUsersBtn.addEventListener('click', function() {
            getAllUserCheckboxes().forEach(checkbox => checkbox.checked = false);
            if(masterUserCheckbox) masterUserCheckbox.checked = false;
        });
    }
    
    if (masterUserCheckbox) {
        masterUserCheckbox.addEventListener('change', function() {
            getAllUserCheckboxes().forEach(checkbox => checkbox.checked = this.checked);
        });
    }

    if (usersTableBody) {
        usersTableBody.addEventListener('change', function(event){
            if (event.target.classList.contains('user-select-checkbox')) {
                if (!masterUserCheckbox) return;
                const allCheckboxes = getAllUserCheckboxes();
                const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
                const someChecked = Array.from(allCheckboxes).some(cb => cb.checked);
                masterUserCheckbox.checked = allChecked;
                masterUserCheckbox.indeterminate = !allChecked && someChecked;
            }
        });
    }

    function setInitialSidebarState() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 992;
        sidebar.classList.remove('open', 'expanded', 'collapsed');
        mainContent.classList.remove('sidebar-collapsed', 'sidebar-expanded');
        overlay.classList.remove('active');
        if (isMobile) { }
        else if (isTablet) { sidebar.classList.add('collapsed'); mainContent.classList.add('sidebar-collapsed');}
        else { }
    }
    setInitialSidebarState();
    window.addEventListener('resize', setInitialSidebarState);

    const dashboardLink = document.querySelector('.nav-link[data-page="dashboard"]');
    if (dashboardLink) dashboardLink.click();
});