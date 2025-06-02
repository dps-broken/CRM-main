document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    const pageTitle = document.getElementById('pageTitle');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const mainHeader = document.getElementById('mainHeader');
    const pageWrapper = document.getElementById('pageWrapper');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const overlay = document.getElementById('overlay');

    const editUserPage = document.getElementById('edit-user-page');
    const backToUsersBtn = document.getElementById('backToUsersBtn');
    const saveUserChangesPageBtn = document.getElementById('saveUserChangesPage');
    const cancelUserEditPageBtn = document.getElementById('cancelUserEditPage');
    let previousActivePageId = 'dashboard-page';

    const selectAllUsersBtn = document.getElementById('selectAllUsersBtn');
    const deselectAllUsersBtn = document.getElementById('deselectAllUsersBtn');
    const masterUserCheckbox = document.getElementById('masterUserCheckbox');
    const usersTableBody = document.getElementById('usersTableBody');

    const dummyUsers = {
        "1": { id: "1", fullName: "Nandini Gupta", email: "nandini.g@example.com", userType: "Manager", gender: "Female", ageGroup: "26-35", jobTitle: "Operations Manager", sessionsCompleted: 15, sessionsTotal: 20, phone: "+919876543210" },
        "2": { id: "2", fullName: "Ritik Sharma", email: "ritik.s@example.com", userType: "Admin", gender: "Male", ageGroup: "26-35", jobTitle: "System Administrator", sessionsCompleted: 18, sessionsTotal: 25, phone: "+919123456789" },
    };
    const loggedInUser = dummyUsers["2"]; 

    const userDesignationEl = document.getElementById('userDesignation');
    const userProfileNameHeaderEl = document.getElementById('userProfileNameHeader');
    const userProfileAvatarHeaderEl = document.getElementById('userProfileAvatarHeader');

    if (userDesignationEl) userDesignationEl.textContent = loggedInUser.userType;
    if (userProfileNameHeaderEl) userProfileNameHeaderEl.textContent = loggedInUser.fullName;
    if (userProfileAvatarHeaderEl) userProfileAvatarHeaderEl.src = `https://via.placeholder.com/40/6366f1/FFFFFF?text=${loggedInUser.fullName.substring(0,1)}${loggedInUser.fullName.split(" ")[1] ? loggedInUser.fullName.split(" ")[1].substring(0,1) : '' }`;
    

    function showPage(pageIdToShow) {
        pageContents.forEach(page => {
            page.classList.remove('active');
        });

        const targetPage = document.getElementById(pageIdToShow);
        if (targetPage) {
            targetPage.classList.add('active');
            if (pageIdToShow === 'edit-user-page') {
                mainHeader.style.display = 'none';
                pageWrapper.style.display = 'none';
                if (sidebar.classList.contains('open')) closeMobileSidebar(); // Close mobile sidebar if open
            } else {
                mainHeader.style.display = 'flex';
                pageWrapper.style.display = 'block';
                previousActivePageId = pageIdToShow;
                const activeNavLink = document.querySelector(`.nav-link[data-page="${pageIdToShow.replace('-page', '')}"]`);
                if (activeNavLink) {
                    pageTitle.textContent = activeNavLink.querySelector('span').textContent;
                     navLinks.forEach(l => l.classList.remove('active'));
                     activeNavLink.classList.add('active');
                }
            }
        }
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetPageId = this.getAttribute('data-page') + '-page';
            showPage(targetPageId);
            if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                closeMobileSidebar();
            }
        });
    });

    function openMobileSidebar() { sidebar.classList.add('open'); overlay.classList.add('active'); }
    function closeMobileSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }

    menuToggle.addEventListener('click', function () {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 992;
        if (isMobile) { sidebar.classList.contains('open') ? closeMobileSidebar() : openMobileSidebar(); }
        else if (isTablet) { sidebar.classList.toggle('expanded'); sidebar.classList.toggle('collapsed'); mainContent.classList.toggle('sidebar-expanded'); }
        else { sidebar.classList.toggle('collapsed'); mainContent.classList.toggle('sidebar-collapsed'); }
    });

    if(sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', () => { if (window.innerWidth <= 768) closeMobileSidebar(); });
    if(overlay) overlay.addEventListener('click', () => { if (window.innerWidth <= 768) closeMobileSidebar(); });

    document.querySelectorAll('.page-content').forEach(pageElement => {
        if(pageElement.id === 'edit-user-page') return; 
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

    function openEditUserPage(userId) {
        const userData = dummyUsers[userId];
        if (!userData) return;

        document.getElementById('editUserIdPage').value = userData.id;
        document.getElementById('editUserFullNamePage').value = userData.fullName;
        document.getElementById('editUserEmailPage').value = userData.email;
        document.getElementById('editUserTypePage').value = userData.userType;
        document.getElementById('editUserGenderPage').value = userData.gender;
        document.getElementById('editUserAgeGroupPage').value = userData.ageGroup;
        document.getElementById('editUserJobTitlePage').value = userData.jobTitle;
        
        const progressPercent = Math.round((userData.sessionsCompleted / userData.sessionsTotal) * 100);
        const progressBar = document.getElementById('overallSessionProgressPage');
        progressBar.style.width = progressPercent + '%';
        progressBar.textContent = progressPercent + '%';
        
        showPage('edit-user-page');
    }

    if (usersTableBody) {
        usersTableBody.addEventListener('click', function(event) {
            const editButton = event.target.closest('.btn-edit-user');
            if (editButton) {
                const userId = editButton.dataset.userid;
                openEditUserPage(userId);
            }
        });
    }

    if(backToUsersBtn) {
        backToUsersBtn.addEventListener('click', function() {
            showPage(previousActivePageId || 'users-page');
        });
    }
    if(cancelUserEditPageBtn) {
         cancelUserEditPageBtn.addEventListener('click', function() {
            showPage(previousActivePageId || 'users-page');
        });
    }

    if (saveUserChangesPageBtn) {
        saveUserChangesPageBtn.addEventListener('click', function() {
            const userId = document.getElementById('editUserIdPage').value;
            dummyUsers[userId].fullName = document.getElementById('editUserFullNamePage').value;
            dummyUsers[userId].email = document.getElementById('editUserEmailPage').value;
            dummyUsers[userId].userType = document.getElementById('editUserTypePage').value;
            dummyUsers[userId].gender = document.getElementById('editUserGenderPage').value;
            dummyUsers[userId].ageGroup = document.getElementById('editUserAgeGroupPage').value;
            dummyUsers[userId].jobTitle = document.getElementById('editUserJobTitlePage').value;
            
            showPage(previousActivePageId || 'users-page');
        });
    }
    
    window.addEventListener('keydown', function (event) {
        const editUserPageEl = document.getElementById('edit-user-page');
        if (event.key === 'Escape' && editUserPageEl && editUserPageEl.classList.contains('active')) {
            showPage(previousActivePageId || 'users-page');
        }
    });

    function getAllUserCheckboxes() { return document.querySelectorAll('#usersTableBody .user-select-checkbox'); }
    if (selectAllUsersBtn) { selectAllUsersBtn.addEventListener('click', function() { getAllUserCheckboxes().forEach(checkbox => checkbox.checked = true); if(masterUserCheckbox) masterUserCheckbox.checked = true; }); }
    if (deselectAllUsersBtn) { deselectAllUsersBtn.addEventListener('click', function() { getAllUserCheckboxes().forEach(checkbox => checkbox.checked = false); if(masterUserCheckbox) masterUserCheckbox.checked = false; }); }
    if (masterUserCheckbox) { masterUserCheckbox.addEventListener('change', function() { getAllUserCheckboxes().forEach(checkbox => checkbox.checked = this.checked); }); }
    if (usersTableBody) {
        usersTableBody.addEventListener('change', function(event){
            if (event.target.classList.contains('user-select-checkbox')) {
                if (!masterUserCheckbox) return;
                const allCheckboxes = getAllUserCheckboxes(); const allChecked = Array.from(allCheckboxes).every(cb => cb.checked); const someChecked = Array.from(allCheckboxes).some(cb => cb.checked);
                masterUserCheckbox.checked = allChecked; masterUserCheckbox.indeterminate = !allChecked && someChecked;
            }
        });
    }

    function populateSettingsForm() {
        const settingsName = document.getElementById('setting-name');
        const settingsEmail = document.getElementById('setting-email');
        const settingsPhone = document.getElementById('setting-phone');

        if (settingsName) settingsName.value = loggedInUser.fullName;
        if (settingsEmail) settingsEmail.value = loggedInUser.email;
        if (settingsPhone) settingsPhone.value = loggedInUser.phone || '';
    }

    function setInitialSidebarState() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 992;
        sidebar.classList.remove('open', 'expanded', 'collapsed');
        mainContent.classList.remove('sidebar-collapsed', 'sidebar-expanded');
        if(overlay) overlay.classList.remove('active');
        if (isMobile) { }
        else if (isTablet) { sidebar.classList.add('collapsed'); mainContent.classList.add('sidebar-collapsed');}
        else { }
    }
    setInitialSidebarState();
    window.addEventListener('resize', setInitialSidebarState);

    const dashboardLink = document.querySelector('.nav-link[data-page="dashboard"]');
    if (dashboardLink) {
        dashboardLink.click(); 
    }
    const settingsNavLink = document.querySelector('.nav-link[data-page="settings"]');
    if(settingsNavLink){
        settingsNavLink.addEventListener('click', populateSettingsForm);
    }
    const saveProfileBtn = document.getElementById('saveProfileChangesBtn');
    if(saveProfileBtn){
        saveProfileBtn.addEventListener('click', function(){
            loggedInUser.fullName = document.getElementById('setting-name').value;
            loggedInUser.phone = document.getElementById('setting-phone').value;
            console.log("Profile Updated:", loggedInUser);
            alert("Profile changes saved!");
            populateSettingsForm(); 
            if (userProfileNameHeaderEl) userProfileNameHeaderEl.textContent = loggedInUser.fullName;
            if (userProfileAvatarHeaderEl) userProfileAvatarHeaderEl.src = `https://via.placeholder.com/40/6366f1/FFFFFF?text=${loggedInUser.fullName.substring(0,1)}${loggedInUser.fullName.split(" ")[1] ? loggedInUser.fullName.split(" ")[1].substring(0,1) : '' }`;
        });
    }

});