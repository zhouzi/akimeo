import { useEffect } from "react";
import { useAkimeoEmbedBus } from "@akimeo/embed/use-akimeo-embed-bus";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import Plausible from "plausible-tracker";

export const Route = createRootRoute({
  component: RouteComponent,
});

function RouteComponent() {
  useAkimeoEmbedBus();

  useEffect(() => {
    const { hostname } = window.location;

    if (hostname.includes("localhost")) {
      return;
    }

    const plausible = Plausible({
      domain: hostname,
      apiHost: "https://simulateurs.akimeo.xyz",
    });

    plausible.enableAutoPageviews();

    // This should not be necessary, but there's a bug in plausible-tracker
    // https://github.com/plausible/plausible-tracker/issues/71
    window.plausible = plausible.trackEvent;
  }, []);

  return <Outlet />;
}
