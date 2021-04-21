const {ccclass, property} = cc._decorator;

@ccclass
export default class Piece extends cc.Component {

    onLoad () {
    }

    //根据碰撞盒子绘制形状 dotCount：顶点数
    drawByCollider () {
        this.getComponent(cc.RigidBody).gravityScale=1

        const points = this.getComponent(cc.PhysicsPolygonCollider).points;
        const ctx = this.getComponent(cc.Graphics);
        ctx.clear();
        const len = points.length;
        ctx.moveTo(points[len - 1].x, points[len - 1].y);
        for (let i = 0; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
    }

}
