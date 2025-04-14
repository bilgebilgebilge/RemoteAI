// Tarayıcı ortamında sistem bilgisi toplama yardımcısı
class SystemInfoCollector {
    // Sistem bilgilerini toplama
    static async collect() {
      try {
        const systemInfo = {
          browser: this.getBrowserInfo(),
          os: this.getOSInfo(),
          screen: this.getScreenInfo(),
          network: await this.getNetworkInfo(),
          hardware: await this.getHardwareInfo(),
          plugins: this.getPluginInfo()
        };
        
        return systemInfo;
      } catch (error) {
        console.error("Sistem bilgisi toplama hatası:", error);
        throw error;
      }
    }
    
    // Tarayıcı bilgisi
    static getBrowserInfo() {
      const ua = navigator.userAgent;
      let browserName = "Bilinmiyor";
      let browserVersion = "Bilinmiyor";
      
      if (ua.indexOf("Chrome") > -1) {
        browserName = "Chrome";
        browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || "Bilinmiyor";
      } else if (ua.indexOf("Firefox") > -1) {
        browserName = "Firefox";
        browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || "Bilinmiyor";
      } else if (ua.indexOf("Safari") > -1) {
        browserName = "Safari";
        browserVersion = ua.match(/Version\/(\d+\.\d+)/)?.[1] || "Bilinmiyor";
      } else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) {
        browserName = "Internet Explorer";
        browserVersion = ua.match(/(?:MSIE |rv:)(\d+\.\d+)/)?.[1] || "Bilinmiyor";
      } else if (ua.indexOf("Edge") > -1) {
        browserName = "Edge";
        browserVersion = ua.match(/Edge\/(\d+\.\d+)/)?.[1] || "Bilinmiyor";
      }
      
      return {
        name: browserName,
        version: browserVersion,
        userAgent: ua,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled
      };
    }
    
    // İşletim sistemi bilgisi
    static getOSInfo() {
      const ua = navigator.userAgent;
      let osName = "Bilinmiyor";
      let osVersion = "Bilinmiyor";
      
      if (ua.indexOf("Windows") > -1) {
        osName = "Windows";
        if (ua.indexOf("Windows NT 10.0") > -1) osVersion = "10";
        else if (ua.indexOf("Windows NT 6.3") > -1) osVersion = "8.1";
        else if (ua.indexOf("Windows NT 6.2") > -1) osVersion = "8";
        else if (ua.indexOf("Windows NT 6.1") > -1) osVersion = "7";
        else if (ua.indexOf("Windows NT 6.0") > -1) osVersion = "Vista";
        else if (ua.indexOf("Windows NT 5.1") > -1) osVersion = "XP";
      } else if (ua.indexOf("Mac") > -1) {
        osName = "MacOS";
        osVersion = ua.match(/Mac OS X (\d+[._]\d+[._]\d+)/) ? 
          ua.match(/Mac OS X (\d+[._]\d+[._]\d+)/)[1].replace(/_/g, '.') : "Bilinmiyor";
      } else if (ua.indexOf("Linux") > -1) {
        osName = "Linux";
      } else if (ua.indexOf("Android") > -1) {
        osName = "Android";
        osVersion = ua.match(/Android (\d+\.\d+)/) ? ua.match(/Android (\d+\.\d+)/)[1] : "Bilinmiyor";
      } else if (ua.indexOf("iOS") > -1 || ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) {
        osName = "iOS";
        osVersion = ua.match(/OS (\d+_\d+)/) ? ua.match(/OS (\d+_\d+)/)[1].replace('_', '.') : "Bilinmiyor";
      }
      
      return {
        name: osName,
        version: osVersion,
        platform: navigator.platform
      };
    }
    
    // Ekran bilgisi
    static getScreenInfo() {
      return {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
        orientation: window.screen.orientation ? window.screen.orientation.type : 'bilinmiyor',
        pixelRatio: window.devicePixelRatio
      };
    }
    
    // Ağ bilgisi
    static async getNetworkInfo() {
      const networkInfo = {
        onLine: navigator.onLine,
        connectionType: 'bilinmiyor',
        effectiveType: 'bilinmiyor',
        rtt: null,
        downlink: null
      };
      
      // Network Information API desteği
      if ('connection' in navigator) {
        const conn = navigator.connection;
        networkInfo.connectionType = conn.type || 'bilinmiyor';
        networkInfo.effectiveType = conn.effectiveType || 'bilinmiyor';
        networkInfo.rtt = conn.rtt || null;
        networkInfo.downlink = conn.downlink || null;
      }
      
      return networkInfo;
    }
    
    // Donanım bilgisi
    static async getHardwareInfo() {
      const hardwareInfo = {
        deviceMemory: 'bilinmiyor',
        cpuCores: 'bilinmiyor',
        maxTouchPoints: navigator.maxTouchPoints || 0,
        hardwareConcurrency: navigator.hardwareConcurrency || 'bilinmiyor'
      };
      
      // Device Memory API desteği
      if ('deviceMemory' in navigator) {
        hardwareInfo.deviceMemory = navigator.deviceMemory + ' GB';
      }
      
      return hardwareInfo;
    }
    
    // Eklenti bilgisi
    static getPluginInfo() {
      const plugins = [];
      
      if (navigator.plugins && navigator.plugins.length > 0) {
        for (let i = 0; i < navigator.plugins.length; i++) {
          const plugin = navigator.plugins[i];
          plugins.push({
            name: plugin.name,
            description: plugin.description,
            filename: plugin.filename
          });
        }
      }
      
      return plugins;
    }
  }
  
  export default SystemInfoCollector;