/**
 * ECOSMART WASTE MANAGEMENT — CORE ENGINE v5.0
 * Persistent Sidebar | Real GPS Maps | 2km Truck Alerts | Real-time Complaint Sync
 * Reward System | Marketplace | Leaderboard | Schedule Timetable
 */

// Use configuration from config.js if available, otherwise use defaults
const CONFIG = window.EcoSmartConfig || {};
const API_BASE = (CONFIG.api && CONFIG.api.baseUrl) || 'http://localhost:3000';
const MAP_DEFAULT = (CONFIG.map && CONFIG.map.defaultCenter) || [28.6139, 77.2090];
const TRUCK_ALERT_KM = (CONFIG.map && CONFIG.map.truckAlertRadius) || 2;
const POLL_MS = (CONFIG.polling && CONFIG.polling.interval) || 8000;

// ===== UTILS =====
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371,
        dLat = (lat2 - lat1) * Math.PI / 180,
        dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fmt(d) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }

function fmtDate(d) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }

// ===== AUTH HELPERS =====
const getToken = () => localStorage.getItem('access_token');
const getHeaders = () => ({ 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) });

async function apiReq(endpoint, opts = {}) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), (CONFIG.api && CONFIG.api.timeout) || 30000);

        const r = await fetch(`${API_BASE}${endpoint}`, {
            ...opts,
            headers: {...getHeaders(), ...(opts.headers || {}) },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (r.status === 204) return null;

        // Handle empty responses
        const text = await r.text();
        const d = text ? JSON.parse(text) : {};

        if (!r.ok) {
            // Handle different error status codes
            switch (r.status) {
                case 401:
                    localStorage.removeItem('access_token');
                    const isAdmin = window.location.pathname.includes('/admin/');
                    if (!window.location.pathname.includes('login')) {
                        UI.notify('Session expired. Please log in again.', 'warning');
                        setTimeout(() => {
                            window.location.href = isAdmin ? '../admin/admin-login.html' : '../user/login.html';
                        }, 1500);
                    }
                    break;
                case 403:
                    UI.notify('You do not have permission to perform this action.', 'error');
                    break;
                case 404:
                    UI.notify('The requested resource was not found.', 'error');
                    break;
                case 422:
                    UI.notify('Invalid data provided. Please check your input.', 'error');
                    break;
                case 429:
                    UI.notify('Too many requests. Please try again later.', 'warning');
                    break;
                case 500:
                    UI.notify('Server error. Please try again later.', 'error');
                    break;
            }
            throw new Error(d.message || `Error ${r.status}`);
        }
        return d;
    } catch (e) {
        if (e.name === 'AbortError') {
            UI.notify('Request timeout. Please check your connection.', 'error');
            throw new Error('Request timeout');
        }
        if (e.message === 'Failed to fetch') {
            UI.notify('Cannot connect to the server. Please check your connection.', 'error');
            throw new Error('Network error');
        }
        console.error(`[API] ${endpoint}`, e);
        throw e;
    }
}

// ===== TOAST ENGINE =====
const UI = {
        notify(msg, type = 'success') {
            let box = document.getElementById('_toasts');
            if (!box) {
                box = document.createElement('div');
                box.id = '_toasts';
                Object.assign(box.style, { position: 'fixed', bottom: '24px', right: '24px', zIndex: '99999', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px' });
                document.body.appendChild(box);
            }
            const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
            const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
            const t = document.createElement('div');
            Object.assign(t.style, { background: colors[type] || colors.success, color: 'white', padding: '13px 20px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: "'Outfit',sans-serif", fontSize: '0.88rem', fontWeight: '500', opacity: '0', transform: 'translateX(40px)', transition: 'all 0.35s cubic-bezier(0.175,0.885,0.32,1.275)' });
            t.innerHTML = `<i class="fas ${icons[type]||icons.success}"></i><span>${msg}</span>`;
            box.appendChild(t);
            requestAnimationFrame(() => {
                t.style.opacity = '1';
                t.style.transform = 'translateX(0)';
            });
            setTimeout(() => {
                t.style.opacity = '0';
                t.style.transform = 'translateX(40px)';
                setTimeout(() => t.remove(), 350);
            }, 4500);
        },

        confirm(msg) { return window.confirm(msg); },

        initLayout() {
            const isUser = window.location.pathname.includes('/user/');
            const isAdmin = window.location.pathname.includes('/admin/');
            if (!isUser && !isAdmin) return;
            const role = isAdmin ? 'admin' : 'user';
            const page = window.location.pathname.split('/').pop() || 'dashboard.html';
            const logoutPages = ['dashboard.html', 'profile.html', 'editprofile.html', 'admin-dashboard.html'];
            const showLogout = logoutPages.includes(page);

            const sidebar = document.querySelector('.admin-sidebar') || document.querySelector('.user-sidebar');
            if (sidebar) {
                const collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
                const adminMenu = [
                    { icon: 'fa-tachometer-alt', label: 'Dashboard', link: 'admin-dashboard.html' },
                    { icon: 'fa-users', label: 'Citizens', link: 'users.html' },
                    { icon: 'fa-exclamation-circle', label: 'Complaints', link: 'complaints.html', badge: 'complaintsBadge' },
                    { icon: 'fa-truck', label: 'Fleet', link: 'trucks.html' },
                    { icon: 'fa-plus-circle', label: 'Add Truck', link: 'add-truck.html' },
                    { icon: 'fa-trash-alt', label: 'Smart Bins', link: 'dustbins.html' },
                    { icon: 'fa-plus-square', label: 'Add Dustbin', link: 'add-dustbin.html' },
                    { icon: 'fa-gift', label: 'Rewards', link: 'rewards.html' },
                    { icon: 'fa-trophy', label: 'Leaderboard', link: 'leaderboard-admin.html' },
                    { icon: 'fa-store', label: 'Marketplace', link: 'listings.html' },
                    { icon: 'fa-exchange-alt', label: 'Transactions', link: 'transactions.html' },
                    { icon: 'fa-calendar-alt', label: 'Manage Schedules', link: 'schedules.html' },
                    { icon: 'fa-truck-loading', label: 'Truck Requests', link: 'truck-requests.html' },
                    { icon: 'fa-tasks', label: 'Activity Logs', link: 'truck-activity.html' },
                    { icon: 'fa-user-shield', label: 'User Status', link: 'user-status.html' },
                ];
                const userMenu = [
                    { icon: 'fa-home', label: 'Dashboard', link: 'dashboard.html' },
                    { icon: 'fa-bullhorn', label: 'Raise Complaint', link: 'raise-complaint.html' },
                    { icon: 'fa-list-ul', label: 'My Complaints', link: 'complaint-list.html' },
                    { icon: 'fa-map-marked-alt', label: 'Live Tracking', link: 'livetracking.html' },
                    { icon: 'fa-map-pin', label: 'Dustbin Locator', link: 'nearby-dustbins.html' },
                    { icon: 'fa-calendar-alt', label: 'Truck Schedule', link: 'truck-shedule.html' },
                    { icon: 'fa-truck-loading', label: 'Request Truck', link: 'request-truck.html' },
                    { icon: 'fa-trophy', label: 'Leaderboard', link: 'leaderboard.html' },
                    { icon: 'fa-gift', label: 'Rewards', link: 'reward-dashboard.html' },
                    { icon: 'fa-store', label: 'Marketplace', link: 'browse-listings.html' },
                    { icon: 'fa-bell', label: 'Notifications', link: 'notifications.html' },
                ];
                const menu = isAdmin ? adminMenu : userMenu;
                sidebar.innerHTML = `
                <div class="sidebar-header">
                    <div class="logo-box">
                        <i class="fas fa-leaf"></i>
                        <span class="logo-text">EcoSmart</span>
                    </div>
                    <button id="sidebarToggle" class="sidebar-toggle" title="Toggle Sidebar">
                        <i class="fas ${collapsed?'fa-angle-double-right':'fa-angle-double-left'}"></i>
                    </button>
                </div>
                <nav class="sidebar-nav">
                    ${menu.map(m=>`
                        <a href="${m.link}" class="nav-item ${page===m.link?'active':''}" data-tooltip="${m.label}">
                            <i class="fas ${m.icon}"></i>
                            <span class="nav-label">${m.label}</span>
                            ${m.badge?`<span class="nav-badge" id="${m.badge}" style="display:none">0</span>`:''}
                        </a>`).join('')}
                </nav>
                <div class="sidebar-footer">
                    <div class="eco-badge">
                        <i class="fas fa-seedling"></i>
                        <span class="nav-label">Go Green. Live Clean.</span>
                    </div>
                </div>`;
            if(collapsed)sidebar.classList.add('collapsed');
            document.getElementById('sidebarToggle')?.addEventListener('click',()=>{
                const c=sidebar.classList.toggle('collapsed');
                localStorage.setItem('sidebarCollapsed',c);
                const icon=document.querySelector('#sidebarToggle i');
                if(icon)icon.className=`fas ${c?'fa-angle-double-right':'fa-angle-double-left'}`;
            });
        }

        // TOP BAR
        const bar=document.querySelector('.admin-top-bar')||document.querySelector('.user-header');
        if(bar){
            const title=document.title.split('|')[0].trim();
            bar.innerHTML=`
                <div class="top-bar-left">
                    <h1>${title}</h1>
                    <p class="top-bar-subtitle"><span class="live-dot"></span>Protecting our planet, one step at a time 🌿</p>
                </div>
                <div class="top-bar-right">
                    <div class="user-profile-section">
                        <div id="_profTrigger" class="profile-trigger">
                            <img src="https://ui-avatars.com/api/?name=${role}&background=10b981&color=fff&size=80" alt="Profile">
                            <span class="user-name" id="_userName">${role==='admin'?'Admin':'Citizen'}</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div id="_profDrop" class="profile-dropdown">
                            <a href="${isAdmin?'':'' }profile.html"><i class="fas fa-user-circle"></i> My Profile</a>
                            <a href="editprofile.html"><i class="fas fa-user-edit"></i> Edit Profile</a>
                            ${showLogout?`<hr><a href="#" class="logout-link" id="_logoutBtn"><i class="fas fa-sign-out-alt"></i> Log Out</a>`:''}
                        </div>
                    </div>
                </div>`;
            const t=document.getElementById('_profTrigger'),d=document.getElementById('_profDrop');
            if(t&&d){
                t.onclick=e=>{e.stopPropagation();d.style.display=d.style.display==='block'?'none':'block';};
                document.addEventListener('click',()=>d.style.display='none');
            }
            document.getElementById('_logoutBtn')?.addEventListener('click',e=>{
                e.preventDefault();Auth.logout(role);
            });
            // Load real user name
            apiReq('/users/me').then(u=>{
                const n=document.getElementById('_userName');
                if(n&&u)n.textContent=u.name||role;
                if(t&&u){const img=t.querySelector('img');if(img)img.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name||role)}&background=10b981&color=fff&size=80`;}
            }).catch(()=>{});
        }
    }
};

// ===== AUTH =====
const Auth={
    async login(role,email,password){
        const btn=document.querySelector('button[type="submit"]')||document.getElementById('loginBtn');
        const orig=btn?.innerHTML;
        try{
            if(btn){btn.innerHTML='<i class="fas fa-circle-notch fa-spin"></i> Signing in...';btn.disabled=true;}
            const d=await apiReq('/auth/login',{method:'POST',body:JSON.stringify({email,password})});
            localStorage.setItem('access_token',d.access_token);
            localStorage.setItem(`${role}LoggedIn`,'true');
            UI.notify('Welcome back to EcoSmart! 🌿');
            setTimeout(()=>{window.location.href=role==='admin'?'admin-dashboard.html':'dashboard.html';},1000);
        }catch(err){
            UI.notify(err.message||'Login failed','error');
            if(btn){btn.innerHTML=orig;btn.disabled=false;}
        }
    },
    async register(name,email,password){
        return apiReq('/auth/register',{method:'POST',body:JSON.stringify({name,email,password})});
    },
    async forgotPassword(email){
        const btn=document.querySelector('button[type="submit"]')||document.getElementById('forgotBtn');
        const orig=btn?.innerHTML;
        try{
            if(btn){btn.innerHTML='<i class="fas fa-circle-notch fa-spin"></i> Sending...';btn.disabled=true;}
            const result=await apiReq('/auth/forgot-password',{method:'POST',body:JSON.stringify({email})});
            UI.notify('Password reset link has been sent to your email! 📧','success');
            setTimeout(()=>{window.location.href='../user/login.html';},2000);
        }catch(err){
            UI.notify(err.message||'Failed to send reset link','error');
            if(btn){btn.innerHTML=orig;btn.disabled=false;}
        }
    },
    async resetPassword(token,newPassword){
        const btn=document.querySelector('button[type="submit"]')||document.getElementById('resetBtn');
        const orig=btn?.innerHTML;
        try{
            if(btn){btn.innerHTML='<i class="fas fa-circle-notch fa-spin"></i> Resetting...';btn.disabled=true;}
            const result=await apiReq('/auth/reset-password',{method:'POST',body:JSON.stringify({token,newPassword})});
            UI.notify('Password has been reset successfully! ✅','success');
            setTimeout(()=>{window.location.href='../user/login.html';},2000);
        }catch(err){
            UI.notify(err.message||'Failed to reset password','error');
            if(btn){btn.innerHTML=orig;btn.disabled=false;}
        }
    },
    async verifyResetToken(token){
        try{
            const result=await apiReq(`/auth/verify-reset-token?token=${token}`,{method:'GET'});
            return result;
        }catch(err){
            return null;
        }
    },
    logout(role){
        localStorage.removeItem('access_token');
        localStorage.removeItem(`${role}LoggedIn`);
        window.location.href=role==='admin'?'../admin/admin-login.html':'../user/login.html';
    }
};

// ===== API =====
const API={
    getProfile:()=>apiReq('/users/me'),
    updateProfile:d=>apiReq('/users/profile',{method:'PATCH',body:JSON.stringify(d)}),
    getUsers:()=>apiReq('/users'),
    getLeaderboard:()=>apiReq('/users/leaderboard'),
    getStats:()=>apiReq('/admin/dashboard'),
    getAdminStats:()=>apiReq('/admin/dashboard'),
    getRecentActivity:()=>apiReq('/admin/activity/recent'),
    getTrucks:()=>apiReq('/trucks'),
    addTruck:d=>apiReq('/trucks',{method:'POST',body:JSON.stringify(d)}),
    updateTruck:(id,d)=>apiReq(`/trucks/${id}`,{method:'PATCH',body:JSON.stringify(d)}),
    updateTruckLocation:(id,d)=>apiReq(`/trucks/${id}/location`,{method:'PATCH',body:JSON.stringify(d)}),
    getComplaints:()=>apiReq('/complaints'),
    getMyComplaints:()=>apiReq('/complaints/my'),
    getComplaintById:id=>apiReq(`/complaints/${id}`),
    createComplaint:d=>apiReq('/complaints',{method:'POST',body:JSON.stringify(d)}),
    updateComplaintStatus:(id,status)=>apiReq(`/complaints/${id}/status`,{method:'PATCH',body:JSON.stringify({status})}),
    getDustbins:()=>apiReq('/dustbins'),
    addDustbin:d=>apiReq('/dustbins',{method:'POST',body:JSON.stringify(d)}),
    getRewards:()=>apiReq('/rewards'),
    createReward:d=>apiReq('/rewards',{method:'POST',body:JSON.stringify(d)}),
    updateReward:(id,d)=>apiReq(`/rewards/${id}`,{method:'PATCH',body:JSON.stringify(d)}),
    deleteReward:id=>apiReq(`/rewards/${id}`,{method:'DELETE'}),
    redeemReward:id=>apiReq(`/rewards/${id}/redeem`,{method:'POST'}),
    getNotifications:()=>apiReq('/notifications'),
    markNotificationRead:id=>apiReq(`/notifications/${id}/read`,{method:'PATCH'}),
    createTruckRequest:d=>apiReq('/truck-requests',{method:'POST',body:JSON.stringify(d)}),
    getMyTruckRequests:()=>apiReq('/truck-requests/my'),
    getAllTruckRequests:()=>apiReq('/truck-requests'),
    updateTruckRequest:(id,d)=>apiReq(`/truck-requests/${id}`,{method:'PATCH',body:JSON.stringify(d)}),
    getSchedules:()=>apiReq('/schedules'),
    createSchedule:d=>apiReq('/schedules',{method:'POST',body:JSON.stringify(d)}),
    updateSchedule:(id,d)=>apiReq(`/schedules/${id}`,{method:'PATCH',body:JSON.stringify(d)}),
    deleteSchedule:id=>apiReq(`/schedules/${id}`,{method:'DELETE'}),
    getListings:()=>apiReq('/listings'),
    createListing:d=>apiReq('/listings',{method:'POST',body:JSON.stringify(d)}),
    getListingById:id=>apiReq(`/listings/${id}`),
    purchaseListing:id=>apiReq(`/listings/${id}/purchase`,{method:'POST'}),
    getTransactions:()=>apiReq('/transactions'),
};

// ===== MAP ENGINE (LEAFLET + REAL GPS) =====
const MAP={
    userCoords:null,
    watchId:null,

    init(containerId,coords=MAP_DEFAULT,zoom=13){
        if(!window.L){console.error('Leaflet not loaded');return null;}
        const el=document.getElementById(containerId);
        if(!el)return null;
        if(el._leaflet_id){try{el._leaflet_id=null;}catch(e){}}
        const map=L.map(containerId,{zoomControl:true,scrollWheelZoom:true}).setView(coords,zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
            attribution:'&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> | EcoSmart',
            maxZoom:19
        }).addTo(map);
        setTimeout(()=>map.invalidateSize(),150);
        return map;
    },

    getUserLocation(cb){
        if(!navigator.geolocation){cb(MAP_DEFAULT,false);return;}
        navigator.geolocation.getCurrentPosition(
            p=>cb([p.coords.latitude,p.coords.longitude],true),
            ()=>cb(MAP_DEFAULT,false),
            {enableHighAccuracy:true,timeout:12000,maximumAge:30000}
        );
    },

    watchPosition(cb){
        if(!navigator.geolocation)return;
        this.watchId=navigator.geolocation.watchPosition(
            p=>cb([p.coords.latitude,p.coords.longitude],true),
            e=>console.warn('GPS watch error:',e),
            {enableHighAccuracy:true,timeout:10000,maximumAge:5000}
        );
    },

    stopWatch(){if(this.watchId!=null)navigator.geolocation.clearWatch(this.watchId);},

    createIcon(type){
        const configs={
            user:{html:`<div style="width:18px;height:18px;border-radius:50%;background:#10b981;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,size:[18,18]},
            truck:{html:`<div style="width:38px;height:38px;border-radius:50%;background:#f59e0b;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;"><i class="fas fa-truck" style="color:white;font-size:15px;"></i></div>`,size:[38,38]},
            bin:{html:`<div style="width:30px;height:30px;border-radius:7px;background:#10b981;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;"><i class="fas fa-trash" style="color:white;font-size:12px;"></i></div>`,size:[30,30]},
            binFull:{html:`<div style="width:30px;height:30px;border-radius:7px;background:#ef4444;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;"><i class="fas fa-trash" style="color:white;font-size:12px;"></i></div>`,size:[30,30]},
            binMed:{html:`<div style="width:30px;height:30px;border-radius:7px;background:#f59e0b;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;"><i class="fas fa-trash" style="color:white;font-size:12px;"></i></div>`,size:[30,30]},
        };
        const c=configs[type]||configs.bin;
        return L.divIcon({className:'',html:c.html,iconSize:c.size,iconAnchor:[c.size[0]/2,c.size[1]/2]});
    },

    addMarker(map,coords,popup,type='bin'){
        if(!map)return null;
        const m=L.marker(coords,{icon:MAP.createIcon(type)}).addTo(map);
        if(popup)m.bindPopup(popup);
        return m;
    },

    checkProximity(userCoords,truckList,onClose){
        truckList.forEach(truck=>{
            const d=haversine(userCoords[0],userCoords[1],truck.lat,truck.lng);
            if(d<=TRUCK_ALERT_KM)onClose(d,truck);
        });
    },

    addPulseRing(map,coords){
        const icon=L.divIcon({className:'',html:`<div style="width:60px;height:60px;border-radius:50%;border:3px solid #10b981;animation:mapPulse 1.5s ease-out infinite;position:relative;left:-15px;top:-15px;"></div>`,iconSize:[60,60]});
        const style=document.createElement('style');
        style.textContent='@keyframes mapPulse{0%{transform:scale(0.5);opacity:1}100%{transform:scale(2);opacity:0}}';
        document.head.appendChild(style);
        return L.marker(coords,{icon,zIndexOffset:-100}).addTo(map);
    }
};

// ===== TRUCK TRACKER =====
const TruckTracker={
    map:null, userMarker:null, truckMarkers:{}, alertedTrucks:{}, intervalId:null,

    init(map){
        this.map=map;
        if('Notification'in window&&Notification.permission==='default')
            Notification.requestPermission();
        MAP.getUserLocation((coords,ok)=>{
            MAP.userCoords=coords;
            if(ok&&map){
                map.setView(coords,14);
                this.userMarker=MAP.addMarker(map,coords,'<b>📍 Your Location</b><br>You are here','user');
                MAP.addPulseRing(map,coords);
            }
            this.startPolling();
        });
    },

    async startPolling(){
        const poll=async()=>{
            try{
                const trucks=await API.getTrucks();
                const truckList=[];
                trucks.forEach(t=>{
                    const lat=t.latitude||(MAP_DEFAULT[0]+(Math.random()-0.5)*0.025);
                    const lng=t.longitude||(MAP_DEFAULT[1]+(Math.random()-0.5)*0.025);
                    truckList.push({id:t.id,lat,lng,number:t.number,driver:t.driverName,status:t.status});
                    const popup=`<b>🚛 Truck ${t.number}</b><br>Driver: ${t.driverName||'--'}<br>Status: <b>${t.status}</b>`;
                    if(this.truckMarkers[t.id]){
                        this.truckMarkers[t.id].setLatLng([lat,lng]).setPopupContent(popup);
                    } else {
                        this.truckMarkers[t.id]=MAP.addMarker(this.map,[lat,lng],popup,'truck');
                    }
                });
                if(MAP.userCoords){
                    MAP.checkProximity(MAP.userCoords,truckList,(dist,truck)=>{
                        const key=truck.id;
                        const now=Date.now();
                        if(!this.alertedTrucks[key]||(now-this.alertedTrucks[key]>5*60*1000)){
                            this.alertedTrucks[key]=now;
                            const msg=`🚛 Truck ${truck.number} is ${dist.toFixed(1)}km away! Get your waste ready.`;
                            UI.notify(msg,'warning');
                            const el=document.getElementById('truckAlert');
                            if(el){el.classList.add('show');const d=document.getElementById('alertDistance');if(d)d.textContent=msg;}
                            if('Notification'in window&&Notification.permission==='granted')
                                new Notification('EcoSmart — Truck Alert 🚛',{body:msg,icon:'https://cdn-icons-png.flaticon.com/512/2830/2830305.png'});
                        }
                    });
                }
            }catch(e){console.warn('Truck poll:',e);}
        };
        await poll();
        this.intervalId=setInterval(poll,POLL_MS);
    },

    stop(){if(this.intervalId)clearInterval(this.intervalId);}
};

// ===== COMPLAINT SYNC (Admin Real-time) =====
const ComplaintSync={
    lastCount:0, intervalId:null,

    start(){
        if(!window.location.pathname.includes('/admin/'))return;
        const poll=async()=>{
            try{
                const complaints=await API.getComplaints();
                const pending=complaints.filter(c=>c.status==='pending').length;
                const badge=document.getElementById('complaintsBadge');
                if(badge){badge.textContent=pending;badge.style.display=pending>0?'inline':'none';}
                if(pending>this.lastCount&&this.lastCount>0)
                    UI.notify(`New complaint received! (${pending} pending)`,'info');
                this.lastCount=pending;
                if(typeof window.renderComplaints==='function')window.renderComplaints(complaints);
            }catch(e){console.warn('ComplaintSync:',e);}
        };
        poll();
        this.intervalId=setInterval(poll,POLL_MS);
    },
    stop(){if(this.intervalId)clearInterval(this.intervalId);}
};

// ===== FALLBACK STATE =====
window.ecoState={
    currentUser:{id:1,name:'Eco Citizen',email:'citizen@ecosmart.com',ecoCoins:750},
    listings:[
        {id:1,title:'Recycled Plastic Pellets (5kg)',price:120,description:'High-quality recycled PET pellets, perfect for manufacturing.',seller:'GreenTech Industries',category:'Plastic',quantity:'5 kg',status:'AVAILABLE'},
        {id:2,title:'Organic Compost Mix (10kg)',price:80,description:'Premium organic compost from segregated food waste.',seller:'EarthWaste Solutions',category:'Organic',quantity:'10 kg',status:'AVAILABLE'},
        {id:3,title:'Sorted Cardboard Bundles',price:45,description:'Clean sorted corrugated cardboard, baled and ready.',seller:'City Recyclers',category:'Paper',quantity:'20 kg',status:'AVAILABLE'},
        {id:4,title:'Scrap Aluminum Cans (20kg)',price:200,description:'Clean sorted aluminium, compressed for easy transport.',seller:'MetalWorks Co.',category:'Metal',quantity:'20 kg',status:'AVAILABLE'},
        {id:5,title:'Glass Bottles (Mixed)',price:60,description:'Clean mixed glass bottles sorted by color.',seller:'ClearGlass Ltd.',category:'Glass',quantity:'15 kg',status:'AVAILABLE'},
        {id:6,title:'E-Waste Components',price:350,description:'Sorted PCBs and electronic components for recycling.',seller:'TechRecycle Hub',category:'E-Waste',quantity:'8 kg',status:'AVAILABLE'},
    ]
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded',()=>{
    UI.initLayout();
    ComplaintSync.start();
});
window.addEventListener('beforeunload',()=>{
    TruckTracker.stop();
    ComplaintSync.stop();
    MAP.stopWatch();
});

window.Auth=Auth;window.API=API;window.UI=UI;window.MAP=MAP;
window.TruckTracker=TruckTracker;window.ComplaintSync=ComplaintSync;
window.haversine=haversine;window.fmt=fmt;window.fmtDate=fmtDate;