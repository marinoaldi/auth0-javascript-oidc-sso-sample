window.addEventListener('load', function() {

    var content = document.querySelector('.content');
    var loadingSpinner = document.getElementById('loading');
    content.style.display = 'block';
    loadingSpinner.style.display = 'none';

    try {
        if (!AUTH0_CLIENT_ID || !AUTH0_DOMAIN) {
            alert('Make sure to set the AUTH0_CLIENT_ID and AUTH0_DOMAIN variables in auth0-variables.js.');
        }
    } catch(err) {
        alert('Make sure to set the AUTH0_CLIENT_ID and AUTH0_DOMAIN variables in auth0-variables.js.');
    }


    var statusView = document.getElementById('status-view');
    var contentView = document.getElementById('content-view');


    // buttons and event listeners
    var loginBtn = document.getElementById('btn-login');
    var renewBtn = document.getElementById('btn-renew');
    var logoutLocallyBtn = document.getElementById('btn-logout-locally');
    var logoutAuth0Btn = document.getElementById('btn-logout-auth0');

    var homeViewBtn = document.getElementById('btn-home-view');
    var profileViewBtn = document.getElementById('btn-profile-view');
    var pingViewBtn = document.getElementById('btn-ping-view');
    var adminViewBtn = document.getElementById('btn-admin-view');


    loginBtn.addEventListener('click', login);
    renewBtn.addEventListener('click', renew);
    logoutLocallyBtn.addEventListener('click', logoutLocally);
    logoutAuth0Btn.addEventListener('click', logoutAuth0);


    function login() {
        renew();
    }

    function renew() {
        auth0js.renewAuth({
            redirectUri: AUTH0_CALLBACK_SILENT_URL,
            usePostMessage: true
        }, function (err, authResult) {
            if (err) {
                alert(`Could not get a new token using silent authentication (${err.error}). Redirecting to login page...`);
                auth0js.authorize();
            } else {
                setLocalSession(authResult);
                displayPage();
            }
        });
    }

    function logoutLocally() {
        removeLocalSession();
        displayPage();
    }

    function logoutAuth0() {
        removeLocalSession();
        auth0js.logout({
            client_id: AUTH0_CLIENT_ID,
            returnTo: AUTH0_LOGOUT_URL
        });
    }

    function setLocalSession(authResult) {
        // Set the time that the access token will expire at
        var expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        );
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    function removeLocalSession() {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('profile');
    }

    function isAuthenticated() {
        // Check whether access_token in localStorage
        return !localStorage.getItem('access_token') ? false : true;
    }

    function isExpired() {
        // Check whether the current time is past the
        // access token's expiry time
        var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return expiresAt < new Date().getTime();
    }

    function displayPage() {
        displayButtons();

        var currentLocation = window.location.pathname;
        var loginStatus = document.querySelector('.container h4');

        if(isAuthenticated() && (currentLocation === "/" || currentLocation === "/index.html")){

            if(isExpired()){
                loginStatus.innerHTML = `You are logged in! You can now view your profile area and send authenticated requests to your server.
                         <br><br>There is an expired access token in local storage. Click RENEW button to renew it</a>
                         <br><br>- Log Out (locally): clear local storage</li>
                         <br><br>- Log Out (Auth0): clear local storage + clear Auth0 session</li>`;
            } else {
                const expirationDate = new Date(Number.parseInt(localStorage.getItem('expires_at')));
                loginStatus.innerHTML = `You are logged in! You can now view your profile area and send authenticated requests to your server.
                         <br><br>There is an access token in local storage, and it expires on ${expirationDate}. Click RENEW button to renew it</a>
                         <br><br>- Log Out (locally): clear local storage</li>
                         <br><br>- Log Out (Auth0): clear local storage + clear Auth0 session</li>`;
            }
            statusView.style.display = 'inline-block';
        } else if(isAuthenticated() && currentLocation === "/profile.html") {
            getProfile();
            contentView.style.display = 'inline-block';

        } else if(currentLocation === "/ping.html") {
            var pingPublic = document.getElementById('btn-ping-public');
            var pingPrivate = document.getElementById('btn-ping-private');
            var pingPrivateScopes = document.getElementById('btn-ping-private-scopes');

            var callPrivateMessage = document.getElementById('call-private-message');
            var pingMessage = document.getElementById('ping-message');

            pingPublic.addEventListener('click', function() {
                callAPI('/public', false);
            });

            pingPrivate.addEventListener('click', function() {
                callAPI('/private', true);
            });

            pingPrivateScopes.addEventListener('click', function() {
                callAPI('/private/admin', true);
            });

            contentView.style.display = 'inline-block';
            if (isAuthenticated()) {
                pingPrivate.style.display = 'inline-block';
                pingPrivateScopes.style.display = 'inline-block';
                callPrivateMessage.style.display = 'none';
            } else {
                pingPrivate.style.display = 'none';
                pingPrivateScopes.style.display = 'none';
                callPrivateMessage.style.display = 'block';
            }
        } else if(currentLocation === "/logout.html") {
            if (isAuthenticated()) {
                loginStatus.innerHTML = "You are still logged in! If you want to log out click on 'Log Out (locally)' or 'Log Out (Auth0)'";
                contentView.style.display = 'none';
            } else {
                loginStatus.innerHTML = '';
                contentView.style.display = 'inline-block';
            }
        } else {
            loginStatus.innerHTML = 'You are not logged in! Please log in to continue.' +
                '<br><br>There is no access token present in local storage, meaning that you are not logged in. Click LOGIN button to attempt an SSO login';
            statusView.style.display = 'inline-block';
        }
    }

    function displayButtons() {
        if (isAuthenticated()) {
            loginBtn.style.display = 'none';
            renewBtn.style.display = 'inline-block';
            logoutLocallyBtn.style.display = 'inline-block';
            logoutAuth0Btn.style.display = 'inline-block';
            profileViewBtn.style.display = 'inline-block';
            if (isAdmin()) {
                adminViewBtn.style.display = 'inline-block';
            } else {
                adminViewBtn.style.display = 'none';
            }
        } else {
            loginBtn.style.display = 'inline-block';
            renewBtn.style.display = 'none';
            logoutLocallyBtn.style.display = 'none';
            logoutAuth0Btn.style.display = 'none';
            profileViewBtn.style.display = 'none';
            adminViewBtn.style.display = 'none';
        }
    }

    function getProfile() {
        var accessToken = localStorage.getItem('access_token');

        if(!accessToken) {
            console.log('Access token must exist to fetch profile');
            alert('Access token must exist to fetch profile');
        } else if(isExpired()){
            console.log('Access token is expired, it must not expired to fetch profile');
            alert('Access token is expired, it must not expired to fetch profile');
        }

        auth0js.client.userInfo(accessToken, function(err, profile) {
            if (err) {
                console.log('There was an error getting the userInfo: ' + JSON.stringify(err));
                console.log(err);
                alert('There was an error getting the userInfo: ' + err.statusCode + ' - ' + err.statusText);
            } else {
                // Now you have the user's information
                localStorage.setItem('profile', JSON.stringify(profile));
                displayProfile(profile);
            }
        });
    }


    function displayProfile(userProfile) {
        // display the profile
        document.querySelector('#content-view .nickname').innerHTML = userProfile.nickname;
        document.querySelector('#content-view .full-profile').innerHTML = JSON.stringify(userProfile, null, 2);
        document.querySelector('#content-view img').src = userProfile.picture;
    }

    function callAPI(endpoint, secured) {
        var url = API_URL + endpoint;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        if (secured) {
            xhr.setRequestHeader(
                'Authorization',
                'Bearer ' + localStorage.getItem('access_token')
            );
        }
        xhr.onload = function() {
            if (xhr.status == 200) {
                document.querySelector('#content-view h2').innerHTML = JSON.parse(
                    xhr.responseText
                ).message;
            } else {
                var extraInfo = "";
                if (xhr.status == 401) {
                    extraInfo += "<br><br>You are not logged in or maybe access_token expired. Renew it";
                } else if (xhr.status == 403) {
                    extraInfo += "<br><br>You need to be authenticated and have a scope of read:messages to see this";
                }
                document.querySelector('#content-view h2').innerHTML = xhr.status + ": " + xhr.statusText + extraInfo;
                alert('Request failed: ' + xhr.status + ' - '+ xhr.statusText);
            }
        };
        xhr.send();
    }

    function getRole() {
        var namespace = 'https://example.com';
        var idToken = localStorage.getItem('id_token');
        return jwt_decode(idToken)[namespace + '/role'] || null;
    }

    function isAdmin() {
        return getRole() === 'admin';
    }


    displayPage();
});
