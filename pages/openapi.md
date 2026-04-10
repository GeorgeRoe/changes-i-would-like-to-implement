---
layout: section
---

# OpenAPI

---

<div class="h-120 overflow-y-scroll">

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "Example User API",
    "version": "1.0.0"
  },
  "paths": {
    "/users/{id}": {
      "get": {
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "User found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "id",
                    "name"
                  ],
                  "properties": {
                    "id": {
                      "type": "string"
                    },
                    "name": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "User not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

</div>

---

<div class="h-120 overflow-y-scroll">

```ts
export interface paths {
  "/users/{id}": {
    get: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** User found */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
            };
          };
        };
        /** User not found */
        404: {
          content: {
            "application/json": {
              error: string;
            };
          };
        };
      };
    };
  };
}
```

</div>

---

```ts
const { data, error } = await useFetch(`/users/${userId}`, {
  method: "GET",
})

// the variable data is typed here automatically
```

---

## Links

- [OpenApi Specification](https://swagger.io/specification/)
- [OpenApi TypeScript](https://openapi-ts.dev/introduction)