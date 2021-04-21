const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Node)
  RankLayer: cc.Node = null;

  isFirstOpenRank = true;

  onLoad() {}

  start() {}

  onStartBtnClick() {
    cc.director.loadScene("Game"); //场景跳转
  }

  onRankBtnClick() {
    if (typeof wx === "undefined") {
      return;
    }

    this.RankLayer.active = true;

    this.openRank();

    //第一次打开排行榜 一秒后在发送一次信息 解决部分设备第一次打开排行榜接收不到消息
    if (this.isFirstOpenRank) {
      this.isFirstOpenRank = false;

      //只用1次的计时器,2秒后执行 时间（s）
      this.scheduleOnce(function() {
        this.openRank();
      }, 1);
    }
  }

  openRank() {
    console.log("Message posted");
    wx.getOpenDataContext().postMessage({
      value: "rank_list"
    });
  }

  onRankCloseClick() {
    this.RankLayer.active = false;
  }
}
