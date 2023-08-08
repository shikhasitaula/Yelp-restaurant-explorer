
CREATE TABLE IF NOT EXISTS "restaurant_metadata" (
"id" TEXT NOT NULL PRIMARY KEY,
  "alias" TEXT,
  "name" TEXT,
  "image_url" TEXT,
  "url" TEXT,
  "review_count" INTEGER,
  "rating" REAL,
  "price" TEXT,
  "phone" REAL,
  "latitude" REAL,
  "longitude" REAL,
  "state" TEXT,
  "city" TEXT
);

CREATE TABLE IF NOT EXISTS "restaurant_cuisine" (
  "id" TEXT,
  "cuisines" TEXT
  PRIMARY KEY("id", "cuisines")
);