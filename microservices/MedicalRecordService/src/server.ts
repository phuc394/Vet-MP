import app from "./app";

const port = Number(process.env.PORT ?? 3006);

app.listen(port, () => {
  console.log(`MedicalRecordService listening on port ${port}`);
});
