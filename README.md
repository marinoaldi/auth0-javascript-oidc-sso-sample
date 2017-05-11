# Auth0 Vanilla Javascript - OIDC Single Sign-on Sample

This sample is a mix of:
- **Auth0 JavaScript Samples** https://github.com/auth0-samples/auth0-javascript-samples
- **OIDC Single Sign-on Sample** https://github.com/auth0-samples/oidc-sso-sample
- **Auth0 Express API Samples** https://github.com/auth0-samples/auth0-express-api-samples

This sample demonstrates how to:
- Add **authentication** to a Javascript application with Auth0. The sample makes use of Auth0's hosted login page which provides centralized authentication.
- Add **silent authentication** (renewAuth) to a Javascript application with Auth0.
- Get a **user's profile** using Auth0 in a JavaScript application.
- Include **user authorization** in a JavaScript application with Auth0.
- Make secure **calls to an API** after authenticating a user with Auth0. The calls to the API are made with the user's access_token.

## Structure

In this example, we have 3 applications:

* [**server-api:**](server-api/README.md) Express Server API [`localhost:3090`](http://localhost:3090)
* [**app-spa:**](app-spa/README.md) Vanilla Single-Page App [`localhost:3091`](http://localhost:3091)
* [**app-mpa:**](app-mpa/README.md) Vanilla Multi-Page App [`localhost:3092`](http://localhost:3092)

Each application has its own folder in this repository with its own instructions on how to configure and run it.

## Screenshots

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


