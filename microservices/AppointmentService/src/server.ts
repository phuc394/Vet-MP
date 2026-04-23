import app from "./app";

const port = Number(process.env.PORT ?? 3005);

app.listen(port, () => {
  console.log(`AppointmentService listening on port ${port}`);
});
