const app = require('./config/server');
app.use('/', require('./app/rutas/glamfinds'));
const PORT = app.get("puerto") || 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});