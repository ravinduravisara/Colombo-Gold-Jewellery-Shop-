import { User, IUser, IAddress } from "./user.model";
import { ApiError } from "../../utils/ApiError";
import { getPagination, createPaginationMeta } from "../../utils/pagination";

export class UserService {
  static async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");

    if (data.name) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;

    await user.save();
    return user;
  }

  static async addAddress(userId: string, addressData: IAddress) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");

    if (addressData.isDefault || user.addresses.length === 0) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
      addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();
    return user.addresses;
  }

  static async updateAddress(userId: string, addressId: string, addressData: Partial<IAddress>) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");

    const address = user.addresses.find((a: any) => a._id?.toString() === addressId);
    if (!address) throw ApiError.notFound("Address not found");

    if (addressData.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    Object.assign(address, addressData);
    await user.save();
    return user.addresses;
  }

  static async deleteAddress(userId: string, addressId: string) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");

    user.addresses = user.addresses.filter((addr) => addr._id?.toString() !== addressId) as any;
    await user.save();
    return user.addresses;
  }

  // Admin methods
  static async listCustomers(query: any) {
    const { page, limit, skip } = getPagination(query);
    const filter: any = { role: "customer" };

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } },
        { phone: { $regex: query.search, $options: "i" } },
      ];
    }

    const [total, customers] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    return {
      customers,
      meta: createPaginationMeta(total, page, limit),
    };
  }

  static async listAdminUsers() {
    return User.find({ role: { $in: ["superadmin", "admin", "staff"] } })
      .select("-password")
      .sort({ createdAt: -1 });
  }

  static async createStaffUser(data: { name: string; email: string; password: string; role: "admin" | "staff" }) {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) throw ApiError.conflict("User with this email already exists");

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      role: data.role,
    });

    return user;
  }

  static async toggleUserStatus(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");
    if (user.role === "superadmin") throw ApiError.forbidden("Cannot deactivate superadmin");

    user.isActive = !user.isActive;
    await user.save();
    return user;
  }
}
