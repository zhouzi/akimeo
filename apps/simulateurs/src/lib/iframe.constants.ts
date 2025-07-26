// Ce fichier est importé par le script qui permet d'intégrer un simulateur sur un site tiers
// Il ne doit rien importer, pour le garder aussi léger que possible

export const RESIZE_EVENT_TYPE = "akimeo:resize-height";

export interface ResizeEvent {
  type: typeof RESIZE_EVENT_TYPE;
  payload: {
    height: number;
    scrollIntoView: boolean;
  };
}
