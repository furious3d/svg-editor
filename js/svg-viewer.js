class MiniMap {
    constructor(area, view) {
        this.areaFrame = view.querySelector("#miniMap");
        this.viewFrame = this.areaFrame.querySelector("div");
        this.viewWidth = view.clientWidth;
        this.viewHeight = view.clientHeight;
        this.areaBaseWidth = area.width.baseVal.value;
        this.areaBaseHeight = area.height.baseVal.value;
    }

    update(zoom, position) {
        const areaWidth = this.areaBaseWidth * zoom;
        const areaHeight = this.areaBaseHeight * zoom;
        const areaRatio = areaWidth / areaHeight;
        const relativeWidth = this.viewWidth / areaWidth * 100;
        const relativeHeight = this.viewHeight / areaHeight * 100;
        const scale = this.areaFrame.clientWidth / this.areaBaseWidth;

        this.areaFrame.style.height = Math.round(this.areaFrame.clientWidth * areaRatio) + "px";
        this.viewFrame.style.width = relativeWidth + "%";
        this.viewFrame.style.height = relativeHeight + "%";
        this.viewFrame.style.top = Math.round(position[1] * scale) + "px";
        this.viewFrame.style.left = Math.round(position[0] * scale) + "px";
    }
}

export class SVGViewer {
    constructor(viewContainer) {
        this.view = viewContainer;
        this.area = this.view.querySelector("#drawing");
        this.viewPosition = [0, 0];
        this.zoomLevel = 1;
        this.minZoomLevel = 0.1;
        this.maxZoomLevel = 2.0;
        this.isViewMoving = false;
        this.animationInterval = null;
        this.animationIntervalTime = 30;
        this.calculateViewAreaRatioValues();
        this.initViewControls();
        this.miniMap = new MiniMap(this.area, this.view);
        this.miniMap.update(this.zoomLevel, this.viewPosition);
    }

    initViewControls() {
        const controls = document.getElementById("viewControls");
        const rightBtn = controls.querySelector("#rightBtn");
        const leftBtn = controls.querySelector("#leftBtn");
        const upBtn = controls.querySelector("#upBtn");
        const downBtn = controls.querySelector("#downBtn");
        const zoomInBtn = controls.querySelector("#zoomInBtn");
        const zoomOutBtn = controls.querySelector("#zoomOutBtn");

        upBtn.addEventListener("click", () => {
            this.move([0, -20], true);
        });
        downBtn.addEventListener("click", () => {
            this.move([0, 20], true);
        });
        rightBtn.addEventListener("click", () => {
            this.move([20, 0], true);
        });
        leftBtn.addEventListener("click", () => {
            this.move([-20, 0], true);
        });

        zoomInBtn.addEventListener("click", () => {
            this.zoom(0.1, true);
        });
        zoomOutBtn.addEventListener("click", () => {
            this.zoom(-0.1, true);
        });

        this.area.addEventListener("mousedown", (e) => {
            this.onAreaMouseEvent(e);
        });
        this.area.addEventListener("mouseup", (e) => {
            this.onAreaMouseEvent(e);
        });
        this.area.addEventListener("mousemove", (e) => {
            this.onAreaMouseEvent(e);
        });
        this.area.addEventListener("wheel", (e) => {
            this.onAreaMouseEvent(e);
        });
    }

    move([x, y], updateView = false) {
        let updatedX = this.viewPosition[0] + x;
        let updatedY = this.viewPosition[1] + y;

        updatedX = updatedX < 0 ? 0 : updatedX;
        updatedX = updatedX > this.maxViewOffsetX ? this.maxViewOffsetX : updatedX;
        updatedY = updatedY < 0 ? 0 : updatedY;
        updatedY = updatedY > this.maxViewOffsetY ? this.maxViewOffsetY : updatedY;

        this.viewPosition[0] = updatedX;
        this.viewPosition[1] = updatedY;

        if (updateView) {
            this.updateView();
        }
    }

    zoom(delta, updateView = false) {
        let newVal = this.zoomLevel + delta;

        newVal = newVal < this.minZoomLevel ? this.minZoomLevel : newVal;
        newVal = newVal > this.maxZoomLevel ? this.maxZoomLevel : newVal;

        this.zoomLevel = newVal;

        this.calculateViewAreaRatioValues();

        if (updateView) {
            this.updateView();
        }
    }

    calculateViewAreaRatioValues() {
        this.areaWidth = this.area.width.baseVal.value * this.zoomLevel;
        this.areaHeight = this.area.height.baseVal.value * this.zoomLevel;
        this.maxViewOffsetX = this.areaWidth - this.view.clientWidth;
        this.maxViewOffsetY = this.areaHeight - this.view.clientHeight;
    }

    updateView() {
        this.area.style.left = -this.viewPosition[0] + "px";
        this.area.style.top = -this.viewPosition[1] + "px";
        this.area.style.transform = "scale(" + this.zoomLevel + ")";
        this.miniMap.update(this.zoomLevel, this.viewPosition);
    }

    onAreaMouseEvent(evt) {
        const x = evt.clientX;
        const y = evt.clientY;

        switch (evt.type) {
            case "mousedown":
                if (this.isViewMoving) return;
                this.isViewMoving = true;
                this.startAnimationLoop();
                break;
            case "mouseup":
                this.isViewMoving = false;
                this.stopAnimationLoop();
                break;
            case "mousemove":
                if (!this.isViewMoving) return;
                this.move([-evt.movementX, -evt.movementY]);
                break;
        }
    }

    startAnimationLoop() {
        this.animationInterval = setInterval(() => {
            this.updateView();
        }, this.animationIntervalTime);
    }

    stopAnimationLoop() {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
    }
}
