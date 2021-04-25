import { Constants } from "./Constants";
import { Sprite } from "../../creator";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameDialog extends cc.Component {
  @property(cc.Node)
  canvas: cc.Node = null;

  @property(cc.Node)
  score: cc.Node = null;

  @property(cc.Node)
  tip: cc.Node = null;

  @property(cc.Node)
  gameLayer: cc.Node = undefined;

  @property(cc.Node)
  background: cc.Node = null;

  @property(cc.Node)
  nextLevelBtn: cc.Node = null;

  @property(cc.Node)
  quitBtn: cc.Node = null;

  @property(cc.SpriteFrame)
  nextLevelSF: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  restartSF: cc.SpriteFrame = null;

  isComplete: boolean = false;

  onLoad() {}

  start() {}

  onQuitBtnClick() {
    cc.director.loadScene("Start"); //场景跳转
  }

  onNextLevelBtnClick() {
    if (this.isComplete) {
      this.dismissDialog();
      this.canvas.getComponent("cut-main").initWood();
    } else {
      cc.director.loadScene("Game"); //场景跳转
    }
  }

  showDialog(score) {
    this.isComplete = score >= Constants.COMPLETE_SCORE;
    if (this.isComplete) {
      this.tip.getComponent(cc.Label).string = "恭喜过关！";
      this.nextLevelBtn.getComponent(cc.Sprite).spriteFrame = this.nextLevelSF;
    } else {
      this.tip.getComponent(cc.Label).string =
        "两个形状相似度未达到过关分，游戏结束";
      this.nextLevelBtn.getComponent(cc.Sprite).spriteFrame = this.restartSF;
    }

    this.node.active = true;
    // mask 渐变出来;
    this.background.opacity = 0;
    var fin = cc.fadeTo(0.3, 127);
    this.background.runAction(fin);
    // dlg由小到大
    this.score.getComponent(cc.Label).string = score;
    this.score.scale = 0;
    var s = cc.scaleTo(0.4, 1).easing(cc.easeBackOut());
    this.score.runAction(s);
  }

  dismissDialog() {
    var fout = cc.fadeOut(0.3);
    this.background.runAction(fout);

    var s = cc.scaleTo(0.3, 0).easing(cc.easeBackIn());
    var end_func = cc.callFunc(
      function() {
        this.node.active = false;
      }.bind(this)
    );

    var seq = cc.sequence([s, end_func]);
    this.score.runAction(seq);
  }
}
