# Vanilla Single-Page App (SPA)

## Prerequisites

1. Go to https://manage.auth0.com/#/clients and create a single-page application client with OIDC Conformant mode enabled
2. Add `http://localhost:3091` and `http://localhost:3091/callback-silent.html` as **Allowed Callback URLs**
3. Add `http://localhost:3091` as **Allowed Logout URLs**
4. Enter your Auth0 domain and client ID in the [`auth0-variables.js`](auth0-variables.js.example) file.
5. Configure [your API server](/server-api#getting-started)


## Set the Client ID, Domain, and API URL

If you download the sample from the quickstart page, it will come pre-populated with the **client ID** and **domain** for your application. If you clone the repo directly from Github, rename the `auth0-variables.js.example` file to `auth0-variables.js` and provide the **client ID** and **domain** there.

You should also provide the identifier for the API you create in the Auth0 dashboard as your `apiUrl`.


## Run the Application

[Start all root apps](../README.md#installation-steps) and the application will be served at `http://localhost:3091`.


## How this sample works

We are checking two things in local storage to detect if a user is logged in or not:

* `accessToken`: the Auth0 access token to access our desired API, which in this case is `https://oidc-sso-sample-api`
* `expirationDate`: the expiration date of this token, calculated using the `expires_in` response parameter after a successful authentication

If there is no valid access token present in local storage, the user is not logged in to our application, but they might have logged in via SSO to another application.
We can detect if this is the case by calling the `renewAuth` method of auth0.js, which will attempt to silently authenticate the user inside an iframe.

Silent authentication works in the same way as regular authentication (i.e. redirects the user to `/authorize`), but with some differences:

* A `prompt=none` parameter is added to the redirect to `/authorize`.
This causes Auth0 to return an error in case the user is not logged in via SSO instead of displaying a login page.
* The redirect happens inside an iframe to preserve our application's state.
* The callback URL of this request is set to [`callback-silent.html`](/app-spa/callback-silent.html), which is a dedicated page to handle the silent authentication callback.
This avoids loading your entire application again inside an iframe.

Two things can happen after a silent authentication request:

* The user did not have an active SSO session, so Auth0 calls back with an error (`error=login_required`)
* The user did have an active SSO session, so Auth0 calls back with an access token (`access_token=...&expires_in=...`)

In any case, the response from Auth0 is sent from the iframe back to the main page by using `postMessage`, which allows the main page to take action based on the outcome.
In this sample we are immediately redirecting the user to the login page by using the `authorize` method of auth0.js if silent authentication failed, or storing the token and its expiration date in local storage if it succeeded.