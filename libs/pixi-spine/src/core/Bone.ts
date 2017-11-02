/******************************************************************************
 * Spine Runtimes Software License
 * Version 2.5
 *
 * Copyright (c) 2013-2016, Esoteric Software
 * All rights reserved.
 *
 * You are granted a perpetual, non-exclusive, non-sublicensable, and
 * non-transferable license to use, install, execute, and perform the Spine
 * Runtimes software and derivative works solely for personal or internal
 * use. Without the written permission of Esoteric Software (see Section 2 of
 * the Spine Software License Agreement), you may not (a) modify, translate,
 * adapt, or develop new applications using the Spine Runtimes or otherwise
 * create derivative works or improvements of the Spine Runtimes or (b) remove,
 * delete, alter, or obscure any trademarks or any copyright, trademark, patent,
 * or other intellectual property or proprietary rights notices on or in the
 * Software, including any copy thereof. Redistributions in binary or source
 * form must include this license and terms.
 *
 * THIS SOFTWARE IS PROVIDED BY ESOTERIC SOFTWARE "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL ESOTERIC SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, BUSINESS INTERRUPTION, OR LOSS OF
 * USE, DATA, OR PROFITS) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

namespace pixi_spine.core {
    export class Bone implements Updatable {
        static yDown: boolean = false;
        //be careful! Spine b,c is c,b in pixi matrix
        matrix = new PIXI.Matrix();

        get worldX(): number {
            return this.matrix.tx;
        }

        get worldY(): number {
            return this.matrix.ty;
        }

        data: BoneData;
        skeleton: Skeleton;
        parent: Bone;
        children = new Array<Bone>();
        x = 0;
        y = 0;
        rotation = 0;
        scaleX = 0;
        scaleY = 0;
        shearX = 0;
        shearY = 0;
        ax = 0;
        ay = 0;
        arotation = 0;
        ascaleX = 0;
        ascaleY = 0;
        ashearX = 0;
        ashearY = 0;
        appliedValid = false;

        sorted = false;

        /** @param parent May be null. */
        constructor(data: BoneData, skeleton: Skeleton, parent: Bone) {
            if (data == null) throw new Error("data cannot be null.");
            if (skeleton == null) throw new Error("skeleton cannot be null.");
            this.data = data;
            this.skeleton = skeleton;
            this.parent = parent;
            this.setToSetupPose();
        }

        /** Same as {@link #updateWorldTransform()}. This method exists for Bone to implement {@link Updatable}. */
        update() {
            this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
        }

        /** Computes the world transform using the parent bone and this bone's local transform. */
        updateWorldTransform() {
            this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
        }

        /** Computes the world transform using the parent bone and the specified local transform. */
        updateWorldTransformWith(x: number, y: number, rotation: number, scaleX: number, scaleY: number, shearX: number, shearY: number) {
            this.ax = x;
            this.ay = y;
            this.arotation = rotation;
            this.ascaleX = scaleX;
            this.ascaleY = scaleY;
            this.ashearX = shearX;
            this.ashearY = shearY;
            this.appliedValid = true;

            let parent = this.parent;
            let m = this.matrix;
            if (parent == null) { // Root bone.
                let rotationY = rotation + 90 + shearY;
                let la = MathUtils.cosDeg(rotation + shearX) * scaleX;
                let lb = MathUtils.cosDeg(rotationY) * scaleY;
                let lc = MathUtils.sinDeg(rotation + shearX) * scaleX;
                let ld = MathUtils.sinDeg(rotationY) * scaleY;
                let skeleton = this.skeleton;
                if (skeleton.flipX) {
                    x = -x;
                    la = -la;
                    lb = -lb;
                }
                if (skeleton.flipY !== Bone.yDown) {
                    y = -y;
                    lc = -lc;
                    ld = -ld;
                }
                m.a = la;
                m.c = lb;
                m.b = lc;
                m.d = ld;
                m.tx = x + skeleton.x;
                m.ty = y + skeleton.y;
                return;
            }

            let pa = parent.matrix.a, pb = parent.matrix.c, pc = parent.matrix.b, pd = parent.matrix.d;
            m.tx = pa * x + pb * y + parent.matrix.tx;
            m.ty = pc * x + pd * y + parent.matrix.ty;
            switch (this.data.transformMode) {
                case TransformMode.Normal: {
                    let rotationY = rotation + 90 + shearY;
                    let la = MathUtils.cosDeg(rotation + shearX) * scaleX;
                    let lb = MathUtils.cosDeg(rotationY) * scaleY;
                    let lc = MathUtils.sinDeg(rotation + shearX) * scaleX;
                    let ld = MathUtils.sinDeg(rotationY) * scaleY;
                    m.a = pa * la + pb * lc;
                    m.c = pa * lb + pb * ld;
                    m.b = pc * la + pd * lc;
                    m.d = pc * lb + pd * ld;
                    return;
                }
                case TransformMode.OnlyTranslation: {
                    let rotationY = rotation + 90 + shearY;
                    m.a = MathUtils.cosDeg(rotation + shearX) * scaleX;
                    m.c = MathUtils.cosDeg(rotationY) * scaleY;
                    m.b = MathUtils.sinDeg(rotation + shearX) * scaleX;
                    m.d = MathUtils.sinDeg(rotationY) * scaleY;
                    break;
                }
                case TransformMode.NoRotationOrReflection: {
                    let s = pa * pa + pc * pc;
                    let prx = 0;
                    if (s > 0.0001) {
                        s = Math.abs(pa * pd - pb * pc) / s;
                        pb = pc * s;
                        pd = pa * s;
                        prx = Math.atan2(pc, pa) * MathUtils.radDeg;
                    } else {
                        pa = 0;
                        pc = 0;
                        prx = 90 - Math.atan2(pd, pb) * MathUtils.radDeg;
                    }
                    let rx = rotation + shearX - prx;
                    let ry = rotation + shearY - prx + 90;
                    let la = MathUtils.cosDeg(rx) * scaleX;
                    let lb = MathUtils.cosDeg(ry) * scaleY;
                    let lc = MathUtils.sinDeg(rx) * scaleX;
                    let ld = MathUtils.sinDeg(ry) * scaleY;
                    m.a = pa * la - pb * lc;
                    m.c = pa * lb - pb * ld;
                    m.b = pc * la + pd * lc;
                    m.d = pc * lb + pd * ld;
                    break;
                }
                case TransformMode.NoScale:
                case TransformMode.NoScaleOrReflection: {
                    let cos = MathUtils.cosDeg(rotation);
                    let sin = MathUtils.sinDeg(rotation);
                    let za = pa * cos + pb * sin;
                    let zc = pc * cos + pd * sin;
                    let s = Math.sqrt(za * za + zc * zc);
                    if (s > 0.00001) s = 1 / s;
                    za *= s;
                    zc *= s;
                    s = Math.sqrt(za * za + zc * zc);
                    let r = Math.PI / 2 + Math.atan2(zc, za);
                    let zb = Math.cos(r) * s;
                    let zd = Math.sin(r) * s;
                    let la = MathUtils.cosDeg(shearX) * scaleX;
                    let lb = MathUtils.cosDeg(90 + shearY) * scaleY;
                    let lc = MathUtils.sinDeg(shearX) * scaleX;
                    let ld = MathUtils.sinDeg(90 + shearY) * scaleY;
                    m.a = za * la + zb * lc;
                    m.c = za * lb + zb * ld;
                    m.b = zc * la + zd * lc;
                    m.d = zc * lb + zd * ld;
                    if (this.data.transformMode != TransformMode.NoScaleOrReflection ? pa * pd - pb * pc < 0 : ((this.skeleton.flipX != this.skeleton.flipY) != Bone.yDown)) {
                        m.c = -m.c;
                        m.d = -m.d;
                    }
                    return;
                }
            }
            if (this.skeleton.flipX) {
                m.a = -m.a;
                m.c = -m.c;
            }
            if (this.skeleton.flipY != Bone.yDown) {
                m.b = -m.b;
                m.d = -m.d;
            }
        }

        setToSetupPose() {
            let data = this.data;
            this.x = data.x;
            this.y = data.y;
            this.rotation = data.rotation;
            this.scaleX = data.scaleX;
            this.scaleY = data.scaleY;
            this.shearX = data.shearX;
            this.shearY = data.shearY;
        }

        getWorldRotationX() {
            return Math.atan2(this.matrix.b, this.matrix.a) * MathUtils.radDeg;
        }

        getWorldRotationY() {
            return Math.atan2(this.matrix.d, this.matrix.c) * MathUtils.radDeg;
        }

        getWorldScaleX() {
            let m = this.matrix;
            return Math.sqrt(m.a * m.a + m.c * m.c);
        }

        getWorldScaleY() {
            let m = this.matrix;
            return Math.sqrt(m.b * m.b + m.d * m.d);
        }

        worldToLocalRotationX() {
            let parent = this.parent;
            if (parent == null) return this.arotation;
            let pm = parent.matrix, m = this.matrix;
            return Math.atan2(pm.a * m.b - pm.b * m.a, pm.d * m.a - pm.c * m.b) * MathUtils.radDeg;
        }

        worldToLocalRotationY() {
            let parent = this.parent;
            if (parent == null) return this.arotation;
            let pm = parent.matrix, m = this.matrix;
            return Math.atan2(pm.a * m.d - pm.b * m.c, pm.d * m.c - pm.c * m.d) * MathUtils.radDeg;
        }

        rotateWorld(degrees: number) {
            let m = this.matrix;
            let a = this.matrix.a, b = m.c, c = m.b, d = m.d;
            let cos = MathUtils.cosDeg(degrees), sin = MathUtils.sinDeg(degrees);
            m.a = cos * a - sin * c;
            m.c = cos * b - sin * d;
            m.b = sin * a + cos * c;
            m.d = sin * b + cos * d;
            this.appliedValid = false;
        }

        /** Computes the individual applied transform values from the world transform. This can be useful to perform processing using
         * the applied transform after the world transform has been modified directly (eg, by a constraint).
         * <p>
         * Some information is ambiguous in the world transform, such as -1,-1 scale versus 180 rotation. */
        updateAppliedTransform() {
            this.appliedValid = true;
            let parent = this.parent;
            let m = this.matrix;
            if (parent == null) {
                this.ax = m.tx;
                this.ay = m.ty;
                this.arotation = Math.atan2(m.b, m.a) * MathUtils.radDeg;
                this.ascaleX = Math.sqrt(m.a * m.a + m.b * m.b);
                this.ascaleY = Math.sqrt(m.c * m.c + m.d * m.d);
                this.ashearX = 0;
                this.ashearY = Math.atan2(m.a * m.c + m.b * m.d, m.a * m.d - m.b * m.c) * MathUtils.radDeg;
                return;
            }
            let pm = parent.matrix;
            let pid = 1 / (pm.a * pm.d - pm.b * pm.c);
            let dx = m.tx - pm.tx, dy = m.ty - pm.ty;
            this.ax = (dx * pm.d * pid - dy * pm.c * pid);
            this.ay = (dy * pm.a * pid - dx * pm.b * pid);
            let ia = pid * pm.d;
            let id = pid * pm.a;
            let ib = pid * pm.c;
            let ic = pid * pm.b;
            let ra = ia * m.a - ib * m.b;
            let rb = ia * m.c - ib * m.d;
            let rc = id * m.b - ic * m.a;
            let rd = id * m.d - ic * m.c;
            this.ashearX = 0;
            this.ascaleX = Math.sqrt(ra * ra + rc * rc);
            if (this.ascaleX > 0.0001) {
                let det = ra * rd - rb * rc;
                this.ascaleY = det / this.ascaleX;
                this.ashearY = Math.atan2(ra * rb + rc * rd, det) * MathUtils.radDeg;
                this.arotation = Math.atan2(rc, ra) * MathUtils.radDeg;
            } else {
                this.ascaleX = 0;
                this.ascaleY = Math.sqrt(rb * rb + rd * rd);
                this.ashearY = 0;
                this.arotation = 90 - Math.atan2(rd, rb) * MathUtils.radDeg;
            }
        }

        worldToLocal(world: Vector2) {
            let m = this.matrix;
            let a = m.a, b = m.c, c = m.b, d = m.d;
            let invDet = 1 / (a * d - b * c);
            let x = world.x - m.tx, y = world.y - m.ty;
            world.x = (x * d * invDet - y * b * invDet);
            world.y = (y * a * invDet - x * c * invDet);
            return world;
        }

        localToWorld(local: Vector2) {
            let m = this.matrix;
            let x = local.x, y = local.y;
            local.x = x * m.a + y * m.c + m.tx;
            local.y = x * m.b + y * m.d + m.ty;
            return local;
        }
    }
}
