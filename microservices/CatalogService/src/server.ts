import app from "./app";

const port = Number(process.env.PORT ?? 3003);

app.listen(port, () => {
  console.log(`CatalogService listening on port ${port}`);
});
