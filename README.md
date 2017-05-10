# Auth0 Vanilla Javascript - OIDC Single Sign-on Sample / Authorization (Silent Authentication) 

This sample is a mix of:
- [OIDC Single Sign-on Sample](https://github.com/auth0-samples/oidc-sso-sample)
- [Auth0 JavaScript Samples - 04-Calling-an-API](https://github.com/auth0-samples/auth0-javascript-samples)

## Structure

In this example, we have 3 applications:

* **api:** API Express server - http://localhost:3090
* **app-spa:** vanilla Single-Page App - http://localhost:3091
* **app-mpa:** vanilla Multi-Page App - http://localhost:3092 _[In Progress]_


_Home Screen - Signed Out_
![Home Screen - Signed Out](/screen-home-signed-out.png?raw=true)

_Home Screen - Signed In_
![Home Screen - Signed In](/screen-home-signed-in.png?raw=true)

_API Call_
![API Call](/screen-api-call.png?raw=true)


## Installation Steps

Clone repository.

```bash
git clone https://github.com/marinoaldi/auth0-javascript-oidc-sso-sample.git
```

Run the following commands: 

```bash
cd auth0-javascript-oidc-sso-sample
npm install
npm start
```

# OIDC Single Sign-on Sample https://github.com/auth0-samples/oidc-sso-sample

## Prerequisites

1. Go to https://manage.auth0.com/#/clients and create a single-page application client with OIDC Conformant mode enabled
2. Add `http://localhost:3000` and `http://localhost:3000/callback-silent.html` as allowed callback URLs
3. Enter your Auth0 domain and client ID in the [`auth0-variables.js`](/app-spa/auth0-variables.js) file.

## Running the sample

To start the sample, start a web server in the root of this repository at port 3000, or just run:

```sh
make
```

and then browse to [http://localhost:3000](http://localhost:3000).

## How this sample works

We are checking two things in local storage to detect if a user is logged in or not:

* `accessToken`: the Auth0 access token to access our desired API, which in this case is `/userinfo`
* `expirationDate`: the expiration date of this token, calculated using the `expires_in` response parameter after a successful authentication

If there is no valid access token present in local storage, the user is not logged in to our application, but they might have logged in via SSO to another application.
We can detect if this is the case by calling the `renewAuth` method of auth0.js, which will attempt to silently authenticate the user inside an iframe.

Silent authentication works in the same way as regular authentication (i.e. redirects the user to `/authorize`), but with some differences:

* A `prompt=none` parameter is added to the redirect to `/authorize`.
This causes Auth0 to return an error in case the user is not logged in via SSO instead of displaying a login page.
* The redirect happens inside an iframe to preserve our application's state.
* The callback URL of this request is set to [`callback.html`](/app-spa/callback.html), which is a dedicated page to handle the silent authentication callback.
This avoids loading your entire application again inside an iframe.

Two things can happen after a silent authentication request:

* The user did not have an active SSO session, so Auth0 calls back with an error (`error=login_required`)
* The user did have an active SSO session, so Auth0 calls back with an access token (`access_token=...&expires_in=...`)

In any case, the response from Auth0 is sent from the iframe back to the main page by using `postMessage`, which allows the main page to take action based on the outcome.
In this sample we are immediately redirecting the user to the login page by using the `authorize` method of auth0.js if silent authentication failed, or storing the token and its expiration date in local storage if it succeeded.



# Auth0 JavaScript Authorization https://github.com/auth0-samples/auth0-javascript-samples/tree/master/05-Authorization

This sample demonstrates how to include user authorization in a JavaScript application with Auth0.

## Getting Started

If you haven't already done so, [sign up](https://auth0.com) for your free Auth0 account and create a new client in the [dashboard](https://manage.auth0.com). Find the **domain** and **client ID** from the settings area and add the URL for your application to the **Allowed Callback URLs** box. If you are serving the application with the provided `serve` library, that URL is `http://localhost:3000`.

You must ensure that the APIs section is enabled in your Auth0 dashboard. To do so, go to the [Advanced Settings](https://manage.auth0.com/#/account/advanced) area and verify that **Enable APIs Section** is switched on. Next, navigate to APIs in the sidebar and create a new API. The identifier for your API will be required later.

Clone the repo or download it from the JavaScript quickstart page in Auth0's documentation.

```bash
cd 05-Authorization
npm install
```

## Set the Client ID, Domain, and API URL

If you download the sample from the quickstart page, it will come pre-populated with the **client ID** and **domain** for your application. If you clone the repo directly from Github, rename the `auth0-variables.js.example` file to `auth0-variables.js` and provide the **client ID** and **domain** there.

You should also provide the identifier for the API you create in the Auth0 dashboard as your `apiUrl`.

## Set Up the `.env` File

In addition to the above-mentioned `auth0-variables.js` file, a `.env` file is provided at the root of the application. This file provides your application's credentials to the small Node server located in `server.js`.

This file has two values, `AUTH0_AUDIENCE` and `AUTH0_DOMAIN`. If you download this sample from the quickstart page, the value for `AUTH0_DOMAIN` will be populated automatically, but you will still need to populate `AUTH0_AUDIENCE` manually. The value for `AUTH0_AUDIENCE` is the identifier used for an API that you create in the Auth0 dashboard.

## Run the Application

The `serve` module provided with this sample can be run with the `start` command.

```bash
npm start
```

The application will be served at `http://localhost:3000`.

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free Auth0 account

1. Go to [Auth0](https://auth0.com/signup) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.


