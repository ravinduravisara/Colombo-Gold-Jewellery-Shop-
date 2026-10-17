import { ShippingZone, IShippingZone } from "./shipping.model";
import { ApiError } from "../../utils/ApiError";

export class ShippingService {
  static async getAll(includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };
    return ShippingZone.find(filter).sort({ district: 1 });
  }

  static async create(data: Partial<IShippingZone>) {
    const existing = await ShippingZone.findOne({
      district: new RegExp(`^${data.district?.trim()}$`, "i"),
    });
    if (existing) throw ApiError.conflict("Delivery zone for this district already exists");

    return ShippingZone.create(data);
  }

  static async update(id: string, data: Partial<IShippingZone>) {
    const zone = await ShippingZone.findByIdAndUpdate(id, data, { new: true });
    if (!zone) throw ApiError.notFound("Shipping zone not found");
    return zone;
  }

  static async delete(id: string) {
    const deleted = await ShippingZone.findByIdAndDelete(id);
    if (!deleted) throw ApiError.notFound("Shipping zone not found");
    return deleted;
  }
}

