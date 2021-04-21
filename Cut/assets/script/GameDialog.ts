import { Button, Label } from '../../creator';
import { Main } from './cut-main';
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

  onLoad() {}

  start() {}

  onQuitBtnClick() {
    cc.director.loadScene("Start"); //场景跳转
  }

  onNextLevelBtnClick() {
    this.dismissDialog();
    this.canvas.getComponent("cut-main").initWood();
    // cc.director.loadScene("cut"); //场景跳转
  }

  showDialog(score) {
    let isComplete =score>=95;
    if(isComplete){
      this.tip.getComponent(cc.Label).string="恭喜过关！";
      this.nextLevelBtn.active = true;
    }else{
      this.tip.getComponent(cc.Label).string="两个形状相似度未达到95分，游戏结束";
      this.nextLevelBtn.active = false;
    }

    this.node.active = true;
    // mask 渐变出来;
    this.background.opacity = 0;
    var fin = cc.fadeTo(0.3, 127);
    this.background.runAction(fin);
    // dlg由小到大
    this.score.getComponent(cc.Label).string=score;
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
