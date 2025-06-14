import { loadObj } from "../../core/utils.js";
import Drawable from "../drawable.js";
import * as cts from "../../core/constants.js";

export default class Axes extends Drawable {
    static async load() {
        const drawData = await loadObj("../../assets/obj/pointer-cone.obj");
        const drawable = new Drawable();

        const arrow1 = new Axes(drawData);
        arrow1.supplyUniform("useUniformColor", 1);
        arrow1.supplyUniform("color", cts.GREEN);

        const arrow2 = new Axes(drawData);
        arrow2.supplyUniform("useUniformColor", 1);
        arrow2.supplyUniform("color", cts.BLUE);
        arrow2.rotate([Math.PI / 2, 0, 0]);

        const arrow3 = new Axes(drawData);
        arrow3.supplyUniform("useUniformColor", 1);
        arrow3.supplyUniform("color", cts.RED);
        arrow3.rotate([0, 0, Math.PI / 2]);

        drawable.addChild(arrow1);
        drawable.addChild(arrow2);
        drawable.addChild(arrow3);

        drawable.translate([0, 3, 0]);

        return drawable;
    }
}
