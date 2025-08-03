import { useEffect, useState } from "react";
import { CheckIcon, ClipboardIcon } from "lucide-react";

import { Button } from "./button";

interface CodeProps {
  children: string;
}

export function Code({ children }: CodeProps) {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!hasCopied) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setHasCopied(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [hasCopied]);

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-0.5 right-0.5 z-10 bg-muted/80"
        onClick={async () => {
          await navigator.clipboard.writeText(children);
          setHasCopied(true);
        }}
        disabled={hasCopied}
      >
        <span className="sr-only">Copier</span>
        {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
      </Button>
      <code className="block rounded-md bg-muted px-3 py-3 font-mono text-xs outline-none">
        {children}
      </code>
    </div>
  );
}
