import app from "./app";

const port = Number(process.env.PORT ?? 3002);

app.listen(port, () => {
  console.log(`PetService listening on port ${port}`);
});
