import { length, Prefab, Label } from "../../creator";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
  @property(cc.Node)
  dialog: cc.Node = undefined;

  @property(cc.Prefab)
  wood: cc.Prefab = undefined;

  @property(cc.Prefab)
  piece: cc.Prefab = undefined;

  @property(cc.Graphics)
  draw: cc.Graphics = undefined;

  @property(cc.Node)
  gameLayer: cc.Node = undefined;

  @property(cc.Label)
  levelText: cc.Label = undefined;

  level: number = 0;
  canDraw: boolean = true;

  onLoad() {
    this.initWood();
    this.registerEvent();
  }

  initWood() {
    this.level++;
    this.levelText.string = "Level " + this.level;

    this.gameLayer.removeAllChildren();
    var wood = cc.instantiate(this.wood);
    this.gameLayer.addChild(wood);

    this.canDraw = true;
  }
  registerEvent() {
    this.node.on(
      cc.Node.EventType.TOUCH_MOVE,
      e => {
        if (!this.canDraw) return;
        this.draw.clear();
        const startPoint = e.getStartLocation();
        this.draw.moveTo(startPoint.x, startPoint.y);
        this.draw.lineTo(e.getLocationX(), e.getLocationY());
        this.draw.stroke();
      },
      this
    );

    this.node.on(
      cc.Node.EventType.TOUCH_END,
      e => {
        if (!this.canDraw) return;
        this.draw.clear();
        const p1 = e.getStartLocation();
        const p2 = e.getLocation();
        this.cut(p1, p2);
      },
      this
    );
  }

  cut(point1, point2) {
    const result1 = cc.director
      .getPhysicsManager()
      .rayCast(point1, point2, cc.RayCastType.Closest);
    const result2 = cc.director
      .getPhysicsManager()
      .rayCast(point2, point1, cc.RayCastType.Closest);
    if (result1.length === 0 || result2.length === 0) {
      cc.warn("无碰撞体");
      return;
    }
    if (result1[0].collider !== result2[0].collider) {
      cc.warn("不是单独碰撞体");
      return;
    }
    if (!(result1[0].collider instanceof cc.PhysicsPolygonCollider)) {
      cc.warn("非多边形物理碰撞盒无points属性");
      return;
    }

    this.canDraw = false;

    // 将单独的碰撞体分割成两块，利用点是否在线上判断
    const collider = result1[0].collider;
    let localPoint1 = cc.Vec2.ZERO;
    let localPoint2 = cc.Vec2.ZERO;
    collider.body.getLocalPoint(result1[0].point, localPoint1);
    collider.body.getLocalPoint(result2[0].point, localPoint2);
    const points = collider.points;
    let index1 = undefined;
    let index2 = undefined;
    for (let i = 0; i < points.length; i++) {
      let p1 = points[i];
      let p2 = i === points.length - 1 ? points[0] : points[i + 1];
      if (this.pointInLine(localPoint1, p1, p2)) {
        index1 = i;
      }
      if (this.pointInLine(localPoint2, p1, p2)) {
        index2 = i;
      }
      if (index1 !== undefined && index2 !== undefined) {
        break;
      }
    }
    cc.log(`点1下标${index1}`);
    cc.log(`点2下标${index2}`);
    // 一次循环，装入两个点数组
    const array1 = [];
    const array2 = [];
    // 碰到 index1 或 index2 标志
    let time = 0;
    for (let i = 0; i < points.length; i++) {
      let temp = points[i].clone();
      if (time === 0) {
        array1.push(temp);
      } else {
        array2.push(temp);
      }

      const point = i === index1 ? localPoint1.clone() : localPoint2.clone();
      point.x = Math.floor(point.x);
      point.y = Math.floor(point.y);
      const point2 = i === index1 ? localPoint1.clone() : localPoint2.clone();
      point2.x = Math.ceil(point2.x);
      point2.y = Math.ceil(point2.y);

      if ((i === index1 || i === index2) && time === 0) {
        array1.push(point);
        array2.push(point2);
        time = 1;
      } else if ((i === index1 || i === index2) && time === 1) {
        array2.push(point);
        array1.push(point2);
        time = 0;
      }
    }

    this.gameLayer.removeAllChildren();

    var piece1 = cc.instantiate(this.piece);
    const comp = piece1.getComponent(cc.PhysicsPolygonCollider);
    comp.points = array1;
    comp.apply();
    piece1.getComponent("Piece").drawByCollider();
    this.gameLayer.addChild(piece1);

    var piece2 = cc.instantiate(this.piece);
    const comp2 = piece2.getComponent(cc.PhysicsPolygonCollider);
    comp2.points = array2;
    comp2.apply();
    piece2.getComponent("Piece").drawByCollider();
    this.gameLayer.addChild(piece2);

    //只用1次的计时器,2秒后执行 时间（s）
    this.scheduleOnce(function() {
      //一条或多条执行语句
      cc.log("aaaaaaaarray", array1, array2);
      const area1 = this.getArea(array1);
      const area2 = this.getArea(array2);
      const scale = Math.round(
        (Math.min(area1, area2) / ((area1 + area2) / 2)) * 100
      );
      cc.log("area1", area1);
      cc.log("area2", area2);
      cc.log("scale", scale);
      //弹窗&分数
      this.dialog
        .getComponent("GameDialog")
        .showDialog(scale > 100 ? 100 : scale);
      //更新玩家通关数
      if (scale > 90) this.updateUserLevel();
    }, 1.5);
  }

  /** 近似判断点在线上 */
  pointInLine(point, start, end) {
    const dis = 1;
    return cc.Intersection.pointLineDistance(point, start, end, true) < dis;
  }

  // 鞋带公式 计算面积 https://www.zhihu.com/question/58639959/answer/159924222
  getArea(points) {
    if (points.length < 3) return 0;
    let a = points[points.length - 1].x * points[0].y;
    let b = points[0].x * points[points.length - 1].y;
    for (let i = 0; i < points.length - 1; i++) {
      a += points[i].x * points[i + 1].y;
      b += points[i + 1].x * points[i].y;
    }
    return Math.abs(a - b) / 2;
  }

  updateUserLevel() {
    if (typeof wx === 'undefined') {
        return;
    }

    wx.getOpenDataContext().postMessage({
      value: "update_score",
      score:this.level
    });
  }
}
