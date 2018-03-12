import EventEmitter from 'wolfy87-eventemitter';
// import PlayingAction from '../actions/PlayingAction';
import PlayingConstant from '../Constant/PlayingConstant';
import PlayingDispatcher from '../dispatcher/PlayingDispatcher';
import Event from '../Constant/EventConstants';

class PlayingStore extends EventEmitter {
  constructor() {
    super(...arguments);
    this.playing = {
      avtive_item: 0,
      // 0 : 结束
      // 1 : 开始
      // 2 : 暂停
      status: 0,
      kill: {
        killed_count: 0,
        total_count: 0
      }
    };

    this.registerDispatcher();
  }

  registerDispatcher() {
    PlayingDispatcher.register(action => {
      switch (action.actionType) {
        case PlayingConstant.PLAYING_ITEM_ACTIVE:
          this.setCurrentActiveItemIndex(action.index);
          this.trigger(Event.ACTIVE_INDEX_CHANGE, [action.index]);
          break;
        case PlayingConstant.KILL_CHANGED:
          this.setKill(action.killed);
          this.trigger(Event.KILL_CHANGED, [action.killed]);
          break;
        case PlayingConstant.clearAllData:
          this.clearAllData();
          this.trigger(Event.GAME_OVER, []);
          break;
        case PlayingConstant.CHANGE_STATUS:
          this.setStatus(action.statu);
          this.trigger(Event.STATUS_CHANGED, [action.statu]);
          break;
        default:
          break;
      }
    });
  }

  getCurrentActiveItemIndex() {
    return this.playing.avtive_item;
  }

  getDefaultConf() {
    return this.playing;
  }

  setCurrentActiveItemIndex(index) {
    this.playing.avtive_item = index;
  }

  setKill(killed) {
    this.playing.kill.total_count += 1;
    if (killed) {
      this.playing.kill.killed_count += 1;
    }
  }

  getAllKillCount() {
    return this.playing.kill.total_count;
  }

  getKilledCount() {
    return this.playing.kill.killed_count;
  }

  setStatus(statu) {
    this.playing.status = statu;
  }

  getCurrentStatu() {
    return this.playing.status;
  }

  clearAllData() {
    this.playing = {
      avtive_item: -1,
      kill: {
        killed_count: 0,
        total_count: 0
      }
    };
  }
}

export default new PlayingStore();
