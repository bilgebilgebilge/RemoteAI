// Tehlikeli komut desenleri
const DANGEROUS_PATTERNS = [
    /rm\s+(-rf?|--recursive)\s+\//i,  // Kök dizini silme
    /mkfs/i,                          // Disk formatlama
    /dd\s+if=/i,                      // Disk kopyalama/üzerine yazma
    /shutdown|reboot|halt/i,          // Sistemi kapatma/yeniden başlatma
    /chmod\s+777/i,                   // Tüm izinleri verme
    /chown\s+-R\s+root/i,             // Kök kullanıcı sahipliği
    /telnetd|ftpd/i,                  // Güvensiz servisler
    /:(){ :\|:& };:/i,                // Fork bomb
    /\.\s+-i/i,                       // Shell yürütme
    /curl\s+.*\s+\|\s+(?:sh|bash)/i,  // Uzaktan betik yürütme
    /wget\s+.*\s+\|\s+(?:sh|bash)/i,  // Uzaktan betik yürütme
    /eval\(/i,                        // Eval kullanımı
    /child_process/i,                 // Node.js child process
    /exec\(/i,                        // Execute fonksiyonu
    /process.exit/i,                  // Node.js process çıkışı
    /require\(/i                      // Node.js modül yükleme
  ];
  
  // Güvenlik kontrol fonksiyonu
  function securityCheck(command) {
    // Boş komut kontrolü
    if (!command || command.trim() === '') {
      return {
        safe: false,
        reason: 'Boş komut'
      };
    }
    
    // Maksimum komut uzunluğu kontrolü
    if (command.length > 500) {
      return {
        safe: false,
        reason: 'Komut çok uzun'
      };
    }
    
    // Tehlikeli desen kontrolü
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(command)) {
        return {
          safe: false,
          reason: `Potansiyel tehlikeli komut deseni: ${pattern}`
        };
      }
    }
    
    // Zararlı karakterler kontrolü
    if (/[;\|&]/.test(command)) {
      return {
        safe: false,
        reason: 'Komut zincirleme karakterleri (;, |, &) içeriyor'
      };
    }
    
    // Varsayılan olarak güvenli
    return {
      safe: true
    };
  }
  
  module.exports = { securityCheck };