import { createFileRoute, notFound } from "@tanstack/react-router";

import simulateurs from "~/simulateurs";

export const Route = createFileRoute("/o/akimeo/s/$slug")({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    const simulateur = simulateurs.find(
      (otherSimulateur) => otherSimulateur.slug === params.slug,
    );

    if (simulateur == null) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
  },
});

function RouteComponent() {
  const params = Route.useParams();
  const simulateur = simulateurs.find(
    (otherSimulateur) => otherSimulateur.slug === params.slug,
  )!;

  return <simulateur.simulateur />;
}
