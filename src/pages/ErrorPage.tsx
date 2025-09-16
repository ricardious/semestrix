import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import routesConstants from "@lib/constants/routeConstants";

const ErrorPage = () => {
  const error = useRouteError();
  let errorMessage: string;
  let errorStatus: number | string = "Oops!";

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || "Página no encontrada.";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = "Ha ocurrido un error inesperado.";
  }

  return (
    <div
      id="error-page"
      className="flex h-screen flex-col items-center justify-center gap-8"
    >
      <h1 className="text-4xl font-bold">{errorStatus}</h1>
      <p className="text-xl">Lo sentimos, algo salió mal.</p>
      <p className="text-slate-500">
        <i>{errorMessage}</i>
      </p>
      <Link to={routesConstants.ROOT} className="text-primary hover:underline">
        Volver al Inicio
      </Link>
    </div>
  );
};

export default ErrorPage;
