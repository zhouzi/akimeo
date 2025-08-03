import { useState } from "react";
import { Button } from "@akimeo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@akimeo/ui/components/card";
import { Code } from "@akimeo/ui/components/code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@akimeo/ui/components/dialog";
import { Link } from "@akimeo/ui/components/link";
import { createFileRoute, notFound, useLocation } from "@tanstack/react-router";
import { Calendar, FileCode, Handshake, HeartHandshake } from "lucide-react";

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

const EMBED_CHOICES = [
  {
    icon: Handshake,
    label: "En marque blanche",
    description: "Aux couleurs de ton entreprise et sans mention de Akimeo.",
    component: ({ onCancel }: { onCancel: () => void }) => (
      <div className="space-y-4">
        <p>
          Discutons de ton besoin pour mettre à ta disposition une version en
          marque blanche et à tes couleurs.
        </p>
        <div className="flex items-center gap-2">
          <Button asChild>
            <a
              href="https://go.gabin.app/calendar"
              target="_blank"
              rel="noreferrer"
            >
              <Calendar />
              <span>Prendre rendez-vous</span>
            </a>
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Retour
          </Button>
        </div>
      </div>
    ),
  },
  {
    icon: HeartHandshake,
    label: "En créditant Akimeo",
    description:
      "Aux couleurs de Akimeo et avec le crédit en bas du simulateur.",
    component: function EmbedWithCredit() {
      const pathname = useLocation({
        select: (location) => `${location.pathname}${location.searchStr}`,
      });
      const code = `<script src="${new URL("/iframe.js", "https://simulateurs.akimeo.xyz")}" data-simulateur="${pathname}"></script>`;

      return (
        <div className="space-y-6">
          <ol className="list-decimal space-y-2 pl-4 [&>li]:space-y-1">
            <li>
              <p>Copie le code d'intégration :</p>
              <Code>{code}</Code>
            </li>
            <li>
              Colle le où tu souhaites afficher le simulateur... et c'est tout.
            </li>
          </ol>
          <div className="space-y-2">
            <p className="text-lg font-medium">Guides d'intégration</p>
            <div className="grid gap-2 @sm/dialog-content:grid-cols-3">
              {[
                {
                  label: "WordPress",
                  logo: "/assets/logo-wordpress.webp",
                  href: "https://akimeo.xyz/docs/simulateurs/integrations/wordpress",
                },
                {
                  label: "Framer",
                  logo: "/assets/logo-framer.webp",
                  href: "https://akimeo.xyz/docs/simulateurs/integrations/framer",
                },
                {
                  label: "Circle",
                  logo: "/assets/logo-circle.webp",
                  href: "https://akimeo.xyz/docs/simulateurs/integrations/circle",
                },
              ].map(({ label, logo, href }) => (
                <Button
                  key={label}
                  variant="outline"
                  className="h-auto flex-col"
                  asChild
                >
                  <a href={href} target="_blank" rel="noreferrer">
                    <span className="flex size-[80px] items-center justify-center">
                      <img src={logo} alt="" />
                    </span>
                    <span>{label}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      );
    },
  },
];

function EmbedDialogContent() {
  const [selectedChoiceLabel, setSelectedChoiceLabel] = useState<string | null>(
    null,
  );
  const selectedChoice = EMBED_CHOICES.find(
    (choice) => choice.label === selectedChoiceLabel,
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Tu veux ajouter ce simulateur à ton site ?</DialogTitle>
        <DialogDescription>
          Les simulateurs Akimeo s'intègrent très simplement dans toutes les
          plateformes de contenus comme WordPress, HubSpot, Ghost, etc.
        </DialogDescription>
      </DialogHeader>
      {selectedChoice ? (
        <selectedChoice.component
          onCancel={() => setSelectedChoiceLabel(null)}
        />
      ) : (
        <div className="grid gap-2">
          <div className="grid gap-2 @sm/dialog-content:grid-cols-2">
            {EMBED_CHOICES.map((choice) => (
              <Button
                key={choice.label}
                variant="outline"
                className="flex h-auto items-start gap-2 text-left whitespace-normal"
                onClick={() => setSelectedChoiceLabel(choice.label)}
              >
                <choice.icon className="translate-y-0.5" />
                <span className="grid flex-1">
                  <span>{choice.label}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {choice.description}
                  </span>
                </span>
              </Button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Tu as besoin d'un simulateur sur-mesure ?{" "}
            <Link asChild>
              <a
                href="https://go.gabin.app/linkedin"
                target="_blank"
                rel="noreferrer"
              >
                Faisons connaissance 😉
              </a>
            </Link>
          </p>
        </div>
      )}
    </DialogContent>
  );
}

function RouteComponent() {
  const params = Route.useParams();
  const simulateur = simulateurs.find(
    (otherSimulateur) => otherSimulateur.slug === params.slug,
  )!;

  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{simulateur.title}</CardTitle>
        <CardDescription>{simulateur.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <simulateur.simulateur />
      </CardContent>
      <CardFooter className="@container/footer justify-between border-t p-2!">
        <div className="flex items-center gap-2">
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
          <p className="hidden text-sm text-muted-foreground @lg/footer:block">
            Les simulateurs qui parlent le langage des indépendants.
          </p>
        </div>
        <Dialog onOpenChange={setEmbedDialogOpen} open={embedDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="size-8">
              <FileCode />
            </Button>
          </DialogTrigger>
          {embedDialogOpen && <EmbedDialogContent />}
        </Dialog>
      </CardFooter>
    </Card>
  );
}
