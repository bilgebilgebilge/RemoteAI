// Yaygın komutlar ve açıklamaları veritabanı
module.exports = [
    {
      keyword: 'ipconfig',
      description: 'Ağ yapılandırması bilgilerini görüntüler',
      risk: 'düşük'
    },
    {
      keyword: 'ifconfig',
      description: 'Linux sistemlerde ağ yapılandırması bilgilerini görüntüler',
      risk: 'düşük'
    },
    {
      keyword: 'ping',
      description: 'Belirtilen adrese ping gönderir ve bağlantı durumunu kontrol eder',
      risk: 'düşük'
    },
    {
      keyword: 'tracert',
      description: 'Belirtilen adrese paket rotasını izler',
      risk: 'düşük'
    },
    {
      keyword: 'traceroute',
      description: 'Linux sistemlerde belirtilen adrese paket rotasını izler',
      risk: 'düşük'
    },
    {
      keyword: 'nslookup',
      description: 'DNS sorguları yapar',
      risk: 'düşük'
    },
    {
      keyword: 'netstat',
      description: 'Ağ bağlantılarını ve portları görüntüler',
      risk: 'düşük'
    },
    {
      keyword: 'dir',
      description: 'Windows sistemlerde dizin içeriğini listeler',
      risk: 'düşük'
    },
    {
      keyword: 'ls',
      description: 'Linux sistemlerde dizin içeriğini listeler',
      risk: 'düşük'
    },
    {
      keyword: 'cd',
      description: 'Dizin değiştirir',
      risk: 'düşük'
    },
    {
      keyword: 'systeminfo',
      description: 'Windows sistem bilgilerini görüntüler',
      risk: 'düşük'
    },
    {
      keyword: 'uname',
      description: 'Linux sistem bilgilerini görüntüler',
      risk: 'düşük'
    },
    {
      keyword: 'tasklist',
      description: 'Windows çalışan süreçleri listeler',
      risk: 'düşük'
    },
    {
      keyword: 'ps',
      description: 'Linux çalışan süreçleri listeler',
      risk: 'düşük'
    },
    {
      keyword: 'sfc',
      description: 'Windows sistem dosyalarını denetler ve onarır',
      risk: 'orta'
    },
    {
      keyword: 'chkdsk',
      description: 'Disk hatalarını kontrol eder ve onarır',
      risk: 'orta'
    },
    {
      keyword: 'fsck',
      description: 'Linux sistemlerde dosya sistemi kontrolü yapar',
      risk: 'orta'
    },
    {
      keyword: 'taskkill',
      description: 'Windows süreçlerini sonlandırır',
      risk: 'orta'
    },
    {
      keyword: 'kill',
      description: 'Linux süreçlerini sonlandırır',
      risk: 'orta'
    },
    {
      keyword: 'regedit',
      description: 'Windows kayıt defterini düzenler',
      risk: 'yüksek'
    },
    {
      keyword: 'reg',
      description: 'Windows kayıt defteri işlemleri yapar',
      risk: 'yüksek'
    },
    {
      keyword: 'diskpart',
      description: 'Disk bölümleri üzerinde işlemler yapar',
      risk: 'yüksek'
    },
    {
      keyword: 'fdisk',
      description: 'Linux sistemlerde disk bölümleri üzerinde işlemler yapar',
      risk: 'yüksek'
    },
    {
      keyword: 'format',
      description: 'Disk biçimlendirir',
      risk: 'yüksek'
    },
    {
      keyword: 'mkfs',
      description: 'Linux sistemlerde dosya sistemi oluşturur',
      risk: 'yüksek'
    },
    {
      keyword: 'del',
      description: 'Windows sistemlerde dosya siler',
      risk: 'orta'
    },
    {
      keyword: 'rm',
      description: 'Linux sistemlerde dosya siler',
      risk: 'orta'
    }
  ];