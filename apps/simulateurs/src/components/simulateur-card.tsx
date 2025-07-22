import type { CardProps } from "@akimeo/ui/components/card";
import { useEffect, useState } from "react";
import { Button } from "@akimeo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@akimeo/ui/components/card";
import { cn } from "@akimeo/ui/lib/utils";

interface SimulateurCardProps extends CardProps {
  title: string;
  description: string;
}

export function SimulateurCard({
  title,
  description,
  children,
  className,
  ...props
}: SimulateurCardProps) {
  const [url, setUrl] = useState("https://akimeo.xyz/docs/simulateurs");

  useEffect(() => {
    setUrl(
      `https://akimeo.xyz/docs/simulateurs/simulateurs/${window.location.pathname.slice(1)}`,
    );
  }, []);

  return (
    <Card {...props} className={cn("shadow-none", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="gap-2 border-t p-2!">
        <Button variant="outline" size="sm" asChild>
          <a href={url} target="_blank">
            <span className="font-heading font-black tracking-wide italic">
              akimeo
            </span>
          </a>
        </Button>
        <p className="text-muted-foreground text-sm">
          Les simulateurs qui parlent le langage des indépendants.
        </p>
      </CardFooter>
    </Card>
  );
}
