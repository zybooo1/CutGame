const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Node)
  RankLayer: cc.Node = null;

  isFirstOpenRank = true;

  onLoad() {
    this.updateUserLevel()
  }

  start() {}

  onStartBtnClick() {
    cc.director.loadScene("Game"); //场景跳转
    // this.share();
  }

  onRankBtnClick() {
    if (typeof wx === "undefined") {
      return;
    }

    this.RankLayer.active = true;

    this.openRank();

    //第一次打开排行榜 一秒后在发送一次信息 解决部分设备第一次打开排行榜接收不到消息
    // if (this.isFirstOpenRank) {
    //   this.isFirstOpenRank = false;

    //   //只用1次的计时器,2秒后执行 时间（s）
    //   this.scheduleOnce(function() {
    //     this.openRank();
    //   }, 1);
    // }
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

  share() {
    if (typeof wx === "undefined") {
      return;
    }
    const version = wx.getSystemInfoSync().SDKVersion
    console.log("share2-----------",version);

    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
    
    wx.shareAppMessage({
      title: "平分切割",
      imageUrl: ""//可以是网络图片Url也可以本地路径
  })
  }

  /**
   * 进来默认给用户关卡为第一关
   */
  updateUserLevel() {
    if (typeof wx === 'undefined') {
        return;
    }

    wx.getOpenDataContext().postMessage({
      value: "update_score",
      score:1
    });
  }
}
