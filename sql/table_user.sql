CREATE TABLE IF NOT EXISTS "lmg_user" (
    "id" SERIAL PRIMARY KEY,
    "first_name" varchar(255) NOT NULL, 
    "last_name" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL,
    "current_position" varchar(255) DEFAULT NULL,
    "create_time" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" datetime DEFAULT NULL
)
```