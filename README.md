# NodeJs-Example

## MinIO_NodeJs_Exampl
**Description:** Upload image to MinIO-Server using NodeJS \
**Build docker-compose.yml** \
`docker compose up -d --build`

**API:**

- Upload image
  - url: http://localhost:8888/api/upload-image
  - method: POST
  - body: file (form-data)
- Get image
  - url: http://localhost:8888/api/get-image
  - method: GET
  - param: path (filename)
- Delete image
  - url: http://localhost:8888/api/delete-image
  - method: DELETE
  - param: path (filename)
