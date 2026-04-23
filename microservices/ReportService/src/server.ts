import app from "./app";

const port = Number(process.env.PORT ?? 3007);

app.listen(port, () => {
  console.log(`ReportService listening on port ${port}`);
});
