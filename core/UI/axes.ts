import { loadObj } from "../../core/utils.js";
import Drawable from "../drawable.js";
import * as cts from "../../core/constants.js";

export default class Axes extends Drawable {
    static async load() {
        const drawData = await loadObj("../../assets/obj/pointer-cone.obj");
        const container = new Drawable();

        const xArrow = new Axes(drawData);
        xArrow.supplyUniform("useUniformColor", 1);
        xArrow.supplyUniform("color", cts.RED);
        xArrow.rotate([0, 0, -Math.PI / 2]);

        const yArrow = new Axes(drawData);
        yArrow.supplyUniform("useUniformColor", 1);
        yArrow.supplyUniform("color", cts.GREEN);

        const zArrow = new Axes(drawData);
        zArrow.supplyUniform("useUniformColor", 1);
        zArrow.supplyUniform("color", cts.BLUE);
        zArrow.rotate([Math.PI / 2, 0, 0]);

        container.addChild(xArrow);
        container.addChild(yArrow);
        container.addChild(zArrow);

        return container;
    }
}
