import React from 'react';
import './sass/playing.css';
import PlayingStore from './store/PlayingStore';
import EVENT from './Constant/EventConstants';
import PlayingAction from './actions/PlayingAction';

class PlayingController extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      playing: {},
      columns: 4,
      rows: 4,
      tickId: 0,
      statu: 0
    };

    this.handlerStatuChanged = this.handlerStatuChanged.bind(this);
    this.handlerGameoverEvent = this.handlerGameoverEvent.bind(this);
  }
  render() {
    return (
      <PlayingPanel
        onStartClick={() => this.handlerStartClick()}
        onStopClick={() => this.handlerStopClick()}
        onGameOverClick={() => this.handlerGameOverClick()}
        rowsLength={this.state.rows}
        columnsLength={this.state.columns}
        activeCell={this.state.playing.avtive_item}
        currentStatu={this.state.statu}
      />
    );
  }

  handlerStatuChanged() {
    this.setState({ statu: PlayingStore.getCurrentStatu() });
  }

  handlerStartClick() {
    this.setState({ playing: PlayingStore.getDefaultConf() });
    PlayingAction.setStatu(1);
    this.setintervalActive();
  }

  handlerStopClick() {
    let tid = this.state.tickId;
    this.setState({ tickId: 0 });
    PlayingAction.setStatu(2);
    clearInterval(tid);
  }

  handlerGameOverClick() {
    let tid = this.state.tickId;
    this.setState({ tickId: 0 });
    clearInterval(tid);
    PlayingAction.gameOver();
  }

  handlerGameoverEvent() {
    PlayingAction.setStatu(0);
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
  setintervalActive() {
    let id = setInterval(() => {
      PlayingAction.setCurrentActive(
        this.getRandomInt(0, this.state.columns * this.state.rows)
      );
    }, 1000);

    this.setState({ tickId: id });
  }

  componentDidMount() {
    PlayingStore.on(EVENT.STATUS_CHANGED, this.handlerStatuChanged);
    PlayingStore.on(EVENT.GAME_OVER, this.handlerGameoverEvent);
  }

  componentWillUnmount() {
    PlayingStore.off(EVENT.STATUS_CHANGED, this.handlerStatuChanged);
    PlayingStore.off(EVENT.GAME_OVER, this.handlerGameoverEvent);
    this.handlerGameOverClick();
  }
}

class PlayingHeader extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      kill: 0,
      killed: 0
    };

    this.handlerKillChanged = this.handlerKillChanged.bind(this);
  }

  handlerKillChanged() {
    // console.log(PlayingStore);
    this.setState({
      kill: PlayingStore.getAllKillCount(),
      killed: PlayingStore.getKilledCount()
    });
  }

  render() {
    return (
      <div className="playing-headers-items">
        <span className="header-item">Playing Games</span>
        <span className="header-item">
          <label>打击：{this.state.kill}</label>
          <label>击中：{this.state.killed}</label>
        </span>
        <span className="header-item right">
          <button className="btn btn-start" onClick={this.props.onStartClick}>
            开始
          </button>
          <button className="btn btn-stop" onClick={this.props.onStopClick}>
            暂停
          </button>
          <button
            className="btn btn-game-over"
            onClick={this.props.onGameOverClick}
          >
            结束
          </button>
        </span>
      </div>
    );
  }

  componentDidMount() {
    PlayingStore.on(EVENT.KILL_CHANGED, this.handlerKillChanged);
  }

  componentWillUnmount() {
    PlayingStore.off(EVENT.KILL_CHANGED, this.handlerKillChanged);
  }
}

class PlayingPanel extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      rows: parseInt(this.props.rowsLength, 10) || 3,
      columns: parseInt(this.props.columnsLength, 10) || 3
    };
  }

  render() {
    let rows = Array(this.state.rows).fill(null);
    return (
      <div className="playing-panel">
        <div className="playing-headers">
          <PlayingHeader
            onStartClick={this.props.onStartClick}
            onStopClick={this.props.onStopClick}
            onGameOverClick={this.props.onGameOverClick}
          />
        </div>
        <div className="playing-body">
          {rows.map((row, index) => (
            <div className="playing-row" key={index}>
              <PlayingCell
                columns={this.state.columns}
                row_index={index}
                activeCell={this.props.activeCell}
                currentStatu={this.props.currentStatu}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

class PlayingCell extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      active_index: -1
    };

    this.handerActiveChanged = this.handerActiveChanged.bind(this);
  }

  handerActiveChanged() {
    let c_index = PlayingStore.getCurrentActiveItemIndex();
    // console.log(c_index);
    this.setState({
      active_index: c_index
    });
  }

  createCell(cellLen) {
    let len = parseInt(cellLen, 10) || 0;
    let cells = Array(len).fill(null);
    return [
      cells.map((cell, index) => (
        <span key={index} className="playing-cell">
          <PlayingItem
            active={this.isActive(index)}
            currentStatu={this.props.currentStatu}
          />
        </span>
      ))
    ];
  }

  isActive(index) {
    let computed_index = this.props.row_index * this.props.columns + index;
    return computed_index === this.state.active_index;
  }

  render() {
    return this.createCell(this.props.columns);
  }

  componentDidMount() {
    PlayingStore.on(EVENT.ACTIVE_INDEX_CHANGE, this.handerActiveChanged);
  }

  componentWillUnmount() {
    PlayingStore.off(EVENT.ACTIVE_INDEX_CHANGE, this.handerActiveChanged);
  }
}

class PlayingItem extends React.Component {
  getClassName() {
    let defaultName = 'playing-item';
    return `${defaultName} ${this.props.active ? 'active' : ''}`;
  }

  handlerKill(e) {
    if (this.props.currentStatu === 1) {
      PlayingAction.setKill(this.props.active);
    } else {
      e.preventDefault();
    }
  }

  render() {
    return (
      <span
        onClick={e => this.handlerKill(e)}
        className={this.getClassName()}
      />
    );
  }
}

export default PlayingController;
