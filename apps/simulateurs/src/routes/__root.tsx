import { useEffect } from "react";
import { useEventBusEmitter } from "@akimeo/embed/react/use-event-bus-emitter";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import Plausible from "plausible-tracker";

export const Route = createRootRoute({
  component: RouteComponent,
});

function RouteComponent() {
  useEventBusEmitter();

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
