# IoTLogic HTTP API

# Database Schema

## User

- username
- password
- email
- isAdmin

TODO: Should support two-factor authentication

## Device

- user
- name
- alias
- type
- data
- token

## Document

- user
- name
- state
- payload
- payloadTemp
- devices
- visibility

# API

## User

### Lookup

`GET /api/user`

Result: 401, 200

### Register

`POST /api/user/register`

Result: 400, 409, 200

### Login

`POST /api/user/login`

Result: 400, 401, 200

### Logout

`DELETE /api/user`

Result: 401, 200

### Change password

`POST /api/user/password`

Result: 400, 401, 200

### Deactivate

`POST /api/user/deactivate`

Result: 400, 401, 403, 200

## Device

### List

`GET /api/devices`

Result: 401, 200

### Delete

`DELETE /api/devices/:name`

Result: 401, 404, 409, 200

### Update, Create

`PUT /api/devices/:name`

Result: 400, 401, 404, 409, 200

TODO: This is not RESTful

### Recreate token

`POST /api/devices/:name/token`

Result: 400, 401, 404, 200

### Status

`GET /api/devices/:name`

Result: 401, 404, 200

## Document

### List

`GET /api/documents`

Result: 401, 200

### Get

`GET /api/documents/:id`

Result: 404, 200

### Create

`POST /api/documents`

Result: 400, 401, 200

### Delete

`DELETE /api/documents/:id`

Result: 400, 401, 404, 200

### Update

`POST /api/documents/:id`

Result: 400, 401, 404, 200

### Commit

`POST /api/documents/:id/commit`

Result: 400, 401, 404, 200

### Set visibility

`POST /api/documents/:id/visibility`

Result: 400, 401, 404, 200

### Get status

`GET /api/documents/:id/status`

Result: 401, 404, 200

### Set status

`POST /api/documents/:id/status`

Result: 400, 401, 404, 200

### View log

`GET /api/documents/:id/log`

Result: 400, 401, 404, 200

### Clear log

`DELETE /api/documents/:id/log`

Result: 401, 404, 200
