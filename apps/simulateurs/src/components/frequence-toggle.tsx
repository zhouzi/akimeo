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
    value: number;
    label: string;
    frequence: Frequence;
    setFrequence: Dispatch<SetStateAction<Frequence>>;
    toggleFrequence: () => void;
  }) => ReactNode;
}

export function FrequenceToggle({ value, children }: FrequenceToggleProps) {
  const [frequence, setFrequence] = useState<Frequence>(
    FREQUENCE.annuelle.value,
  );

  return children({
    label: FREQUENCE_OPTIONS.find((option) => option.value === frequence)!
      .label,
    value: frequence === FREQUENCE.annuelle.value ? value : value / 12,
    frequence,
    setFrequence,
    toggleFrequence: () =>
      setFrequence((frequence) =>
        frequence === FREQUENCE.annuelle.value
          ? FREQUENCE.mensuelle.value
          : FREQUENCE.annuelle.value,
      ),
  });
}
