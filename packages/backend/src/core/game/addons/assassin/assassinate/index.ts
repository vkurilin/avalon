import type { HistoryElement, THistoryData } from '@/core/game/history';
import type { THistoryStage, TAssassinateType } from '@avalon/types';
import type { IPlayerInGame } from '@/core/game';
import type { TAssassinateValidator } from '@/core/game/addons/assassin/interface';

export class Assassinate implements HistoryElement<'assassinate'> {
  type = 'assassinate' as const;
  data: THistoryData['assassinate'];
  stage: THistoryStage;
  validator: TAssassinateValidator;

  constructor(assassin: IPlayerInGame, type: TAssassinateType, validator: TAssassinateValidator) {
    this.data = {
      assassin: assassin,
      assassinateType: type,
    };

    this.validator = validator;
    this.stage = 'progress';
  }

  assassinatePlayers(victims: IPlayerInGame[]) {
    const result = victims.every((victim) => this.validator.some((el) => el(victim))) ? 'hit' : 'miss';
    this.data.result = result;
    this.data.killed = victims;

    this.stage = 'finished';

    return result;
  }

  dataForManager() {
    return {
      type: this.type,
      assassinateType: this.data.assassinateType,
      result: this.data.result!,
      assassinID: this.data.assassin.user.id,
      killedIDs: this.data.killed!.map((player) => player.user.id),
    };
  }
}
