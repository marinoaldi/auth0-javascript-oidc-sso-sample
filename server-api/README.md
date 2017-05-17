# Express Authorization for RS256-Signed Tokens

This sample demonstrates how to protect endpoints in an Express API by verifying an incoming JWT access token signed by Auth0. The token must be signed with the RS256 algorithm and must be verified against your Auth0 JSON Web Key Set.

## Getting Started

You must ensure that the APIs section is enabled in your Auth0 dashboard. To do so, go to the [Advanced Settings](https://manage.auth0.com/#/account/advanced) area and verify that **Enable APIs Section** is switched on.

Next, navigate to APIs in the sidebar and create a new API. The identifier for your API will be required later.

Add scope `read:messages` in **Api Section -> Scope Tab**

## Setup the `.env` File

Rename `.env.example` to `.env` and provide these values manually.

## Running the example

[Start all root apps](../README.md#installation-steps)

The API will be served at `http://localhost:3090`.

## Endpoints

The sample includes these endpoints:

**GET** /api/public
* An unprotected endpoint which returns a message on success. Does not require a valid JWT access token.

**GET** /api/private
* A protected endpoint which returns a message on success. Requires a valid JWT access token.

**GET** /api/private/admin
* A protected endpoint which returns a message on success. Requires a valid JWT access token with a `scope` of `read:messages`.
