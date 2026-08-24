ALTER TABLE "public"."meals"
ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

WITH ordered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY "type" ASC, "name" ASC, "id" ASC) AS rn
  FROM "public"."meals"
)
UPDATE "public"."meals" AS meals
SET "order" = ordered.rn
FROM ordered
WHERE meals.id = ordered.id;
