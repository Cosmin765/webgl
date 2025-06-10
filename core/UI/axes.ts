import { loadObj } from "../../core/utils.js";
import Drawable from "../drawable.js";

export default class Axes extends Drawable {
    static async load() {
        const drawData = await loadObj("../assets/obj/pointer-cone.obj");
        return new Axes(drawData);
    }
}
