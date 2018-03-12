import PlayingDispatcher from '../dispatcher/PlayingDispatcher';
import PlayingConstant from '../Constant/PlayingConstant';

const PlayingAction = {
  setCurrentActive: function(index) {
    PlayingDispatcher.dispatch({
      actionType: PlayingConstant.PLAYING_ITEM_ACTIVE,
      index: index
    });
  },

  setKill: function(killed) {
    PlayingDispatcher.dispatch({
      actionType: PlayingConstant.KILL_CHANGED,
      killed: killed
    });
  },

  gameOver: function() {
    PlayingDispatcher.dispatch({
      actionType: PlayingConstant.CLEAR_ALL_DATA
    });
  },

  setStatu: function(statu) {
    PlayingDispatcher.dispatch({
      actionType: PlayingConstant.CHANGE_STATUS,
      statu: statu
    });
  }
};

export default PlayingAction;
