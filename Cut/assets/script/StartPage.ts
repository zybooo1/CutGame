const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Node)
  RankLayer: cc.Node = null;

  isFirstOpenRank = true;

  onLoad() {
    this.updateUserLevel();
    this.share();
  }

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
      }, 2);
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

  share() {
    if (typeof wx === "undefined") {
      return;
    }
    console.log("share-----------");

    //wx.showShareMenu的真正作用，是控制是否显示转发分享菜单在 "...”菜单中，而不是直接弹出分享界面。
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    // 设置分享朋友圈的标题
    wx.onShareTimeline(() => {
      return {
        title: "简单的几何学，快来和朋友一起挑战吧",
      };
    });
    // 设置分享给朋友的标题
    wx.onShareAppMessage(() => {
      return {
        title: '简单的几何学，快来和朋友一起挑战吧',
      }
    })
  }

  /**
   * 进来默认给用户关卡为第一关
   */
  updateUserLevel() {
    if (typeof wx === "undefined") {
      return;
    }

    wx.getOpenDataContext().postMessage({
      value: "update_score",
      score: 1
    });

    const version = wx.getSystemInfoSync().SDKVersion;
    console.log("wechat sdk version= ", version);
  }
}
