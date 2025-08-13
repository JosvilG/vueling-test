# ¿Qué se hizo?
## Refactor de la UI en componentes reutilizables
app-header - Header reutilizable y presente en todas las pantallas
app-footer - Footer reutilizable y presente en toddas las pantallas (links + redes, pegado abajo / sticky).
app-side-menu - Menú lateral con items por defecto y navegación por routerLink.
app-airport-card - Tarjeta reutilizable accesible con click/Enter/Espacio.
app-loader - Loader personalizado durante la carga de la información
app-error - Pantalla de error genérica

## Tipografía y estilos
Fuente Nunito aplicada a toda la app.
Variables SCSS globales para tamaños (12/14/16/24) y weights (400/700).
Ajustes Material: uso de Nunito en componentes Material.

## Estructura y navegación
Routing simple y estable:
/airportsList → lista de aeropuertos.
/airports/:code → detalle de aeropuerto.
Redirección desde / a /airportsList.
NavigationService con atajos (toAirportsList, toAirportDetail, back, etc.).
Scroll suave al top en cada navegación.

## Lista de aeropuertos
Refactor: la lista usa app-airport-card y trackBy.
Layout responsive y estados (loading/error).
Detalle de aeropuerto
Página AirportDetailComponent que carga por :code (ej. /airports/BCN).
Muestra name, key, city, country y (si existen) owner, build, image.

## Textos de sección externos
assets/dummy-texts.json con sectionTitle y sectionDescription (con HTML permitido).
Carga + saneado con DomSanitizer ([innerHTML]).

## Stubby / consumo de API local
Endpoints del stub (requieren header securityKey):
GET /allAirports
POST /airport con body { "key": "IATA" }
Servicio AirportsListService consumiendo estos endpoints.
Interceptor de seguridad. Añadido securityKey a todas las peticiones.

## Tests Unitarios
Creados test unitarios para todos los nuevos componentes

## Nuevos comandos
Se ha creado un nuevo comando para levantar con solo el uso de un comando stubb y la aplicación
Puedes usar npm run dev-start para ello