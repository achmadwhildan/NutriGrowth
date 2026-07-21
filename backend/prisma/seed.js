import prisma from '../src/config/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Starting seeder...');

  // Hapus semua data yang ada sebelumnya (untuk menghindari bentrok ID)
  // Cascade delete seharusnya menangani relasi
  await prisma.chatMessage.deleteMany({});
  await prisma.consultation.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.doctorSchedule.deleteMany({});
  await prisma.growthLog.deleteMany({});
  await prisma.child.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Buat User Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin NutriGrowth',
      email: 'admin@nutrigrowth.com',
      password: passwordHash,
      role: 'ADMIN',
      isVerified: true
    }
  });

  // 2. Buat User Seller
  const seller = await prisma.user.create({
    data: {
      name: 'Toko Nutrisi Sehat',
      email: 'seller@nutrigrowth.com',
      password: passwordHash,
      role: 'SELLER',
      isVerified: true,
      address: 'Jl. Sehat Raya No 10, Jakarta'
    }
  });

  // 3. Buat User Dokter
  const doctorUser = await prisma.user.create({
    data: {
      name: 'Dr. Sarah Setiawan, Sp.A',
      email: 'doctor@nutrigrowth.com',
      password: passwordHash,
      role: 'DOCTOR',
      isVerified: true,
      phoneNumber: '081234567890'
    }
  });

  const doctorProfile = await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
      name: doctorUser.name,
      specialization: 'Dokter Anak',
      pricePerSession: 150000.00,
      isActive: true,
      bio: 'Dokter Sarah adalah spesialis anak dengan pengalaman lebih dari 10 tahun di bidang gizi dan tumbuh kembang balita.',
      education: 'S1 Kedokteran UI, Sp.A UI',
      expertise: 'Gizi Anak, Tumbuh Kembang, Imunisasi',
      photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
    }
  });

  // Buat jadwal untuk dokter
  await prisma.doctorSchedule.createMany({
    data: [
      { doctorId: doctorProfile.id, dayOfWeek: 'Senin', times: ['09:00', '10:00', '13:00'] },
      { doctorId: doctorProfile.id, dayOfWeek: 'Selasa', times: ['09:00', '11:00'] },
      { doctorId: doctorProfile.id, dayOfWeek: 'Kamis', times: ['14:00', '15:00', '16:00'] }
    ]
  });

  // 4. Buat User Parent
  const parent = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'parent@nutrigrowth.com',
      password: passwordHash,
      role: 'PARENT',
      isVerified: true,
      address: 'Jl. Merdeka No 45, Bandung',
      phoneNumber: '089876543210'
    }
  });

  // Buat Data Anak
  const child = await prisma.child.create({
    data: {
      userId: parent.id,
      name: 'Bima Santoso',
      gender: 'L',
      birthDate: new Date('2023-01-15T00:00:00.000Z'),
      birthWeight: 3.2,
      birthHeight: 50.0
    }
  });

  // Buat riwayat pertumbuhan
  await prisma.growthLog.createMany({
    data: [
      { childId: child.id, measurementDate: new Date('2023-02-15'), weight: 4.5, height: 55, zScoreStatus: 'NORMAL' },
      { childId: child.id, measurementDate: new Date('2023-04-15'), weight: 6.0, height: 61, zScoreStatus: 'NORMAL' },
      { childId: child.id, measurementDate: new Date('2023-07-15'), weight: 7.5, height: 68, zScoreStatus: 'NORMAL' },
      { childId: child.id, measurementDate: new Date('2024-01-15'), weight: 9.8, height: 75, zScoreStatus: 'NORMAL' }
    ]
  });

  // 5. Buat Produk
  const products = [
    {
      name: 'Susu Formula Bayi 0-6 Bulan',
      description: 'Susu formula lengkap gizi untuk awal kehidupan.',
      category: 'Susu Formula',
      price: 120000.00,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Bubur Bayi Organik Rasa Pisang',
      description: 'MPASI organik untuk bayi usia 6 bulan ke atas.',
      category: 'MPASI',
      price: 45000.00,
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Vitamin D Drops Bayi',
      description: 'Suplemen vitamin D untuk tulang sehat.',
      category: 'Suplemen',
      price: 85000.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300'
    }
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }

  // Ambil salah satu produk untuk order dummy
  const allProducts = await prisma.product.findMany();
  const sampleProduct = allProducts[0];

  // 6. Buat Contoh Pesanan (Order)
  const order = await prisma.order.create({
    data: {
      userId: parent.id,
      totalAmount: 120000.00,
      shippingAddress: 'Jl. Merdeka No 45, Bandung',
      status: 'PENDING',
      items: {
        create: [
          {
            productId: sampleProduct.id,
            quantity: 1,
            priceAtPurchase: sampleProduct.price
          }
        ]
      }
    }
  });

  // 7. Buat Contoh Konsultasi
  const consultation = await prisma.consultation.create({
    data: {
      userId: parent.id,
      doctorId: doctorProfile.id,
      scheduledAt: new Date(Date.now() + 86400000), // besok
      status: 'ONGOING'
    }
  });

  await prisma.chatMessage.createMany({
    data: [
      { consultationId: consultation.id, senderRole: 'PARENT', senderId: parent.id, text: 'Halo dok, saya ingin konsultasi berat badan anak.', isRead: true, createdAt: new Date(Date.now() - 3600000) },
      { consultationId: consultation.id, senderRole: 'DOCTOR', senderId: doctorProfile.id, text: 'Halo Bapak/Ibu, silakan. Ada yang bisa saya bantu?', isRead: true, createdAt: new Date(Date.now() - 3500000) }
    ]
  });

  console.log('Seeder completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
