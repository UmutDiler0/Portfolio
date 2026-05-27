export interface TranslationDict {
  nav: {
    about: string;
    experiences: string;
    projects: string;
    connections: string;
    downloadCv: string;
  };
  hero: {
    greeting: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    title: string;
    heading: string;
    p1: string;
    p2: string;
    p3: string;
    contact: {
      title: string;
      phone: string;
      email: string;
      github: string;
      linkedin: string;
    };
    timeline: {
      title: string;
      item1: {
        year: string;
        title: string;
        company: string;
        desc: string;
      };
      item2: {
        year: string;
        title: string;
        company: string;
        desc: string;
      };
      item3: {
        year: string;
        title: string;
        company: string;
        desc: string;
      };
    };
  };
  placeholders: {
    backHome: string;
    experiences: {
      title: string;
      subtitle: string;
      desc: string;
    };
    projects: {
      title: string;
      subtitle: string;
      desc: string;
    };
    connections: {
      title: string;
      subtitle: string;
      desc: string;
      formName: string;
      formEmail: string;
      formMessage: string;
      formSubmit: string;
      formSuccess: string;
      formSending: string;
      visitCount: string;
    };
  };
  footer: {
    rights: string;
    madeWith: string;
  };
}

export const translations: Record<'en' | 'tr', TranslationDict> = {
  en: {
    nav: {
      about: 'About Me',
      experiences: 'Experiences',
      projects: 'Projects',
      connections: 'Connections',
      downloadCv: 'Download CV',
    },
    hero: {
      greeting: "Hello, I'm",
      title: 'Crafting Next-Gen Web Solutions',
      subtitle: 'Full-Stack Software Engineer specializing in building highly scalable, responsive web applications with cloud-native integrations.',
      ctaPrimary: 'Connect With Me',
      ctaSecondary: 'View My Work',
    },
    about: {
      title: 'About Me',
      heading: 'Designing and developing high-performance applications with beautiful user experiences.',
      p1: 'I am a passionate software engineer with extensive experience in the modern JavaScript/TypeScript ecosystem. I love turning complex logic into beautiful, user-centered digital products.',
      p2: 'My development philosophy centers on writing clean, self-documenting code and designing performant software architectures that grow gracefully under high load.',
      p3: 'When I am not coding, you can find me exploring open-source projects, playing chess, or designing new creative UI components.',
      contact: {
        title: 'Connect & Reach Out',
        phone: 'Phone',
        email: 'Email',
        github: 'GitHub',
        linkedin: 'LinkedIn',
      },
      timeline: {
        title: 'Milestones & Journey',
        item1: {
          year: '2024 - Present',
          title: 'Senior Software Engineer',
          company: 'HyperScale Solutions',
          desc: 'Leading a core engineering team developing enterprise dashboard platforms, migrating legacy applications to React/TS, and building scalable serverless backend APIs.',
        },
        item2: {
          year: '2022 - 2024',
          title: 'Full-Stack Developer',
          company: 'Novatech Labs',
          desc: 'Architected multiple SaaS products using Next.js and Firebase. Implemented real-time synchronization, optimized bundle sizes, and secured client APIs.',
        },
        item3: {
          year: '2020 - 2022',
          title: 'Software Developer',
          company: 'Zenith Software Group',
          desc: 'Developed responsive frontend interfaces, collaborated with product managers on design systems, and configured CI/CD deployment pipelines.',
        },
      },
    },
    placeholders: {
      backHome: 'Back to About Me',
      experiences: {
        title: 'Professional Experiences',
        subtitle: 'My Career Journey & Contributions',
        desc: 'This section is currently under development. Soon, you will find a full, interactive dashboard detailing my professional history, roles, key achievements, and the technical impact I have delivered across multiple organizations.',
      },
      projects: {
        title: 'Featured Works & Projects',
        subtitle: 'A Collection of Creations & Deployments',
        desc: 'This section is currently under development. Soon, you will be able to browse a curated selection of open-source contributions, web utilities, and full-stack applications complete with live links, GitHub repos, and tech stacks.',
      },
      connections: {
        title: 'Get in Touch',
        subtitle: 'Let\'s collaborate on something amazing!',
        desc: 'Have a project in mind, looking for a consultation, or just want to say hi? Feel free to drop a message through this form. Responses are synced in real-time with our Firebase integration.',
        formName: 'Full Name',
        formEmail: 'Email Address',
        formMessage: 'Message',
        formSubmit: 'Send Message',
        formSuccess: 'Thank you! Your message has been received successfully.',
        formSending: 'Sending message...',
        visitCount: 'Total interactions registered on Firebase',
      },
    },
    footer: {
      rights: 'All rights reserved.',
      madeWith: 'Designed & developed with ❤️ using React + TypeScript & Firebase',
    },
  },
  tr: {
    nav: {
      about: 'Hakkımda',
      experiences: 'Deneyimler',
      projects: 'Projeler',
      connections: 'Bağlantılar',
      downloadCv: 'CV İndir',
    },
    hero: {
      greeting: 'Merhaba, Ben',
      title: 'Gelecek Nesil Web Çözümleri Geliştiriyorum',
      subtitle: 'Bulut entegrasyonlarına sahip, yüksek düzeyde ölçeklenebilir ve duyarlı web uygulamaları geliştirme konusunda uzmanlaşmış Kıdemli Yazılım Mühendisi.',
      ctaPrimary: 'Benimle İletişime Geç',
      ctaSecondary: 'Projelerimi İncele',
    },
    about: {
      title: 'Hakkımda',
      heading: 'Harika kullanıcı deneyimlerine sahip yüksek performanslı uygulamalar tasarlıyorum.',
      p1: 'Modern JavaScript/TypeScript ekosisteminde kapsamlı deneyime sahip, tutkulu bir yazılım mühendisiyim. Karmaşık mantıkları güzel, kullanıcı odaklı dijital ürünlere dönüştürmeyi çok seviyorum.',
      p2: 'Geliştirme felsefem, temiz ve kendi kendini belgeleyen kod yazmak ve yüksek yük altında sorunsuz büyüyen yüksek performanslı yazılım mimarileri tasarlamak üzerine kuruludur.',
      p3: 'Kod yazmadığım zamanlarda beni açık kaynaklı projeleri keşfiberken, satranç oynarken veya yeni yaratıcı kullanıcı arayüzü bileşenleri tasarlarken bulabilirsiniz.',
      contact: {
        title: 'İletişim & Bağlantılar',
        phone: 'Telefon',
        email: 'E-posta',
        github: 'GitHub',
        linkedin: 'LinkedIn',
      },
      timeline: {
        title: 'Önemli Kilometre Taşları',
        item1: {
          year: '2024 - Günümüz',
          title: 'Kıdemli Yazılım Mühendisi',
          company: 'HyperScale Solutions',
          desc: 'Kurumsal panel platformları geliştiren çekirdek bir mühendislik ekibine liderlik etme, eski uygulamaları React/TS\'ye taşıma ve ölçeklenebilir sunucusuz API\'ler oluşturma.',
        },
        item2: {
          year: '2022 - 2024',
          title: 'Full-Stack Geliştirici',
          company: 'Novatech Labs',
          desc: 'Next.js ve Firebase kullanarak çok sayıda SaaS ürünü tasarladım. Gerçek zamanlı senkronizasyon, paket boyutlarını optimize etme ve istemci API\'lerini güvenli hale getirme işlemlerini yönettim.',
        },
        item3: {
          year: '2020 - 2022',
          title: 'Yazılım Geliştirici',
          company: 'Zenith Yazılım Grubu',
          desc: 'Kullanıcı dostu arayüzler tasarladım, tasarım sistemleri üzerine ürün yöneticileriyle iş birliği yaptım ve CI/CD dağıtım süreçlerini yapılandırdım.',
        },
      },
    },
    placeholders: {
      backHome: 'Hakkımda Sayfasına Dön',
      experiences: {
        title: 'Mesleki Deneyimler',
        subtitle: 'Kariyer Yolculuğum ve Katkılarım',
        desc: 'Bu bölüm şu anda yapım aşamasındadır. Yakında, profesyonel geçmişimi, rollerimi, temel başarılarımı ve farklı kuruluşlarda sağladığım teknik etkileri detaylandıran tam etkileşimli bir panelle karşınızda olacağım.',
      },
      projects: {
        title: 'Öne Çıkan Çalışmalarım',
        subtitle: 'Tasarladığım ve Dağıttığım Projeler',
        desc: 'Bu bölüm şu anda yapım aşamasındadır. Yakında, canlı bağlantılar, GitHub depoları ve kullanılan teknoloji yığınlarıyla tamamlanan açık kaynaklı katkılarımı, web araçlarımı ve full-stack uygulamalarımı burada inceleyebileceksiniz.',
      },
      connections: {
        title: 'İletişime Geçin',
        subtitle: 'Birlikte harika projeler üretelim!',
        desc: 'Aklınızda bir proje mi var, danışmanlık mı arıyorsunuz ya da sadece merhaba mı demek istiyorsunuz? Bu form üzerinden bana kolayca mesaj gönderebilirsiniz. Mesajlarınız gerçek zamanlı olarak Firebase entegrasyonumuzla senkronize edilir.',
        formName: 'Ad Soyad',
        formEmail: 'E-posta Adresi',
        formMessage: 'Mesajınız',
        formSubmit: 'Mesajı Gönder',
        formSuccess: 'Teşekkürler! Mesajınız başarıyla iletildi.',
        formSending: 'Mesaj gönderiliyor...',
        visitCount: 'Firebase üzerinde kaydedilen toplam etkileşim',
      },
    },
    footer: {
      rights: 'Tüm hakları saklıdır.',
      madeWith: 'React + TypeScript & Firebase kullanılarak ❤️ ile tasarlandı ve geliştirildi',
    },
  },
};
