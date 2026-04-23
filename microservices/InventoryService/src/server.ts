import app from "./app";

const port = Number(process.env.PORT ?? 3004);

app.listen(port, () => {
  console.log(`InventoryService listening on port ${port}`);
});
