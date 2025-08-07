import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useState } from "react";

const FREQUENCE = {
  annuelle: {
    label: "/ an",
    value: "annuelle" as const,
  },
  mensuelle: {
    label: "/ mois",
    value: "mensuelle" as const,
  },
};
const FREQUENCE_OPTIONS = Object.values(FREQUENCE);

type Frequence = (typeof FREQUENCE)[keyof typeof FREQUENCE]["value"];

interface FrequenceToggleProps {
  value: number;
  children: (props: {
    label: string;
    value: number;
    serialize: (value: number, n?: number) => number;
    deserialize: (value: number, n?: number) => number;
    frequence: Frequence;
    setFrequence: Dispatch<SetStateAction<Frequence>>;
    toggleFrequence: () => void;
  }) => ReactNode;
}

export function FrequenceToggle({ value, children }: FrequenceToggleProps) {
  const [frequence, setFrequence] = useState<Frequence>(
    FREQUENCE.annuelle.value,
  );

  const toggleFrequence = () =>
    setFrequence((frequence) =>
      frequence === FREQUENCE.annuelle.value
        ? FREQUENCE.mensuelle.value
        : FREQUENCE.annuelle.value,
    );

  const serialize = (value: number, n = 12) =>
    frequence === FREQUENCE.annuelle.value ? value : value / n;
  const deserialize = (value: number, n = 12) =>
    frequence === FREQUENCE.annuelle.value ? value : value * n;

  return children({
    label: FREQUENCE_OPTIONS.find((option) => option.value === frequence)!
      .label,
    value: serialize(value),
    serialize,
    deserialize,
    frequence,
    setFrequence,
    toggleFrequence,
  });
}
