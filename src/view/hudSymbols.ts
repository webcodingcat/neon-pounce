// Which symbols the HUD shows, without any drawing.

export type DiscardSymbol = 'discard' | 'giveUp';

/** With an empty stock the HUD shows the give-up symbol instead (A28). */
export function discardSymbol(discards: number): DiscardSymbol {
  return discards > 0 ? 'discard' : 'giveUp';
}
