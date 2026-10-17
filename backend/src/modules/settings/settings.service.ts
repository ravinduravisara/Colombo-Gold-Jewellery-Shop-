import { WebsiteSettings, IWebsiteSettings } from "./settings.model";

export class SettingsService {
  static async getSettings() {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create({});
    }
    return settings;
  }

  static async getPublicSettings() {
    const settings = await this.getSettings();
    return {
      storeName: settings.storeName,
      tagline: settings.tagline,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      whatsappNumber: settings.whatsappNumber,
      address: settings.address,
      city: settings.city,
      district: settings.district,
      country: settings.country,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      freeShippingThreshold: settings.freeShippingThreshold,
      defaultDeliveryFee: settings.defaultDeliveryFee,
      bankDetails: settings.bankDetails,
      socialLinks: settings.socialLinks,
      announcementBar: settings.announcementBar,
      seo: settings.seo,
      enableCod: settings.enableCod,
      enableBankTransfer: settings.enableBankTransfer,
      enableDirectWhatsApp: settings.enableDirectWhatsApp,
    };
  }

  static async updateSettings(data: Partial<IWebsiteSettings>) {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create(data);
    } else {
      Object.assign(settings, data);
      await settings.save();
    }
    return settings;
  }
}

