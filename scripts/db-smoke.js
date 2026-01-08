const { execute } = require("../src/db/query");

(async () => {
  const [rows] = await execute("SELECT 1 AS ok");
  console.log(rows);
  process.exit(0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
