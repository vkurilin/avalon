import { IGameAddon } from '@/core/game/addons/interface';
import { Game } from '@/core/game';
import { SwitchResult } from '@/core/game/addons/excalibur/switch-result';
import { TMissionResult } from '@avalon/types';

export class ExcaliburAddon implements IGameAddon {
  addonName = 'excalibur';
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  afterInit() {
    // On give excalibur leader should select player
    this.game.selectAvailable.giveExcalibur = (player) => Boolean(player.features.isLeader);

    // On use excalibur user with excalibur should select player
    this.game.selectAvailable.useExcalibur = (player) => Boolean(player.features.excalibur);

    return true;
  }

  afterSentTeam() {
    this.game.leader.features.waitForAction = true;
    this.game.stage = 'giveExcalibur';
    this.game.stateObserver.gameStateChanged();

    return false;
  }

  afterVoteForTeam() {
    if (this.game.stage !== 'onMission') {
      this.game.players.forEach((player) => (player.features.excalibur = false));
    }

    return true;
  }

  beforeEndMission() {
    const playerWithExcalibur = this.game.players.find((player) => player.features.excalibur)!;
    playerWithExcalibur.features.waitForAction = true;

    this.game.stage = 'useExcalibur';
    this.game.stateObserver.gameStateChanged();

    return false;
  }

  giveExcalibur(executorID: string) {
    if (this.game.stage !== 'giveExcalibur') {
      throw new Error(`You cant give excalibur on stage ${this.game.stage}`);
    }

    if (this.game.leader.user.id !== executorID) {
      throw new Error('Only leader can give excalibur');
    }

    if (this.game.selectedPlayers.length !== 1) {
      throw new Error('Only one player can get excalibur');
    }

    const selectedPlayer = this.game.selectedPlayers[0];

    if (selectedPlayer === this.game.leader) {
      throw new Error('You cant give excalibur to your self');
    }

    if (!selectedPlayer.features.isSent) {
      throw new Error('You cant give excalibur to player outside of mission');
    }

    selectedPlayer.features.excalibur = true;
    selectedPlayer.features.isSelected = false;

    this.game.sentTeamNextStage();
    this.game.stateObserver.gameStateChanged();
  }

  useExcalibur(executorID: string) {
    if (this.game.stage !== 'useExcalibur') {
      throw new Error(`You cant give excalibur on stage ${this.game.stage}`);
    }

    const ownerOfExcalibur = this.game.players.find((player) => player.features.excalibur)!;

    if (ownerOfExcalibur.user.id !== executorID) {
      throw new Error('Only owner of excalibur can use it');
    }

    if (this.game.selectedPlayers.length > 1) {
      throw new Error('Excalibur can be used only on one player');
    }

    const selectedPlayer = this.game.selectedPlayers[0];

    let switchResult: TMissionResult | undefined;

    if (selectedPlayer) {
      const mission = this.game.currentMission;

      switchResult = mission.switchAction(selectedPlayer, ownerOfExcalibur);
      mission.finishMission();

      selectedPlayer.features.isSelected = false;
    }

    const switchHistory = new SwitchResult(ownerOfExcalibur, selectedPlayer, switchResult);

    this.game.history.push(switchHistory);

    ownerOfExcalibur.features.excalibur = false;
    ownerOfExcalibur.features.waitForAction = false;

    this.game.finishMission();

    this.game.stateObserver.gameStateChanged();
  }
}
