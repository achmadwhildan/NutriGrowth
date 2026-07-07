import prisma from '../src/config/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Checking existing database records...');
  const existingUserCount = await prisma.user.count();

  if (existingUserCount > 0) {
    console.log('Database already contains data. Skipping seed to avoid overwriting existing records.');
    return;
  }

  console.log('No existing users found. Starting seeding...');

  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin NutriGrow',
      email: 'admin@nutrigrow.com',
      password: passwordHash,
      role: 'ADMIN',
      phoneNumber: '081234567890',
      address: 'Kantor Pusat NutriGrow, Jakarta',
    },
  });

  const parent1 = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'budi@gmail.com',
      password: passwordHash,
      role: 'PARENT',
      phoneNumber: '081234567891',
      address: 'Jl. Melati No. 12, Bandung',
    },
  });

  const parent2 = await prisma.user.create({
    data: {
      name: 'Siti Rahma',
      email: 'siti@gmail.com',
      password: passwordHash,
      role: 'PARENT',
      phoneNumber: '081234567892',
      address: 'Jl. Mawar No. 45, Surabaya',
    },
  });

  const seller = await prisma.user.create({
    data: {
      name: 'Toko Nutrisi Sehat',
      email: 'seller@nutrigrow.com',
      password: passwordHash,
      role: 'SELLER',
      phoneNumber: '081234567893',
      address: 'Ruko Hijau Indah Blok C, Tangerang',
    },
  });

  console.log('Users created.');

  // 2. Create Children for Budi & Siti
  const child1 = await prisma.child.create({
    data: {
      userId: parent1.id,
      name: 'Andi Santoso',
      gender: 'L',
      birthDate: new Date('2024-05-15'),
      birthWeight: 3.2,
      birthHeight: 49.0,
    },
  });

  const child2 = await prisma.child.create({
    data: {
      userId: parent1.id,
      name: 'Anisa Santoso',
      gender: 'P',
      birthDate: new Date('2025-01-10'),
      birthWeight: 2.9,
      birthHeight: 47.5,
    },
  });

  const child3 = await prisma.child.create({
    data: {
      userId: parent2.id,
      name: 'Rian Rahma',
      gender: 'L',
      birthDate: new Date('2023-10-20'),
      birthWeight: 3.4,
      birthHeight: 50.0,
    },
  });

  console.log('Children created.');

  // 3. Create Growth Logs (Catatan Tumbuh Kembang)
  await prisma.growthLog.createMany({
    data: [
      {
        childId: child1.id,
        measurementDate: new Date('2024-06-15'),
        weight: 4.1,
        height: 52.5,
        headCircumference: 36.5,
        zScoreStatus: 'NORMAL',
        note: 'Perkembangan bulan ke-1 sangat baik, ASI eksklusif lancar.',
      },
      {
        childId: child1.id,
        measurementDate: new Date('2024-07-15'),
        weight: 5.0,
        height: 55.0,
        headCircumference: 38.0,
        zScoreStatus: 'NORMAL',
        note: 'Berat badan naik stabil.',
      },
      {
        childId: child1.id,
        measurementDate: new Date('2024-08-15'),
        weight: 5.8,
        height: 57.5,
        headCircumference: 39.5,
        zScoreStatus: 'NORMAL',
        note: 'Anak aktif bergerak dan mulai belajar tengkurap.',
      },
      {
        childId: child1.id,
        measurementDate: new Date('2024-09-15'),
        weight: 6.4,
        height: 59.0,
        headCircumference: 40.5,
        zScoreStatus: 'RISK',
        note: 'Kenaikan berat badan melambat, perlu pemantauan porsi makan ibu menyusui.',
      },
    ],
  });

  await prisma.growthLog.createMany({
    data: [
      {
        childId: child3.id,
        measurementDate: new Date('2023-11-20'),
        weight: 4.3,
        height: 53.0,
        headCircumference: 37.0,
        zScoreStatus: 'NORMAL',
        note: 'Bayi sehat dan aktif.',
      },
      {
        childId: child3.id,
        measurementDate: new Date('2023-12-20'),
        weight: 5.2,
        height: 56.2,
        headCircumference: 38.5,
        zScoreStatus: 'NORMAL',
        note: 'Perkembangan sesuai usia.',
      },
    ],
  });

  console.log('Growth logs created.');

  // 4. Create Doctors
  const doctor1 = await prisma.doctor.create({
    data: {
      name: 'Dr. Sp.A. Budi Darmawan',
      specialization: 'Spesialis Anak (Nutrisi & Tumbuh Kembang)',
      pricePerSession: 150000.00,
      isActive: true,
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      name: 'Dr. Sp.A. Maria Lestari',
      specialization: 'Spesialis Anak (Alergi & Imunologi)',
      pricePerSession: 180000.00,
      isActive: true,
    },
  });

  const doctor3 = await prisma.doctor.create({
    data: {
      name: 'Dr. Sp.A. Ahmad Fauzi',
      specialization: 'Spesialis Anak Umum',
      pricePerSession: 120000.00,
      isActive: false,
    },
  });

  console.log('Doctors created.');

  // 5. Create Consultations
  await prisma.consultation.create({
    data: {
      userId: parent1.id,
      doctorId: doctor1.id,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'PAID',
    },
  });

  await prisma.consultation.create({
    data: {
      userId: parent2.id,
      doctorId: doctor2.id,
      scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      status: 'PENDING',
    },
  });

  console.log('Consultations created.');

  // 7a. Create Chat Messages for consultations
  console.log('Seeding chat messages for consultations...');
  // fetch consultations we just created
  const consults = await prisma.consultation.findMany({ where: { userId: { in: [parent1.id, parent2.id] } }, orderBy: { createdAt: 'asc' } });
  if (consults.length > 0) {
    const c1 = consults[0];
    const c2 = consults[1];

    await prisma.chatMessage.createMany({
      data: [
        {
          consultationId: c1.id,
          senderId: parent1.id,
          senderRole: 'PARENT',
          text: 'Halo Dok, saya ingin konsultasi mengenai perkembangan berat badan anak saya.',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        {
          consultationId: c1.id,
          senderId: null,
          senderRole: 'DOCTOR',
          text: 'Halo Budi, tentu. Bisa ceritakan lebih detail mengenai pola makan dan frekuensi menyusu?',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
        },
        {
          consultationId: c1.id,
          senderId: parent1.id,
          senderRole: 'PARENT',
          text: 'Anak biasanya menyusu 6-7 kali sehari dan mulai MPASI sedikit demi sedikit.',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
        },

        // messages for second consultation
        {
          consultationId: c2.id,
          senderId: parent2.id,
          senderRole: 'PARENT',
          text: 'Dok, apakah saya perlu khawatir jika anak saya belum tumbuh sesuai kurva?',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        },
        {
          consultationId: c2.id,
          senderId: null,
          senderRole: 'DOCTOR',
          text: 'Mari kita cek riwayat pertumbuhan dan jadwalkan pemeriksaan bila diperlukan.',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 19),
        },
      ],
    });
  }

  // 6. Create Products
  const prod1 = await prisma.product.create({
    data: {
      name: 'Suku Formula SGM Eksplor 1+',
      description: 'Susu pertumbuhan untuk anak usia 1-3 tahun untuk mendukung nutrisi lengkap dan tumbuh kembang buah hati Anda.',
      category: 'Susu Anak',
      price: 95000.00,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300',
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      name: 'Bubur Bayi Milna Beras Merah',
      description: 'Bubur bayi pendamping ASI (MPASI) rasa beras merah lezat kaya akan zat besi, kalsium, dan vitamin lengkap.',
      category: 'Makanan Bayi',
      price: 22000.00,
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=300',
    },
  });

  const prod3 = await prisma.product.create({
    data: {
      name: 'Multivitamin Anak Scott\'s Emulsion',
      description: 'Minyak hati ikan kod rasa jeruk untuk mendukung daya tahan tubuh anak, pertumbuhan tulang, serta perkembangan otak.',
      category: 'Suplemen',
      price: 68000.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1626816585974-7ee1a8ad0901?q=80&w=300',
    },
  });

  console.log('Products created.');

  // 7. Create Orders & OrderItems
  const order1 = await prisma.order.create({
    data: {
      userId: parent1.id,
      totalAmount: 163000.00,
      shippingAddress: 'Jl. Melati No. 12, Bandung',
      status: 'PROCESSING',
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        productId: prod1.id,
        quantity: 1,
        priceAtPurchase: 95000.00,
      },
      {
        orderId: order1.id,
        productId: prod3.id,
        quantity: 1,
        priceAtPurchase: 68000.00,
      },
    ],
  });

  console.log('Orders created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
