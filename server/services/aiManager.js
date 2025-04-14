class AiManager {
  constructor() {
    this.commonIssues = this.initializeCommonIssues();
  }
  
  // Metin tabanlı sorun analizi
  analyzeIssue(description) {
    const text = description.toLowerCase();
    
    // Tüm bilinen sorunları kontrol et
    for (const issue of this.commonIssues) {
      // Anahtar kelimeleri kontrol et
      for (const keyword of issue.keywords) {
        if (text.includes(keyword)) {
          return {
            diagnosis: issue.problem,
            solution: issue.command,
            explanation: issue.explanation
          };
        }
      }
    }
    
    // Eşleşme bulunamazsa
    return {
      diagnosis: "Belirli bir sorun tespit edilemedi.",
      solution: "Lütfen sorunu daha detaylı açıklayın veya manuel komut çalıştırın.",
      explanation: "Sistem, belirttiğiniz sorunu tanımlayamadı."
    };
  }
  
  // Komut sonucunu analiz et
  analyzeCommandResult(command, output, error, exitCode) {
    // Başarısız komut
    if (exitCode !== 0 || error) {
      return {
        problem: "Komut çalıştırılırken hata oluştu",
        recommendation: "Komut sözdizimini kontrol edin veya yetki gerektiren bir işlem olabilir"
      };
    }
    
    // Komut başarılı ama çıktısında sorun olabilir
    const outputLower = output.toLowerCase();
    const commandLower = command.toLowerCase();
    
    // Disk komutları
    if (commandLower.includes("disk") || commandLower.includes("chkdsk")) {
      if (outputLower.includes("error") || outputLower.includes("bad") || outputLower.includes("corrupt")) {
        return {
          problem: "Diskte sorunlar tespit edildi",
          recommendation: "chkdsk /f komutunu çalıştırarak disk onarımı yapabilirsiniz"
        };
      }
    }
    
    // Ağ komutları
    if (commandLower.includes("ipconfig") || commandLower.includes("network") || commandLower.includes("ping")) {
      if (outputLower.includes("timeout") || outputLower.includes("unreachable")) {
        return {
          problem: "Ağ bağlantı sorunu tespit edildi",
          recommendation: "ipconfig /release ve ipconfig /renew komutlarını çalıştırarak IP adresini yenileyebilirsiniz"
        };
      }
    }
    
    // Görev çubuğu komutları
    if (commandLower.includes("taskbar") || commandLower.includes("explorer") || commandLower.includes("görev çubuğu")) {
      return {
        problem: "Görev çubuğu ile ilgili bir işlem yapıldı",
        recommendation: "İşlem başarıyla tamamlandı. Sorun devam ederse bilgisayarı yeniden başlatmayı deneyin."
      };
    }
    
    // Sorun tespit edilmediğinde varsayılan yanıt
    return {
      problem: null,
      recommendation: "Komut başarıyla çalıştırıldı. Çıktı normal görünüyor."
    };
  }
  
  // Bilinen sorunlar veritabanı
  initializeCommonIssues() {
    return [
      {
        keywords: ["taskbar", "görev çubuğu", "pin", "sabitleme", "sabitlenmiyor"],
        problem: "Görev çubuğu sabitleme sorunu",
        command: 'reg delete "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Taskband" /f && taskkill /f /im explorer.exe && start explorer.exe',
        explanation: "Bu komut, görev çubuğu ayarlarını sıfırlar ve Windows Explorer'ı yeniden başlatır."
      },
      {
        keywords: ["internet", "ağ", "bağlantı", "wifi", "network"],
        problem: "Ağ bağlantı sorunu",
        command: "ipconfig /release && ipconfig /flushdns && timeout 5 && ipconfig /renew",
        explanation: "Bu komutlar, IP adresini yeniler ve DNS önbelleğini temizler."
      },
      {
        keywords: ["donma", "kasma", "yavaş", "freeze", "slow"],
        problem: "Sistem performans sorunu",
        command: "powershell \"Get-Process | Sort-Object -Property CPU -Descending | Select-Object -First 10\"",
        explanation: "Bu komut, en çok CPU kullanan 10 işlemi listeler."
      },
      {
        keywords: ["disk", "depolama", "storage", "doluluk", "full"],
        problem: "Disk doluluk sorunu",
        command: "powershell \"Get-PSDrive -PSProvider 'FileSystem' | Format-Table -AutoSize\"",
        explanation: "Bu komut, tüm disklerin doluluk durumunu gösterir."
      },
      {
        keywords: ["ses", "sound", "audio", "çalışmıyor", "not working"],
        problem: "Ses sorunu",
        command: "powershell \"Get-Service -Name Audiosrv | Restart-Service -Force\"",
        explanation: "Bu komut, Windows ses hizmetini yeniden başlatır."
      },
      {
        keywords: ["güncelleme", "update", "windows update"],
        problem: "Windows güncelleme sorunu",
        command: "powershell \"(New-Object -ComObject Microsoft.Update.AutoUpdate).DetectNow()\"",
        explanation: "Bu komut, Windows güncellemelerini yeniden kontrol eder."
      },
      {
        keywords: ["yazıcı", "printer", "tarayıcı", "scanner"],
        problem: "Yazıcı/tarayıcı sorunu",
        command: "powershell \"Get-Service -Name Spooler | Restart-Service -Force\"",
        explanation: "Bu komut, Windows yazdırma hizmetini yeniden başlatır."
      }
    ];
  }
}

module.exports = AiManager;