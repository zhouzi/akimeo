import { Button } from "@akimeo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@akimeo/ui/components/card";
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

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{simulateur.title}</CardTitle>
        <CardDescription>{simulateur.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <simulateur.simulateur />
      </CardContent>
      <CardFooter className="gap-2 border-t p-2!">
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://akimeo.xyz/docs/simulateurs/simulateurs/${simulateur.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="font-heading font-black tracking-wide italic">
              akimeo
            </span>
          </a>
        </Button>
        <p className="text-sm text-muted-foreground">
          Les simulateurs qui parlent le langage des indépendants.
        </p>
      </CardFooter>
    </Card>
  );
}
