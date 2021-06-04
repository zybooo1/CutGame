const {ccclass, property} = cc._decorator;

@ccclass
export default class Shape extends cc.Component {

    onLoad () {
        this.draw();
    }

    //绘制形状 dotCount：顶点数
    draw () {
        this.getComponent(cc.RigidBody).gravityScale=0
        this.node.position.x=360
        this.node.position.y=640

        const dotCount = Math.round(Math.random()*6+3);
        const points = [];
        let vectors =[];

        //随机形状
        const dig = 2 * Math.PI / dotCount;//周长2πr 一周的弧度数为2πr/r=2π，
        for (let i = 0; i < dotCount; i++)
        {
            const side = Math.random()*300+ 50;

            //顶点
            const x = side * Math.cos(i * dig);//cos=x/side
            const y = side * Math.sin(i * dig);//sin=y/side
            points.push({x:Math.round(x),y:Math.round(y)});

            let v = cc.v2(Math.round(x), Math.round(y));
            vectors.push(v);
        }
        cc.warn(points);
        cc.warn(vectors);

        //添加碰撞盒
        this.getComponent(cc.PhysicsPolygonCollider).points=vectors;

        //绘制
        const ctx = this.getComponent(cc.Graphics);
        ctx.clear();
        const len = points.length;
        ctx.moveTo(points[len - 1].x, points[len - 1].y);
        for (let i = 0; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.fill();
        ctx.stroke();
    }
}
