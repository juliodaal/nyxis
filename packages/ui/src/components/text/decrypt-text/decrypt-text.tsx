'use client';

import { ScrambleText, type ScrambleTextProps } from '../scramble-text/scramble-text.js';

const KATAKANA =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ0123456789';

export type DecryptTextProps = Omit<ScrambleTextProps, 'alphabet'> & {
  /** Alphabet override; defaults to katakana for a Matrix vibe. */
  alphabet?: string;
};

/**
 * Variant of `ScrambleText` that uses a katakana alphabet by default for
 * a Matrix-style decryption look. Same API as `ScrambleText`.
 */
export function DecryptText({ alphabet = KATAKANA, ...rest }: DecryptTextProps) {
  return <ScrambleText {...rest} alphabet={alphabet} />;
}
