export * from '@/core/game/addons/interface';
export * from '@/core/game/addons/assassin';
export * from '@/core/game/addons/lady-of-lake';
export * from '@/core/game/addons/excalibur';

import type { TAddonsOptions } from '@/core/game/addons/interface';

import { AssassinAddon } from '@/core/game/addons/assassin';
import { LadyOfLakeAddon } from '@/core/game/addons/lady-of-lake';
import { ExcaliburAddon } from '@/core/game/addons/excalibur';

export type TAdditionalAddonsConstructor = typeof LadyOfLakeAddon | typeof ExcaliburAddon;
export type TRolesAddonsConstructor = typeof AssassinAddon;

export type TRolesAddonsKeys = 'assassin';

export type TAdditionalAddonsKeys = 'ladyOfLake' | 'excalibur';

export type TRolesAddonsData = {
  key: TRolesAddonsKeys;
  addon: TRolesAddonsConstructor;
  options?: TAddonsOptions;
};

export type TAdditionalAddonsData = {
  key: TAdditionalAddonsKeys;
  addon: TAdditionalAddonsConstructor;
};
