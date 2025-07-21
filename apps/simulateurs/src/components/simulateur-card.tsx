import type { CardProps } from "@akimeo/ui/card";
import { useEffect, useState } from "react";
import { buttonStyles } from "@akimeo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@akimeo/ui/card";
import { Link } from "react-aria-components";

interface SimulateurCardProps extends CardProps {
  title: string;
  description: string;
}

export function SimulateurCard({
  title,
  description,
  children,
  ...props
}: SimulateurCardProps) {
  const [url, setUrl] = useState("https://akimeo.xyz/docs/simulateurs");

  useEffect(() => {
    setUrl(`https://akimeo.xyz/docs/simulateurs/${window.location.pathname}`);
  }, []);

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Link
          href={url}
          target="_blank"
          className={buttonStyles({
            variant: "outline",
            size: "sm",
          })}
        >
          <span className="font-heading font-black tracking-wide italic">
            akimeo
          </span>
        </Link>
        <p>Pilotez votre activité plus efficacement.</p>
      </CardFooter>
    </Card>
  );
}
